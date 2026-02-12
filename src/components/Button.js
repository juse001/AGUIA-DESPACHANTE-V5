import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
};
const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};
export const Button = React.forwardRef(({ variant = 'primary', size = 'md', isLoading = false, className = '', children, ...props }, ref) => {
    return (_jsxs("button", { ref: ref, className: `
          inline-flex items-center justify-center gap-2
          rounded-md font-medium
          focus:outline-none focus:ring-2 focus:ring-offset-2
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `, disabled: isLoading || props.disabled, ...props, children: [isLoading && (_jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" })), children] }));
});
Button.displayName = 'Button';
