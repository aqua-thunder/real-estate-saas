import React from "react";

export default function Button({
  children,
  type = "primary", // Internal style key
  variant,          // External alias for type
  htmlType = "button",
  onClick,
  disabled = false,
  className = "",
  size = "md",      // xs, sm, md, lg, xl
  icon,
  fullWidth = false,
  loading = false,
  iconOnly = false,
  ...props
}) {
  const chosenVariant = variant || type;

  const baseClasses = `
    inline-flex items-center justify-center
    font-black uppercase tracking-[0.15em]
    transition-all duration-300 ease-out
    active:scale-95
    disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
    ${fullWidth ? "w-full" : "w-max"}
    ${iconOnly ? "aspect-square p-0" : ""}
  `;

  const sizeClasses = {
    xs: iconOnly ? "w-8 h-8 rounded-lg" : "px-4 py-2 text-[8px] rounded-xl gap-2",
    sm: iconOnly ? "w-10 h-10 rounded-xl" : "px-6 py-3 text-[9px] rounded-2xl gap-2",
    md: iconOnly ? "w-12 h-12 rounded-2xl" : "px-8 py-4 text-[10px] rounded-[1.5rem] gap-3",
    lg: iconOnly ? "w-14 h-14 rounded-[1.5rem]" : "px-10 py-5 text-[11px] rounded-[2rem] gap-4",
    xl: iconOnly ? "w-16 h-16 rounded-[2rem]" : "px-14 py-6 text-xs rounded-[2.5rem] gap-5",
  };

  const styles = {
    primary: `
      bg-gray-900 text-white
      hover:shadow-2xl 
      hover:-translate-y-0.5
      border border-gray-900 
    `,

    secondary: `
      bg-white text-gray-900
      border border-gray-100
      hover:border-indigo-100 hover:text-indigo-600 hover:bg-indigo-50/20
      shadow-sm hover:shadow-xl hover:shadow-gray-100
      hover:-translate-y-0.5
    `,

    outline: `
      bg-transparent
      text-[var(--color-secondary)]
      border-2 border-gray-100
      hover:border-indigo-600 hover:text-indigo-600
      hover:-translate-y-0.5
    `,

    ghost: `
      bg-transparent
      text-[var(--text-muted)]
      hover:bg-gray-50 hover:text-[var(--color-secondary)]
      tracking-[0.2em]
    `,

    danger: `
      bg-white text-rose-600
      border border-rose-100
      hover:bg-rose-600 hover:text-white hover:border-rose-600
      hover:shadow-2xl hover:shadow-rose-100
      hover:-translate-y-0.5
    `,

    success: `
      bg-white text-emerald-600
      border border-emerald-100
      hover:bg-emerald-600 hover:text-white hover:border-emerald-600
      hover:shadow-2xl hover:shadow-emerald-100
      hover:-translate-y-0.5
    `,

    indigo: `
      bg-indigo-600 text-white
      hover:bg-gray-900
      hover:shadow-2xl hover:shadow-indigo-200
      hover:-translate-y-0.5
      border border-indigo-600 hover:border-gray-900
    `,
  };

  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses} 
        ${sizeClasses[size] || sizeClasses.md} 
        ${styles[chosenVariant] || styles.primary} 
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="flex items-center justify-center">{icon}</span>
      )}
      {!iconOnly && <span>{children}</span>}
    </button>
  );
}
