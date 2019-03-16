import React, { Component, PureComponent } from 'react';
import { IButtonProps } from './buttonProps';

export interface IRecordButtonProps extends IButtonProps {
}

export class RecordButton extends PureComponent<IRecordButtonProps> {
    render() {
        const size = this.props.size || "75px";
        return <button
            onClick={this.props.onClick}
            title={this.props.title}
            style={{
                height: size,
                width: size,
                borderRadius: size,
                backgroundColor: "rgb(225,0,0)",
                border: "none",
                cursor: "pointer"
            }}
        />
    }
}