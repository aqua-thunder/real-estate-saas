import React from 'react';
import { Check, Zap } from 'lucide-react';

const plans = [
    { title: "Standard", price: "$29", features: ["Up to 5 Users", "Basic Reporting", "Email Support"], recommended: false },
    { title: "Professional", price: "$99", features: ["Up to 20 Users", "Advanced Analytics", "Priority Support", "Custom Roles"], recommended: true },
    { title: "Enterprise", price: "$299", features: ["Unlimited Users", "Dedicated Account Manager", "24/7 Support", "Audit Logs", "API Access"], recommended: false },
];

const Subscriptions = () => {
    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Subscription Plans</h2>
                <p className="text-slate-500">Choose the perfect plan for your business needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, idx) => (
                    <div key={idx} className={`relative bg-white rounded-2xl shadow-sm border ${plan.recommended ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-20' : 'border-slate-200'} p-8 hover:shadow-lg transition-shadow`}>
                        {plan.recommended && (
                            <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">RECOMMENDED</span>
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{plan.title}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                            <span className="text-slate-500 text-sm">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-3 text-slate-600 text-sm">
                                    <Check size={16} className="text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${plan.recommended
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}>
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscriptions;
