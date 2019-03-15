import React, { Component } from 'react';

export class PaddedBar extends Component {
    render() {
        return (
            <div
                style={{ 
                    padding: "10% 15px",
                    display: "flex" 
                }}
            >
                {this.props.children}
            </div>
        );
    }
}