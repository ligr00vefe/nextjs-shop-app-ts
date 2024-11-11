import React from 'react';
import classNames from 'classnames';
import styles from './Tooltip.module.scss';

interface ITooltipProps {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    color?: string;
    bgColor?: string;
    orientation?: 'top' | 'right' | 'bottom' | 'left';
    message: string;
    [x: string]: any;
}

const Tooltip = ({
    top = 0,
    left = 0,
    right = 0,
    bottom = 0,
    color = '',
    bgColor = '',
    orientation = 'top',
    message,
    ...restProps
}: ITooltipProps) => {
    const style = {
        top,
        left,
        right,
        bottom,
        color,
        backgroundColor: bgColor,
    };

    const setOrientationClass = (type: string) => {
        switch (type) {
            case 'top':
                return styles.orientationTop;
            case 'left':
                return styles.orientationLeft;
            case 'right':
                return styles.orientationRight;
            case 'bottom':
                return styles.orientationBottom;
            default:
        }
    };
    return (
        <span
            role="tooltip"
            className={classNames(
                styles.tooltip,
                setOrientationClass(orientation)
            )}
            style={style}
            {...restProps}
        >
            {message}
        </span>
    );
};

export default Tooltip;
