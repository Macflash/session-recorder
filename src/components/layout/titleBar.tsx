import React, { Component } from 'react';
import { CurrentScreen } from '../screens/baseScreen';
import { RecordButton } from '../buttons/recordButton';
import { CloseButton } from '../buttons/closeButton';

export type Icon = "recording" | "armed";

export interface ITitleBarProps {
    icon?: Icon,
    title?: string,
    screen: CurrentScreen,
    onScreenChange: (newScreen: CurrentScreen) => void,
    onStopAudio?: () => void;
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
        const { title, screen, icon, onStopAudio } = this.props;
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
                {screen == "start"
                    ? <a style={{ margin: "0 10px", marginRight: "auto" }} href="https://github.com/macflash/session-recorder">{title}</a>
                    : <span style={{ margin: "0 10px", marginRight: "auto" }}>{title}</span>
                }
                {screen == "listen" &&
                    <button
                        style={{ marginLeft: "auto" }}
                        onClick={() => { this.props.onScreenChange("record") }}
                    >
                        Record
                </button>}
                {onStopAudio && <CloseButton size="25px" title="Stop audio" onClick={onStopAudio} />}
            </div>
        );
    }
}