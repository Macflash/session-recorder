import { polyfillGUM } from "../getusermedia";
import React, { Component } from 'react';
import { ClipInfo, IClipInfo } from "./clipInfo";
import { TitleBar } from "./layout/titleBar";
import { ScreenWrapper } from "./layout/screenWrapper";
import { ArrowButton } from "./buttons/arrowButton";
import { RecordButton } from "./buttons/recordButton";
import { StopButton } from "./buttons/stopButton";
import { ButtonBar } from "./layout/buttonBar";
import { PaddedBar } from "./layout/paddedBar";
import { IScreenProps, BaseScreen } from "./screens/baseScreen";
import { TrackList } from "./trackList";

export interface IRecorderProps extends IScreenProps {
}

export interface IRecorderState {
    stream?: MediaStream;
    lastClip?: IClipInfo;
    clips: IClipInfo[];
    status: "initializing" | "ready" | "armed" | "recording" | "done" | "paused" | "error"; // it looks like mediarecorder is reusable after stopping.
    recording?: "waiting for audio" | "detected sound recently" | "recording a track";
}

export class Recorder extends Component<IRecorderProps, IRecorderState> {
    private mediaRecorder?: MediaRecorder;
    private analyser?: AnalyserNode;
    private dataBuffer?: Uint8Array;

    private readonly maxSilence = 100;
    private readonly minSaveLength = 1000;
    private lastClip?: IClipInfo;
    private saveMode: "saveNext" | "autodecide" | "skipNext" = "autodecide";
    private lastNoiseCounter = 0;

    // currently recording chunks
    private chunks: Blob[] = [];

    // currently recording chunks
    private waveform: number[] = [];

    private trackCount = 1;

    stream?: MediaStream;

