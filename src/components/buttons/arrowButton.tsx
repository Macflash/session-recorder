import React, { Component, PureComponent } from 'react';
import { IButtonProps } from './buttonProps';

export interface IArrowButtonProps extends IButtonProps {
    direction: "left" | "right";
}

export class ArrowButton extends PureComponent<IArrowButtonProps> {
    render() {
        const { onClick, title, direction, disabled, size = "75px" } = this.props;
        const height = "calc(.5 * " + size + ")";
        const width = "calc(.8 *" + size + ")";
        const color = disabled ? "rgb(50,50,50)" : "rgb(125,125,125)";
        const unclickable = disabled || !onClick;
        return <button
            disabled={unclickable}
            onClick={onClick}
            title={title}
            style={{
                height: 0,
                width: 0,
                backgroundColor: "transparent",
                borderTop: height + " solid transparent",
                borderBottom: height + " solid transparent",
                borderLeft: direction == "right" ? width + " solid " + color : "none",
                borderRight: direction == "left" ? width + " solid " + color : "none",
                cursor: unclickable ? undefined : "pointer"
            }}
        />
    }
}