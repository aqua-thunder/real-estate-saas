import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />,
        error: <AlertCircle className="w-5 h-5 text-[var(--color-primary)]" />,
        warning: <AlertTriangle className="w-5 h-5 text-[var(--color-primary)]" />,
        info: <Info className="w-5 h-5 text-[var(--color-primary)]" />,
    };

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl
                bg-[var(--bg-card)]
                border border-[var(--color-card)]
                shadow-lg
                min-w-[300px] max-w-md
                transition-all duration-300 transform
                ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}
            `}
        >
            {/* Left Accent Line */}
            <div className="absolute left-0 top-0 h-full w-1 bg-[var(--color-primary)] rounded-l-2xl"></div>

            <div className="flex-shrink-0 z-10">
                {icons[type]}
            </div>

            <div className="flex-1 text-sm font-medium text-[var(--text-secondary)] z-10">
                {message}
            </div>

            <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-lg text-[var(--text-card)] hover:text-[var(--color-primary)] transition-colors z-10"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
