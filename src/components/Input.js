import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Input = React.forwardRef(({ label, error, helperText, className = '', ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsx("input", { ref: ref, className: `
            block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            placeholder-gray-400
            focus:ring-offset-0 focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-red-500' : ''}
            ${className}
          `, ...props }), error && _jsx("p", { className: "mt-1 text-sm text-red-500", children: error }), helperText && !error && _jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText })] }));
});
Input.displayName = 'Input';
