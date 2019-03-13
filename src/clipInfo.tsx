import React, { Component } from 'react';
import { Visualizer } from './visualizer';

export interface IClipInfo {
    audioUrl: string;
    name: string;

    //todo: add other information like length, date and wave preview
    waveform: number[];
    trackNumber: number;
}

export interface IClipInfoProps {
    clipInfo: IClipInfo;
}

export class ClipInfo extends Component<IClipInfoProps> {
    clipCanvas: HTMLCanvasElement | null = null;

    render() {
        const { clipInfo } = this.props;
        return (
            <div style={{ display: "flex", flexDirection: "row", height: "100px" }}>
                <div style={{ flex: "none" }}>{clipInfo.trackNumber}</div>
                <div style={{ flex: "auto", display: "flex", flexDirection: "column" }}>
                    <Visualizer waveform={clipInfo.waveform} />
                    <audio controls src={clipInfo.audioUrl} />
                </div>
                <div style={{ flex: "none", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: "none" }}>
                        {clipInfo.name}
                    </div>
                    <div style={{ flex: "none" }}>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}