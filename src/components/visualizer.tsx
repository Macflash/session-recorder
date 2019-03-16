import React, { Component } from 'react';

export interface IVisualizerProps {
    waveform: number[];
    style?: React.CSSProperties;
    onSeek?: (percent: number) => void;
}

export interface IVisualizerState {
    clipCanvas?: HTMLCanvasElement;
}

export class Visualizer extends Component<IVisualizerProps, IVisualizerState> {
    clipCanvas: HTMLCanvasElement | null = null;
    private lastProgress: number = 0;

    public redrawCanvas(playProgress: number) {
        this.lastProgress = playProgress;
        if (!this.clipCanvas) { return; }
        const canvasCtx = this.clipCanvas.getContext("2d") as CanvasRenderingContext2D;

        const WIDTH = this.clipCanvas.width
        const HEIGHT = this.clipCanvas.height;

        canvasCtx.fillStyle = 'rgb(25, 25, 25)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(225, 225, 225)';

        const sliceWidth = WIDTH * 1.0 / this.props.waveform.length;
        let x = 0;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, HEIGHT / 2);

        const playLength = playProgress * this.props.waveform.length;
        let playing = true;
        for (var i = 0; i < this.props.waveform.length; i++) {
            const v = this.props.waveform[i] / 128.0;
            const y = v * HEIGHT / 2;
            canvasCtx.lineTo(x, y);

            if (i >= playLength && playing) {
                canvasCtx.stroke();
                canvasCtx.beginPath();
                canvasCtx.moveTo(x, y);
                canvasCtx.strokeStyle = 'rgb(125, 125, 125)';
                playing = false;
            }

            x += sliceWidth;
        }

        canvasCtx.stroke();
    }

    componentDidUpdate() {
        this.redrawCanvas(this.lastProgress);
    }

    render() {
        return (
            <canvas
                height="100"
                width="1000"
                style={{
                    flex: "auto",
                    ...this.props.style
                }}
                ref={c => {
                    if (!this.clipCanvas && c) {
                        this.clipCanvas = c;
                        this.clipCanvas.onclick = e => {
                            if (this.props.onSeek) {
                                let percent = e.offsetX / c.clientWidth;
                                this.props.onSeek(percent);
                            }
                        }
                        this.setState({ clipCanvas: c });
                    }
                }}
            />
        );
    }
}