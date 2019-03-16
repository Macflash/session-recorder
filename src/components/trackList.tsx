import React, { Component } from 'react';
import { IClipInfo, ClipInfo } from './clipInfo';

export class TrackList extends Component<{ clips: IClipInfo[], onClipPlayed?: () => void, onDelete: (index: number) => void }> {
    private audioElements: HTMLAudioElement[] = [];
    public stopAllClips(exceptClip?: number) {
        this.audioElements.forEach((a, i) => {
            if (exceptClip != i) {
                a.pause();
            }
        });
    }

    render() {
        const { clips, onClipPlayed, onDelete } = this.props;
        return (
            <div style={{ overflow: "auto", flex: "auto", margin: "25px 10px" }}>
                {clips.map((clip, i) => {
                    return <ClipInfo
                        showAudio
                        audioRef={a => { if (a) { this.audioElements[i] = a; } }}
                        key={i}
                        clipInfo={clip}
                        onDelete={() => { onDelete(i); }}
                        onAudioPlayed={() => {
                            // stop other audio clips
                            this.stopAllClips(i);

                            // stop recording (handled in parent)
                            onClipPlayed && onClipPlayed();
                        }}
                    />
                })}
            </div>
        );
    }
}