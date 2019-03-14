import { polyfillGUM } from "./getusermedia";
import React, { Component } from 'react';
import { ClipInfo, IClipInfo } from "./clipInfo";

export interface IRecorderProps {

}

export interface IRecorderState {
    lastClip?: IClipInfo;
    clips: IClipInfo[];
    status: "initializing" | "ready" | "armed" | "recording" | "done" | "paused"; // it looks like mediarecorder is reusable after stopping.
    recording?: "waiting for audio" | "detected sound recently" | "recording a track";
}


export class Recorder extends Component<IRecorderProps, IRecorderState> {
    private mediaRecorder?: MediaRecorder;

    private lastClip?: IClipInfo;
    private name?: string;
    private download = false;
    private saveMode: "saveNext" | "autodecide"| "skipNext" = "autodecide";
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


                        var min = 100000000000000;
                        var max = -100000000000000;
                        dataArray.forEach(v => { min = Math.min(v, min); max = Math.max(v, max); });

                        this.waveform = this.waveform.concat([min, max]);

                        const maxSilence = 100;

                        if (this.state.status != "recording") {
                            if (this.waveform.length > maxSilence) {
                                this.waveform = this.waveform.slice(this.waveform.length - maxSilence);
                            }
                        }

                        if (max > 140 || min < 100) {
                            this.lastNoiseCounter = 0;
                            // if we aren't recording we should start!
                            if (this.state.status == "armed") {
                                this.record();
                            }
                        }
                        else {
                            this.lastNoiseCounter++;
                            if (this.lastNoiseCounter > maxSilence) {
                                // if we are recording we should stop by stay armed.
                                if (this.state.status == "recording") {
                                    this.split();
                                }
                            }
                        }


                        canvasCtx.fillStyle = 'rgb(25, 25, 25)';
                        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                        canvasCtx.lineWidth = 2;
                        canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
                        //canvasCtx.strokeStyle = 'rgb(0, 0, 0)';


                        var sliceWidth = WIDTH * 1.0 / this.waveform.length;
                        var x = 0;

                        var lastX = 0;
                        var lastY = HEIGHT / 2;
                        canvasCtx.beginPath();
                        canvasCtx.moveTo(lastX, lastY);

                        for (var i = 0; i < this.waveform.length; i++) {
                            var v = this.waveform[i] / 128.0;
                            var y = v * HEIGHT / 2;

                            if (this.waveform[i] > 140 || this.waveform[i] < 100) {
                                //canvasCtx.strokeStyle = 'rgb(255, 0, 0)';

                            }
                            else {
                                //canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
                            }

                            //canvasCtx.beginPath();
                            //canvasCtx.moveTo(lastX, lastY);
                            canvasCtx.lineTo(x, y);
                            //canvasCtx.stroke();

                            lastX = x;
                            lastY = y;

                            x += sliceWidth;
                        }

                        canvasCtx.lineTo(canvas.width, canvas.height / 2);
                        canvasCtx.stroke();

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

                        // TODO: we should have a way to MANUALLY SAVE and MANUALLY SKIP
                        // eg stop/save or trash can button

                        // this is where we should decide if we keep it or not...
                        // if it is really short DONT keep it.

                        this.lastClip = clipInfo;
                        this.setState({lastClip: clipInfo});
                        if(this.saveMode == "autodecide"){
                            console.log("waveform length: " + clipInfo.waveform.length)
                            const minSaveLength = 1000;
                            if(clipInfo.waveform.length < minSaveLength){
                                console.log("skip saving the track since it is so short");
                                return;
                            }
    
                            // also skip if it has very little CONTENT as a percentage. especially for very short lcips.
                        }
                        if(this.saveMode == "skipNext"){
                            // only skip one
                            this.saveMode = "autodecide";
                            console.log("skip saving because we are in skipNext save mode");
                            return;
                        }
                        if(this.saveMode == "saveNext"){
                            // only save one
                            this.saveMode = "autodecide";
                            console.log("force saving because we are in saveNext save mode");
                        }

                        this.saveClip(clipInfo);
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

    private saveClip = (clipInfo: IClipInfo) => {
        this.trackCount++;
        this.setState({ clips: [...this.state.clips, clipInfo], lastClip: undefined });
        this.lastClip = undefined;
        this.waveform = [];

        var link = document.createElement("a"); // Or maybe get it from the current document
        link.href = clipInfo.audioUrl;
        link.download = (this.name ? this.name + "_" : "") + name + ".webm";
        document.body.appendChild(link);
        this.download && link.click();
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

        this.mediaRecorder.stop();
        this.setState({ status: "armed" }); // not sure this is right!
    }

    public stop = () => {
        if (!this.mediaRecorder) {
            throw "No recorder!";
        }

        if(this.mediaRecorder.state == "recording" || this.mediaRecorder.state == "paused"){
            this.mediaRecorder.stop();
        }

        this.setState({ status: "ready" });
    }

    render() {
        const { status, clips, lastClip } = this.state;
        return <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "flex-end" }}>
            <div style={{justifyContent: "center", alignItems: "center", margin: "10px", display:"flex", fontSize: "125%"}}> { (status == "recording" || status == "armed") && "Recording" } {this.name}</div>
            <div style={{ overflow: "auto", flex: "auto", margin: "25px 10px" }}>
                {clips.map((clip, i) => {
                    return <ClipInfo key={i} clipInfo={clip} onDelete={()=>{
                        var removed = clips.splice(i, 1);
                        this.setState({clips: clips.slice() })}} />
                })}
            </div>
            <div style={{ flex: "none", textAlign: "center", justifyContent: "center" }}>
                <canvas className="visualizer" height="100" width="1000" style={{ width: "100%" }} />
            </div>
            <div style={{ flex: "none", textAlign: "center", justifyContent: "center" }}>
                {status}
            </div>
            <div style={{ flex: "none", display: "flex", flexDirection: "row", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
                {status == "ready" &&
                    <button onClick={() => { this.setState({ status: "armed" })}} title="Arm for recording" style={{height: "50px", width: "50px", borderRadius: "100px", backgroundColor: "rgb(225,0,0)", border: "none", margin: "10px", cursor: "pointer"}}/>}
                {(status == "recording" ) && <button onClick={()=>{ this.saveMode = "saveNext"; this.split()}}>Save</button>}
                {(status == "recording" || status == "armed") && <button onClick={this.stop} title="Stop" style={{height: "50px", width: "50px", border: "none", backgroundColor:"grey", cursor: "pointer", margin: "10px"}}/>}
                {(status == "recording") && <button onClick={()=>{ this.saveMode = "skipNext"; this.split()}}>Skip</button>}
            </div>
            <div style={{ marginBottom: "50px", flex: "none", display: "flex", flexDirection: "row", textAlign: "center", justifyContent: "center" }}>
                {(status == "recording" || status == "armed") ? <div>{this.name}</div> : <input type="textarea" defaultValue={this.name} onChange={e => { this.name = e.target.value; }} placeholder={"Name your session"} />}
                <input type="checkbox" onChange={e => { this.download = e.target.checked; }} /> Save
                {(status!="recording" && lastClip) && <button onClick={()=>{ this.saveClip(lastClip); }}>Save Last</button>}
            </div>
        </div>;
    }
}