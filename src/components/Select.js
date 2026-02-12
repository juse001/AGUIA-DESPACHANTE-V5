import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ChevronDown } from 'lucide-react';
export const Select = React.forwardRef(({ label, error, options, helperText, className = '', ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsxs("div", { className: "relative", children: [_jsxs("select", { ref: ref, className: `
              block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:ring-offset-0 focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              appearance-none bg-white
              ${error ? 'border-red-500' : ''}
              ${className}
            `, ...props, children: [_jsx("option", { value: "", children: "Selecione uma op\u00E7\u00E3o" }), options.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] }), _jsx(ChevronDown, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" })] }), error && _jsx("p", { className: "mt-1 text-sm text-red-500", children: error }), helperText && !error && _jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText })] }));
});
Select.displayName = 'Select';
