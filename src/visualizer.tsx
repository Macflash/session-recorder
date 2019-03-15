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

        canvasCtx.fillStyle = 'rgb(25, 25, 25)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(125, 125, 125)';


        var sliceWidth = WIDTH * 1.0 / this.props.waveform.length;
        var x = 0;

        var lastX = 0;
        var lastY = HEIGHT / 2;
        canvasCtx.beginPath();
        canvasCtx.moveTo(lastX, lastY);

        for (var i = 0; i < this.props.waveform.length; i++) {
            var v = this.props.waveform[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (this.props.waveform[i] > 140 || this.props.waveform[i] < 100) {
                //canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
            }
            else {
                //canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
            }

            canvasCtx.lineTo(x, y);

            lastX = x;
            lastY = y;

            x += sliceWidth;
        }

        canvasCtx.stroke();
    }

    render() {
        return <canvas height="100" width="1000" ref={c => { if(!this.clipCanvas && c){
            this.clipCanvas = c;
            this.setState({clipCanvas: c});
        } }} style={{ flex: "auto" }} />;
    }
}