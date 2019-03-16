import React, { Component, PureComponent } from 'react';
import { IButtonProps } from './buttonProps';

export interface IStopButtonProps  extends IButtonProps{
}

export class StopButton extends PureComponent<IStopButtonProps> {
    render() {
        const size = this.props.size || "75px";
        return <button
            onClick={this.props.onClick}
            title={this.props.title}
            style={{
                height: size,
                width: size,
                backgroundColor: "rgb(125,125,125)",
                border: "none",
                cursor: "pointer"
            }}
        />
    }
}