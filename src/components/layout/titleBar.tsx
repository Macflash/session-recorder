import React, { Component } from 'react';
import { CurrentScreen } from '../screens/baseScreen';
import { RecordButton } from '../buttons/recordButton';

export type Icon = "recording" | "armed";

export interface ITitleBarProps {
    icon?: Icon,
    title?: string,
    screen: CurrentScreen,
    onScreenChange: (newScreen: CurrentScreen) => void
};

export class TitleBar extends Component<ITitleBarProps> {
    public static renderIcon(icon?: Icon): React.ReactNode {
        const size = "20px";
        switch (icon) {
            case "recording":
                return <RecordButton size={size} />
            default:
                return <RecordButton size={size} disabled={true} />
        }
    }

    render() {
        const { title, screen, icon } = this.props;
        return (
            <div
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "5%",
                    marginBottom: "auto",
                    display: "flex",
                    fontSize: "125%",
                }}>
                {TitleBar.renderIcon(icon)}
                <span style={{ margin: "0 10px" }}>{title}</span>
                {(screen == "record" || screen == "start") && <button style={{ marginLeft: "auto" }} onClick={() => { this.props.onScreenChange("listen") }}>Listen</button>}
                {screen == "listen" && <button style={{ marginLeft: "auto" }} onClick={() => { this.props.onScreenChange("record") }}>Record</button>}
            </div>
        );
    }
}