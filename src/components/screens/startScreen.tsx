import React, { Component } from 'react';
import { RecordButton } from '../buttons/recordButton';
import { ButtonBar } from '../layout/buttonBar';
import { ScreenWrapper } from '../layout/screenWrapper';
import { TitleBar } from '../layout/titleBar';
import { PaddedBar } from '../layout/paddedBar';
import { BaseScreen, IScreenProps } from './baseScreen';

export interface IStartScreenProps extends IScreenProps {
    onSessionNameChange: (name: string) => void;
}

export class StartScreen extends Component<IStartScreenProps> {
    render() {
        return (
            <BaseScreen title={this.props.title} screen={this.props.screen} onScreenChange={this.props.onScreenChange}>
                <PaddedBar>
                    <input
                        onChange={e => {
                            this.props.onSessionNameChange(e.target.value);
                        }}
                        type="textfield"
                        style={{
                            height: "50px",
                            flex: "auto",
                            fontSize: "200%",
                            padding: "5px",
                            textAlign: "center"
                        }}
                    />
                </PaddedBar>
                <ButtonBar>
                    <RecordButton
                        onClick={()=>{this.props.onScreenChange("record")}}
                        title="Start a new session"
                    />
                </ButtonBar>
            </BaseScreen>
        );
    }
}