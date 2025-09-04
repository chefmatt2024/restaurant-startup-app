import React from 'react';

const SectionCard = ({ 
  title, 
  description, 
  children, 
  color = 'blue',
  className = '' 
}) => {
  const getColorClasses = () => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      orange: 'bg-orange-50 border-orange-200',
      red: 'bg-red-50 border-red-200',
      pink: 'bg-pink-50 border-pink-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      gray: 'bg-gray-50 border-gray-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`rounded-lg border-2 ${getColorClasses()} ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          {description && (
            <p className="text-gray-700 leading-relaxed">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default SectionCard; 