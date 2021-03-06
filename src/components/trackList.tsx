import React, { Component } from 'react';
import { IClipInfo, ClipInfo } from './clipInfo';

export interface ITrackListProps {
    clips: IClipInfo[];
    onClipPlayed?: () => void;
    onDelete: (index: number) => void;
    onRename: (index: number) => void;
}

export class TrackList extends Component<ITrackListProps> {
    private audioElements: HTMLAudioElement[] = [];
    public stopAllClips(exceptClip?: number) {
        this.audioElements.forEach((a, i) => {
            if (exceptClip != i) {
                a.pause();
            }
        });
    }

    render() {
        const { clips, onClipPlayed, onDelete, onRename } = this.props;
        return (
            <div style={{ overflow: "auto", flex: "auto", padding: "5px" }}>
                {clips.map((clip, i) => {
                    return <ClipInfo
                        showAudio
                        audioRef={a => { if (a) { this.audioElements[i] = a; } }}
                        key={i}
                        clipInfo={clip}
                        onRename={() => { onRename(i); }}
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