import React, { Component, PureComponent } from 'react';

export interface IRecordButtonProps {
    onClick: () => void;
    title: string;
    size?: string;
}

export class RecordButton extends PureComponent<IRecordButtonProps> {
    render() {
        const size = this.props.size || "50px";
        return <button
            onClick={this.props.onClick}
            title={this.props.title}
            style={{
                height: size,
                width: size,
                borderRadius: size,
                backgroundColor: "rgb(225,0,0)",
                border: "none",
                margin: "10px",
                cursor: "pointer"
            }}
        />
    }
}