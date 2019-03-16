import React, { Component } from 'react';

export class PaddedBar extends Component<{style?: React.CSSProperties}> {
    render() {
        return (
            <div
                style={{ 
                    padding: "10% 15px",
                    display: "flex",
                    alignItems: "center",
                    ...this.props.style
                }}
            >
                {this.props.children}
            </div>
        );
    }
}