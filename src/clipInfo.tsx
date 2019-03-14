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
    onDelete: ()=>void;
}

export class ClipInfo extends Component<IClipInfoProps> {
    clipCanvas: HTMLCanvasElement | null = null;

    render() {
        const { clipInfo } = this.props;
        return (
            <div style={{ display: "flex", flexDirection: "row", height: "100px", margin: "5px" }}>
                <div style={{ flex: "none", display: "flex", alignItems: "center", margin: "5px" }}>{clipInfo.trackNumber}</div>
                <div style={{ flex: "auto", display: "flex", flexDirection: "column", maxWidth:"80%", minWidth: "50%" }}>
                    <Visualizer waveform={clipInfo.waveform} />
                    <audio controls style={{width: "100%", height: "40px", marginTop:"10px"}} src={clipInfo.audioUrl} />
                </div>
                <div style={{ margin:"5px", justifyContent:"space-around", flex: "none", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: "none" }}>
                        {clipInfo.name}
                    </div>
                    <div style={{ flex: "none" }}>
                        <button onClick={this.props.onDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}