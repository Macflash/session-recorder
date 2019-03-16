import React, { Component, PureComponent } from 'react';
import { IButtonProps } from './buttonProps';

export interface ICloseButtonProps  extends IButtonProps{
}

export class CloseButton extends PureComponent<ICloseButtonProps> {
    render() {
        return <button
            className="close"
            onClick={this.props.onClick}
            title={this.props.title}
            style={{
                height: this.props.size,
                width: this.props.size || "75px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
            }}
        />
    }
}