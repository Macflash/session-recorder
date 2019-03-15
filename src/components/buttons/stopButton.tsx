import React, { Component, PureComponent } from 'react';

export interface IStopButtonProps {
    onClick: () => void;
    title: string;
    size?: string;
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