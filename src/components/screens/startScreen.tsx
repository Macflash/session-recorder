import React, { Component } from 'react';
import { RecordButton } from '../buttons/recordButton';
import { ButtonBar } from '../layout/buttonBar';
import { ScreenWrapper } from '../layout/screenWrapper';
import { TitleBar } from '../layout/titleBar';

export interface IStartScreenProps {
    onStart: () => void;
    onSessionNameChange: (name: string) => void;
}

export class StartScreen extends Component<IStartScreenProps> {
    render() {
        return (
            <ScreenWrapper>
                <TitleBar title="Session Recorder" screen="start" />
                <div style={{ padding: "10% 15px", display: "flex" }}>
                    <input
                        onChange={e => {
                            this.props.onSessionNameChange(e.target.value);
                        }}
                        type="textfield"
                        style={{
                            flex: "auto",
                            fontSize: "200%",
                            padding: "5px",
                            textAlign: "center"
                        }}
                    />
                </div>
                <ButtonBar>
                    <RecordButton
                        onClick={this.props.onStart}
                        title="Start a new session"
                    />
                </ButtonBar>
            </ScreenWrapper>
        );
    }
}