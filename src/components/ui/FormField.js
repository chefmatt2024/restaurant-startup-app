import React from 'react';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  rows = 3,
  className = '',
  helpText,
  multiline = false,
  inputMode, // For mobile keyboard optimization
  ...props
}) => {
  const baseInputClasses = `
    form-input
    ${className}
  `;

  const renderInput = () => {
    // Handle multiline prop - convert to textarea type
    const inputType = multiline ? 'textarea' : type;
    
    switch (inputType) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`form-textarea ${className}`}
            {...props}
          />
        );
        
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={baseInputClasses}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            inputMode={inputMode || 'numeric'}
            className={baseInputClasses}
            disabled={props.disabled}
            {...props}
          />
        );
        
      default:
        // Auto-detect inputMode based on type for better mobile keyboards
        const getInputMode = () => {
          if (inputMode) return inputMode;
          if (type === 'email') return 'email';
          if (type === 'tel' || type === 'phone') return 'tel';
          if (type === 'url') return 'url';
          if (type === 'number' || label?.toLowerCase().includes('phone') || label?.toLowerCase().includes('mobile')) return 'tel';
          if (label?.toLowerCase().includes('price') || label?.toLowerCase().includes('cost') || label?.toLowerCase().includes('amount') || label?.toLowerCase().includes('revenue')) return 'decimal';
          if (label?.toLowerCase().includes('zip') || label?.toLowerCase().includes('postal')) return 'numeric';
          return undefined;
        };

        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            inputMode={getInputMode()}
            className={baseInputClasses}
            disabled={props.disabled}
            {...props}
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {helpText && (
        <p className="text-sm text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default FormField; 