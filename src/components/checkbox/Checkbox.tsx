import React from 'react';

interface ICheckboxProps {
    disabled?: boolean;
    checked?: boolean;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLElement>) => void;
    [x: string]: any;
}

const Checkbox = ({
    disabled = false,
    checked = false,
    label,
    onChange,
    ...restProps
}: ICheckboxProps) => {
    return (
        <label style={{ fontSize: '1.4rem' }}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                {...restProps}
            />{' '}
            {label}
        </label>
    );
};

export default Checkbox;
