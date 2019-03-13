import React, { Component } from 'react';

export interface IVisualizerProps {
    waveform: number[];
}

export interface IVisualizerState {
    clipCanvas?: HTMLCanvasElement;
}

export class Visualizer extends Component<IVisualizerProps, IVisualizerState> {
    clipCanvas: HTMLCanvasElement | null = null;

    componentDidUpdate() {
        if (!this.clipCanvas) { return; }
        var canvasCtx = this.clipCanvas.getContext("2d") as CanvasRenderingContext2D;

        var WIDTH = this.clipCanvas.width
        var HEIGHT = this.clipCanvas.height;

        canvasCtx.fillStyle = 'rgb(255, 255, 255)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';


        var sliceWidth = WIDTH * 1.0 / this.props.waveform.length;
        var x = 0;

        var lastX = 0;
        var lastY = HEIGHT / 2;

        for (var i = 0; i < this.props.waveform.length; i++) {
            var v = this.props.waveform[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (this.props.waveform[i] > 140 || this.props.waveform[i] < 100) {
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
    }

    render() {
        return <canvas height="50" ref={c => { if(!this.clipCanvas && c){
            this.clipCanvas = c;
            this.setState({clipCanvas: c});
        } }} style={{ flex: "auto" }} />;
    }
}