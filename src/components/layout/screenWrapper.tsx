import React, { Component } from 'react';

export class ScreenWrapper extends Component {
    render() {
        return (
            <div
                style={{
                    MsUserSelect: "none",
                    MozUserSelect: "none",
                    userSelect: "none",
                    position: "absolute",
                    top: "2.5%",
                    bottom: "5%",
                    left: "5%",
                    right: "5%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                }}
            >
                {this.props.children}
            </div>
        );
    }
}