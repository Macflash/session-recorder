import React, { Component } from 'react';
import { CurrentScreen } from '../screens/baseScreen';

export interface ITitleBarProps {
    title?: string,
    screen: CurrentScreen,
    onScreenChange: (newScreen: CurrentScreen) => void
};

export class TitleBar extends Component<ITitleBarProps> {
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
                {(screen == "record" || screen =="start") && <button style={{ marginLeft: "auto" }} onClick={() => { this.props.onScreenChange("listen") }}>Listen</button>}
                {screen == "listen" && <button style={{ marginLeft: "auto" }} onClick={() => { this.props.onScreenChange("record") }}>Record</button>}
            </div>
        );
    }
}