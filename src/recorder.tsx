import { polyfillGUM } from "./getusermedia";
import React, { Component } from 'react';
import { ClipInfo, IClipInfo } from "./clipInfo";

export interface IRecorderProps {

}

export interface IRecorderState {
    clips: IClipInfo[];
    status: "initializing" | "ready" | "armed" | "recording" | "done" | "paused"; // it looks like mediarecorder is reusable after stopping.
    recording?: "waiting for audio" | "detected sound recently" | "recording a track";
}


export class Recorder extends Component<IRecorderProps, IRecorderState> {
    private mediaRecorder?: MediaRecorder;

    private lastNoiseCounter = 0;

    // currently recording chunks
    private chunks: Blob[] = [];

    // currently recording chunks
    private waveform: number[] = [];

    private trackCount = 1;

    constructor(props: IRecorderProps) {
        super(props);
        polyfillGUM();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    var audioContext = new AudioContext();

                    var audioSource = audioContext.createMediaStreamSource(stream);
                    var analyser = audioContext.createAnalyser();
                    audioSource.connect(analyser);
                    var bufferLength = analyser.fftSize;
                    console.log(bufferLength);
                    var dataArray = new Uint8Array(bufferLength);

                    var canvas = document.querySelector('.visualizer') as HTMLCanvasElement;
                    var canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

                    // TODO: move this to a method
                    var draw = () => {
                        var WIDTH = canvas.width
                        var HEIGHT = canvas.height;

                        requestAnimationFrame(draw);

                        analyser.getByteTimeDomainData(dataArray);

                        this.waveform = this.waveform.concat(Array.from(dataArray));

                        const maxSilence = 75000;
                        if(this.state.status != "recording"){
                            if(this.waveform.length > maxSilence){
                                this.waveform = this.waveform.slice(this.waveform.length - maxSilence);
                            }
                        }

                        var min = 100000000000000;
                        var max = -100000000000000;
                        dataArray.forEach(v => { min = Math.min(v, min); max = Math.max(v, max); });

                        if (max > 140 || min < 100) {
                            this.lastNoiseCounter = 0;
                                // if we aren't recording we should start!
                                if(this.state.status != "recording"){
                                    this.record();
                                }
                        }
                        else {
                            this.lastNoiseCounter++;
                            if(this.lastNoiseCounter > 15){
                                // if we are recording we should stop!
                                if(this.state.status == "recording"){
                                    this.stop();
                                }
                            }
                        }

                        //fullBuffer = fullBuffer.concat(Array.from(dataArray));
                        this.waveform.concat([min, max]);

                        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                        canvasCtx.lineWidth = 2;
                        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';


                        var sliceWidth = WIDTH * 1.0 / this.waveform.length;
                        var x = 0;

                        var lastX = 0;
                        var lastY = HEIGHT / 2;

                        for (var i = 0; i < this.waveform.length; i++) {
                            var v = this.waveform[i] / 128.0;
                            var y = v * HEIGHT / 2;

                            if (this.waveform[i] > 140 || this.waveform[i] < 100) {
                                canvasCtx.strokeStyle = 'rgb(255, 0, 0)';

                            }
                            else {
                                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
                            }

                            canvasCtx.beginPath();
                            canvasCtx.moveTo(lastX, lastY);
                            canvasCtx.lineTo(x, y);
                            canvasCtx.stroke();

                            lastX = x;
                            lastY = y;

                            x += sliceWidth;
                        }

                        canvasCtx.lineTo(canvas.width, canvas.height / 2);
                        //canvasCtx.stroke();

                    }

                    draw();

                    this.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm", audioBitsPerSecond: 320000 });
                    this.mediaRecorder.onstart = e => {
                        // reset our waveform and chunks
                        this.chunks = [];
                        this.waveform = [];
                    }
                    this.mediaRecorder.ondataavailable = (e) => {
                        this.chunks.push(e.data);
                    }
                    this.mediaRecorder.onstop = (e) => {
                        const name = "test";
                        const blob = new Blob(this.chunks, { 'type': 'audio/webm' });
                        this.chunks = [];
                        const audioUrl = window.URL.createObjectURL(blob);
                        const clipInfo: IClipInfo = {
                            audioUrl,
                            name: "Track " + this.trackCount,
                            waveform: this.waveform,
                            trackNumber: this.trackCount,
                        };
                        this.trackCount++;
                        this.setState({ clips: [...this.state.clips, clipInfo] });
                        this.waveform = [];

                        var link = document.createElement("a"); // Or maybe get it from the current document
                        link.href = audioUrl;
                        link.download = name + ".webm";
                        document.body.appendChild(link);
                        //link.click();
                    }
                    this.setState({ status: "ready" });
                }).catch(function (err) {
                    console.error('The following getUserMedia error occured: ' + err);
                }
                );
        }
        else {
            console.error('getUserMedia not supported on your browser!');
        }

        this.state = { status: "initializing", clips: [] };
    }

    public record = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        this.mediaRecorder.start();
        this.setState({ status: "recording" });
    }

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

    public split = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

    }

    public stop = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        this.mediaRecorder.stop();
        this.setState({ status: "ready" }); // not sure this is right!
    }

    render() {
        const { status, clips } = this.state;
        return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ overflow: "auto", flex: "auto", minHeight: "50%" }}>
                {clips.map((clip, i) => {
                    return <ClipInfo key={i} clipInfo={clip} />
                })}
            </div>
            <div style={{ flex: "none" }}>
                <canvas className="visualizer" width="300" height="100" />
                {status}
                <div>
                    {status == "ready" &&
                        <button onClick={this.record}>Record</button>}
                    {status == "recording" &&
                        <button onClick={this.pause}>Pause</button>}
                    {status == "recording" &&
                        <button onClick={this.stop}>Stop</button>}
                    {status == "paused" &&
                        <button onClick={this.resume}>Resume</button>}
                </div>
            </div>
        </div>;
    }
}