    constructor(props: IRecorderProps) {
        super(props);
        polyfillGUM();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.initializeAudioStream(stream);

                    const canvas = document.querySelector('.visualizer') as HTMLCanvasElement;
                    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
                    canvasCtx.fillStyle = 'rgb(25, 25, 25)';
                    canvasCtx.lineWidth = 2;

                    // TODO: move this to a method
                    const draw = () => {
                        setTimeout(draw, 1000 / 60);
                        //requestAnimationFrame(draw);

                        // how do we update this data while not recording?
                        // but also not do duplicates here?
                        this.readAnalyserData();

                        const WIDTH = canvas.width
                        const HEIGHT = canvas.height;
                        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                        if (this.state.status == "recording") {
                            canvasCtx.strokeStyle = 'rgb(225, 0, 0)';
                        }
                        else {
                            canvasCtx.strokeStyle = 'rgb(75, 75, 75)';
                        }

                        const sliceWidth = WIDTH * 1.0 / this.waveform.length;
                        let x = 0;

                        canvasCtx.beginPath();
                        canvasCtx.moveTo(0, HEIGHT / 2);
                        for (let i = 0; i < this.waveform.length; i++) {
                            const v = this.waveform[i] / 128.0;
                            const y = v * HEIGHT / 2;
                            canvasCtx.lineTo(x, y);
                            x += sliceWidth;
                        }

                        canvasCtx.lineTo(canvas.width, canvas.height / 2);
                        canvasCtx.stroke();
                    }

                    draw();

                    // actually lets go straight to armed. default is to go to "ready"
                    this.setState({ status: "armed" });

                }).catch(err => {
                    alert('The following getUserMedia error occured: ' + err);
                    this.setState({ status: "error" });
                });
        }
        else {
            alert('getUserMedia not supported on your browser!');
            this.setState({ status: "error" });
        }

        this.state = { status: "initializing", clips: [] };
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        if (this.stream) { this.stream.getTracks().forEach(track => track.stop()) }
    }

    private initializeAudioStream(stream: MediaStream) {
        this.stream = stream;
        this.setState({ stream });

        // Set up AnalyserNode for waveform rendering
        var audioContext = new AudioContext();
        var audioSource = audioContext.createMediaStreamSource(stream);
        this.analyser = audioContext.createAnalyser();
        audioSource.connect(this.analyser);
        var bufferLength = this.analyser.fftSize;
        this.dataBuffer = new Uint8Array(bufferLength);

        // Set up MediaRecorder for recording (obviously)
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm", audioBitsPerSecond: 320000 });
        this.mediaRecorder.onstart = e => {
            // reset our waveform and chunks
            this.chunks = [];
            this.waveform = [];
        }
        this.mediaRecorder.ondataavailable = (e) => {
            this.chunks.push(e.data);

            // here is where we should save the waveform as well
            this.readAnalyserData();
        }
        this.mediaRecorder.onstop = (e) => {
            // probably should reset the waveform..?
            const blob = new Blob(this.chunks, { 'type': 'audio/webm' });
            const audioUrl = window.URL.createObjectURL(blob);
            const clipInfo: IClipInfo = {
                audioUrl,
                waveform: this.waveform,
                sessionName: this.props.title,
            } as IClipInfo;

            this.chunks = [];
            this.waveform = [];

            // this is where we should decide if we keep it or not...
            // if it is really short DONT keep it.
            this.lastClip = clipInfo;
            this.setState({ lastClip: clipInfo });
            if (this.saveMode == "autodecide") {
                if (clipInfo.waveform.length < this.minSaveLength) {
                    console.log("skip saving the track since it is so short");
                    return;
                }

                // TODO: also check to see how "full" the clip is. 
                // If it is like 2 snare hits a long way apart don't keep it.
            }
            if (this.saveMode == "skipNext") {
                // only skip one
                this.saveMode = "autodecide";
                console.log("skip saving because we are in skipNext save mode");
                return;
            }
            if (this.saveMode == "saveNext") {
                // only save one
                this.saveMode = "autodecide";
                console.log("force saving because we are in saveNext save mode");
            }

            this.saveClip(clipInfo);
        }
    }

    private readAnalyserData() {
        if (!this.analyser || !this.dataBuffer) { throw "missing analyser node or data buffer!"; }
        this.analyser.getByteTimeDomainData(this.dataBuffer);
        var min = 100000000000000;
        var max = -100000000000000;
        this.dataBuffer.forEach(value => { min = Math.min(value, min); max = Math.max(value, max); });
        this.waveform = this.waveform.concat([min, max]);

        // This is really just so the waveform "scrolls" when in the armed state.
        if (this.state.status != "recording") {
            // there are some... race conditions here depending on when the recording gets stopped.
            // should either fix this or ensure we don't trim VALID recordings
            // it should never be able to get out of this region, but bad things would happen if it did?
            if (this.waveform.length > this.maxSilence
                && this.waveform.length < this.maxSilence + 10) {
                // wowza this is horrible. just making the race condition smaller...
                this.waveform = this.waveform.slice(this.waveform.length - this.maxSilence);
            }
        }

        // Decide whether to start or stop recording
        this.autoStartStop(min, max);
    }

    private autoStartStop(min: number, max: number) {
        if (max > 140 || min < 100) {
            this.lastNoiseCounter = 0;
            // if we aren't recording we should start
            if (this.state.status == "armed") {
                this.record();
            }
        }
        else {
            this.lastNoiseCounter++;
            if (this.lastNoiseCounter > this.maxSilence) {
                // if we are recording we should stop but stay armed
                if (this.state.status == "recording") {
                    this.split();
                }
            }
        }
    }

    private saveClip = (clipInfo: IClipInfo) => {
        clipInfo.trackName = "Track " + this.trackCount;
        clipInfo.trackNumber = this.trackCount;
        this.trackCount++;
        this.setState({ clips: [...this.state.clips, clipInfo], lastClip: undefined });
        this.lastClip = undefined;
        this.waveform = [];
    }

    public record = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        this.mediaRecorder.start();
        this.setState({ status: "recording" });
    }

    /*
    public pause = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        this.mediaRecorder.pause();
        this.setState({ status: "paused" });
    }

    public resume = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        this.mediaRecorder.resume();
        this.setState({ status: "recording" });
    }
    */

    public split = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        this.mediaRecorder.stop();
        this.setState({ status: "armed" }); // not sure this is right!
    }

    public stop = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        if (this.mediaRecorder.state == "recording" || this.mediaRecorder.state == "paused") {
            this.mediaRecorder.stop();
        }

        this.setState({ status: "ready" });
    }

    private renderMainButton(): React.ReactNode {
        const { status } = this.state;
        switch (status) {
            case "ready":
                return <RecordButton
                    onClick={() => { this.setState({ status: "armed" }); }}
                    title="Arm for recording"
                />;
            case "armed":
            case "recording":
                return <StopButton
                    onClick={this.stop}
                    title="Stop"
                />;
            default:
                return <div style={{ height: "75px", color: "rgb(50,50,50)", display: "flex", alignItems: "center", textAlign: "center" }}>{status}</div>;
        }
    }

    stopAudio = () => {
        this.props.onScreenChange("start");
    }

    render() {
        const { status, clips, lastClip, stream } = this.state;
        const onStopAudio = stream ? this.stopAudio : undefined;
        return (
            <BaseScreen
                screen="record"
                icon={status as any}
                title={"Recording " + (this.props.title || "")}
                onScreenChange={this.props.onScreenChange}
                onStopAudio={onStopAudio}
            >
                <TrackList
                    clips={clips}
                    onClipPlayed={this.stop}
                    onDelete={i => {
                        var removed = clips.splice(i, 1);
                        this.setState({ clips: clips.slice() })
                    }}
                    onRename={i => {
                        var clip = JSON.parse(JSON.stringify(clips[i])) as IClipInfo;
                        clip.trackName = prompt("Rename '" + clip.trackName + "'") || clip.trackName;
                        clips[i] = clip;
                        this.setState({ clips: clips.slice() })
                    }}
                />
                <PaddedBar>
                    <canvas className="visualizer" height="100" width="1000" style={{ width: "100%", height: "100px" }} />
                </PaddedBar>
                <ButtonBar>

                    <ArrowButton
                        size="50px"
                        direction="left"
                        title="Save"
                        disabled={status != "recording" && !lastClip}
                        onClick={() => {
                            if (status == "recording") { this.saveMode = "saveNext"; this.split() }
                            else if (lastClip) { this.saveClip(lastClip); }
                        }}
                    />

                    {this.renderMainButton()}

                    <ArrowButton
                        size="50px"
                        direction="right"
                        title="Skip"
                        disabled={status != "recording" && !lastClip}
                        onClick={() => {
                            if (status == "recording") { this.saveMode = "skipNext"; this.split() }
                            else if (lastClip) { this.setState({ lastClip: undefined }); }
                        }}
                    />

                </ButtonBar>
            </BaseScreen>
        );
    }
}