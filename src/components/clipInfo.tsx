import React, { Component } from 'react';
import { Visualizer } from './visualizer';
import { CloseButton } from './buttons/closeButton';
import { ArrowButton } from './buttons/arrowButton';
import { StopButton } from './buttons/stopButton';

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
    public Visual: Visualizer | null = null;
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

    getTotalTime(): number {
        return this.Audio!.duration;
    }

    getCurrentTime(): number {
        return this.Audio!.currentTime;
    }

    setCurrentTime(time: number) {
        this.Audio!.currentTime = time;
    }

    onTimeUpdate = (event: Event) => {
        console.log("time updated");
        if(!this.Audio || !this.Visual){
            return;
        }

        this.Visual.redrawCanvas(this.getCurrentTime() / this.getTotalTime());
    }

    render() {
        const { clipInfo, showAudio, onDelete, onRename, onAudioPlayed, audioRef } = this.props;
        return (
            <div style={{ display: "flex", flexDirection: "row", height: "100px", margin: "5px" }}>
                <div style={{ flex: "none", display: "flex", alignItems: "center", margin: "5px" }}>
                    {clipInfo.trackNumber}
                </div>
                <div style={{ maxWidth: "33%", margin: "5px", justifyContent: "space-around", flex: "none", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: "none", textOverflow: "ellipsis", overflow: "hidden" }}>
                        {clipInfo.trackName}
                    </div>
                    <button onClick={onRename}>Rename</button>
                    <button onClick={this.download}>Download</button>
                </div>
                <div style={{ flex: "auto", display: "flex", flexDirection: "column", maxWidth: "80%", minWidth: "50%" }}>
                    <Visualizer
                        onSeek={percent => {
                            const frame = percent * this.getTotalTime();
                            this.setCurrentTime(frame);
                        }}
                        ref={visual => { this.Visual = this.Visual || visual; }}
                        waveform={clipInfo.waveform}
                        style={{ height: "50px" }}
                    />
                    <audio
                        ref={audio => {
                            if (audio) {
                                audio.onplay = ()=>{ this.setState({status: "playing"})};
                                audio.ontimeupdate = this.onTimeUpdate;
                            }
                            if (audio && audioRef) { audioRef(audio); }
                            this.Audio = this.Audio || audio;
                        }}
                        onPlay={onAudioPlayed}
                        controls={showAudio}
                        style={{
                            width: "100%",
                            height: "40px",
                            marginTop: "10px"
                        }}
                        src={clipInfo.audioUrl}
                    />
                </div>
                <div>
                <CloseButton title="Delete" onClick={onDelete} />
                
                {/*
                    Just use the controls they work great
                    <ArrowButton direction="right" onClick={()=>{this.Audio!.play();}} />
                    <StopButton onClick={()=>{this.Audio!.pause();}} />
                */}

                </div>
            </div>
        );
    }
}