import React, { Component } from 'react';

export class ButtonBar extends Component<{ direction?: "row" | "column" }> {
    render() {
        return (
            <div
                style={{
                    flex: "none",
                    display: "flex",
                    flexDirection: (this.props.direction || "row"),
                    textAlign: "center",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: "5px"
                }}
            >
                {this.props.children}
            </div>
        );
    }
}