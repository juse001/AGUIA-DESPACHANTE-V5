import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
const iconMap = {
    error: _jsx(AlertCircle, { className: "w-5 h-5" }),
    success: _jsx(CheckCircle, { className: "w-5 h-5" }),
    warning: _jsx(AlertCircle, { className: "w-5 h-5" }),
    info: _jsx(Info, { className: "w-5 h-5" }),
};
const styleMap = {
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        text: 'text-red-700',
    },
    success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        text: 'text-green-700',
    },
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
        text: 'text-yellow-700',
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-700',
    },
};
export const Alert = ({ type, title, message, onClose, dismissible = true, }) => {
    const [visible, setVisible] = React.useState(true);
    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };
    if (!visible)
        return null;
    const styles = styleMap[type];
    return (_jsxs("div", { className: `border ${styles.border} ${styles.bg} rounded-lg p-4 flex gap-3`, children: [_jsx("div", { className: styles.icon, children: iconMap[type] }), _jsxs("div", { className: "flex-1", children: [title && _jsx("h3", { className: `font-semibold ${styles.text}`, children: title }), _jsx("p", { className: styles.text, children: message })] }), dismissible && (_jsx("button", { onClick: handleClose, className: `${styles.text} hover:opacity-75 flex-shrink-0`, children: _jsx(X, { className: "w-4 h-4" }) }))] }));
};
