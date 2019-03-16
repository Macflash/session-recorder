import React, { Component, PureComponent } from 'react';
import { IButtonProps } from './buttonProps';

export interface ICloseButtonProps  extends IButtonProps{
}

export class CloseButton extends PureComponent<ICloseButtonProps> {
    render() {
        const size = this.props.size || "75px";
        return <button
            className="close"
            onClick={this.props.onClick}
            title={this.props.title}
            style={{
                backgroundColor: "transparent",
                border: "none",
                width: "75px",
                cursor: "pointer"
            }}
        />
    }
}