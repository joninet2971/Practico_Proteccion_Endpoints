import React from 'react';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

export const ActionButton = ({
  icon,
  label,
  onClick,
  severity = 'primary',
  className = '',
  disabled = false,
  loading = false,
  tooltip,
  tooltipOptions = { position: 'top' }
}) => {
  return (
    <Button
      icon={icon}
      label={label}
      onClick={onClick}
      className={classNames('p-button-sm', className)}
      severity={severity}
      disabled={disabled || loading}
      loading={loading}
      tooltip={tooltip}
      tooltipOptions={tooltipOptions}
    />
  );
};

export const PrimaryButton = (props) => (
  <ActionButton {...props} className={classNames('mr-2', props.className)} />
);

export const SuccessButton = (props) => (
  <ActionButton severity="success" {...props} className={classNames('mr-2', props.className)} />
);

export const DangerButton = (props) => (
  <ActionButton severity="danger" {...props} className={classNames('mr-2', props.className)} />
);

export const SecondaryButton = (props) => (
  <ActionButton severity="secondary" {...props} className={classNames('mr-2', props.className)} />
);

export const ActionButtons = ({ children, className = '' }) => (
  <div className={classNames('flex flex-wrap gap-2 mt-4', className)}>
    {children}
  </div>
);
