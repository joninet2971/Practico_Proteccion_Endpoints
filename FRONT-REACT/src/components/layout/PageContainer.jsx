import React from 'react';
import { Card } from 'primereact/card';

export const PageContainer = ({ title, children, header, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="flex justify-content-between align-items-center mb-4">
        {title && <h1 className="text-3xl font-bold text-900 mb-0">{title}</h1>}
        {header}
      </div>
      <Card className="shadow-2">
        {children}
      </Card>
    </div>
  );
};
