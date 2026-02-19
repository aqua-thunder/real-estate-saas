const Plan = require("../../models/Plan-model.js");

const createPlan = async (req, res) => {
    try {
        const { name, priceMonthly, priceYearly, propertyLimit, unitLimit, managerLimit, storageLimitMB, trialDays, isActive } = req.body;
        const existsPlan = await Plan.findOne({ name });
        if (existsPlan) {
            return res.status(400).json({ message: "Plan already exists" });
        }
        const newPlan = await Plan.create({ name, priceMonthly, priceYearly, propertyLimit, unitLimit, managerLimit, storageLimitMB, trialDays, isActive });

        return res.status(201).json({ message: "Plan created successfully", newPlan });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Plan updated successfully",
            data: plan
        });

    } catch (error) {
        console.error("Update Plan Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }
        return res.status(200).json({ success: true, message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPlan, updatePlan, getAllPlans, deletePlan };
