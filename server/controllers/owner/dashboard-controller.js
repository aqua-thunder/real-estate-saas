const Property = require("../../models/Property-Model");
const Unit = require("../../models/Unit-model");
const Invoice = require("../../models/Invoice-model");
const Maintenance = require("../../models/Maintenance-model");
const Owner = require("../../models/Owner-model");

const getOwnerDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find or create owner profile to get the correct ID for property queries
        let ownerProfile = await Owner.findOne({ user: userId });

        if (!ownerProfile) {
            // Create owner profile if it doesn't exist for consistency with property-controller
            ownerProfile = await Owner.create({
                user: userId,
                ownerType: "INDIVIDUAL",
                contactNumber: req.user.phone || "0000000000",
                isApproved: true
            });
        }

        const ownerProfileId = ownerProfile._id;

        // 1. Properties - use ownerProfileId because Property model 'owner' field refs Owner model
        const properties = await Property.find({ owner: ownerProfileId });
        const propertyIds = properties.map(p => p._id);
        const totalProperties = properties.length;

        // 2 & 3 & 4. Units
        const units = await Unit.find({ propertyId: { $in: propertyIds } });
        const totalUnits = units.length;

        let occupiedUnits = 0;
        let vacantUnits = 0;
        let otherUnits = 0;

        units.forEach(unit => {
            if (unit.status === "Occupied") occupiedUnits++;
            else if (unit.status === "Vacant") vacantUnits++;
            else otherUnits++;
        });

        // 5. Monthly Rental Income (Current month)
        // Use userId because Invoice model 'ownerId' field refs User model
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const currentMonthInvoices = await Invoice.find({
            ownerId: userId,
            status: "Paid",
            paidAt: { $gte: startOfMonth, $lt: startOfNextMonth }
        });

        const monthlyRentalIncome = currentMonthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

        // 6. Pending Maintenance
        // Use userId because Maintenance model 'ownerId' field refs User model
        const pendingMaintenanceApprovals = await Maintenance.countDocuments({
            ownerId: userId,
            status: "Pending"
        });

        // 7. Income Overview Chart
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const incomeData = await Invoice.aggregate([
            {
                $match: {
                    ownerId: userId,
                    status: "Paid",
                    paidAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$paidAt" },
                        month: { $month: "$paidAt" }
                    },
                    total: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Generate the last 6 months including the current month
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            months.push({
                name: `${monthName} ${d.getFullYear()}`,
                shortName: `${monthName} ${d.getFullYear()}`
            });
        }

        const formattedIncomeChart = months.map(m => {
            const match = incomeData.find(item => {
                const date = new Date(item._id.year, item._id.month - 1);
                const name = `${date.toLocaleString('default', { month: 'short' })} ${item._id.year}`;
                return name === m.name;
            });
            return {
                name: m.name,
                income: match ? match.total : 0
            };
        });

        // 8. Occupancy Rate Chart (Format for UI)
        const occupancyChart = [
            { name: "Occupied", value: occupiedUnits },
            { name: "Vacant", value: vacantUnits },
            { name: "Other", value: otherUnits }
        ];

        return res.status(200).json({
            success: true,
            data: {
                totalProperties,
                totalUnits,
                occupiedUnits,
                vacantUnits,
                monthlyRentalIncome,
                pendingMaintenanceApprovals,
                incomeChart: formattedIncomeChart,
                occupancyChart
            }
        });

    } catch (error) {
        console.error("Owner Dashboard Error:", error);
        res.status(500).json({ success: false, message: "Error fetching dashboard data" });
    }
};

module.exports = {
    getOwnerDashboardData
};

