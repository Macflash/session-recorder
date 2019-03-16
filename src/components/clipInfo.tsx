import React, { Component } from 'react';
import { Visualizer } from './visualizer';
import { CloseButton } from './buttons/closeButton';

export interface IClipInfo {
    sessionName: string;
    audioUrl: string;
    trackName: string;

    //todo: add other information like length, date and wave preview
    waveform: number[];
    trackNumber: number;
}

export interface IClipInfoProps {
    clipInfo: IClipInfo;
    onRename: () => void;
    onDelete: () => void;
    showAudio?: boolean;
    onAudioPlayed?: () => void;
    audioRef?: (audio: HTMLAudioElement) => void;
}

export class ClipInfo extends Component<IClipInfoProps> {
    public Audio: HTMLAudioElement | null = null;
    private clipCanvas: HTMLCanvasElement | null = null;

    private download = () => {
        const { clipInfo } = this.props;
        var link = document.createElement("a"); // Or maybe get it from the current document
        link.href = clipInfo.audioUrl;
        link.download = (clipInfo.sessionName ? clipInfo.sessionName + "_" : "") + clipInfo.trackName + ".webm";
        document.body.appendChild(link);
        this.download && link.click();
        document.body.removeChild(link);
    }

    render() {
        const { clipInfo, showAudio, onDelete, onRename, onAudioPlayed, audioRef } = this.props;
        return (
            <div style={{ display: "flex", flexDirection: "row", height: "100px", margin: "5px" }}>
                <div style={{ flex: "none", display: "flex", alignItems: "center", margin: "5px" }}>
                    {clipInfo.trackNumber}
                </div>
                <div style={{ maxWidth:"33%", margin: "5px", justifyContent: "space-around", flex: "none", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: "none", textOverflow: "ellipsis", overflow: "hidden"  }}>
                        {clipInfo.trackName}
                    </div>
                    <button onClick={onRename}>Rename</button>
                    <button onClick={this.download}>Download</button>
                </div>
                <div style={{ flex: "auto", display: "flex", flexDirection: "column", maxWidth: "80%", minWidth: "50%" }}>
                    <Visualizer waveform={clipInfo.waveform} style={{ height: "50px" }} />
                    {showAudio &&
                        <audio
                            ref={audio => {
                                if (audio && audioRef) { audioRef(audio); }
                                this.Audio = this.Audio || audio;
                            }}
                            onPlay={onAudioPlayed}
                            controls
                            style={{
                                width: "100%",
                                height: "40px",
                                marginTop: "10px"
                            }}
                            src={clipInfo.audioUrl}
                        />
                    }
                </div>
                <CloseButton title="Delete" onClick={onDelete} />
            </div>
        );
    }
}