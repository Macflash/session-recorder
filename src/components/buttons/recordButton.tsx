import React, { Component, PureComponent } from 'react';
import { IButtonProps } from './buttonProps';

export interface IRecordButtonProps extends IButtonProps {
}

export class RecordButton extends PureComponent<IRecordButtonProps> {
    render() {
        const { onClick, title, disabled, size = "75px" } = this.props;
        const color = disabled ? "rgb(125,0,0)" : "rgb(225,0,0)";
        const unclickable = disabled || !onClick;
        return <button
            onClick={onClick}
            title={title}
            disabled={unclickable}
            style={{
                height: size,
                width: size,
                borderRadius: size,
                backgroundColor: color,
                border: "none",
                cursor: unclickable ? undefined : "pointer",
            }}
        />
    }
}