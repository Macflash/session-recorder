import React, { Component } from 'react';
import { Screen } from './../../App';

export class TitleBar extends Component<{ title?: string, screen: Screen }> {
    render() {
        const { title, screen } = this.props;
        return (
            <div
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "auto",
                    display: "flex",
                    fontSize: "125%"
                }}>
                {(status == "recording" || status == "armed") && "Recording"}
                {title}
                {screen == "record" && <button style={{ marginLeft: "auto" }}>Listen</button>}
                {screen == "listen" && <button style={{ marginLeft: "auto" }}>Record</button>}
            </div>
        );
    }
}