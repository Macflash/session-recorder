import React, { Component } from 'react';
import { RecordButton } from '../buttons/recordButton';
import { ButtonBar } from '../layout/buttonBar';
import { ScreenWrapper } from '../layout/screenWrapper';
import { TitleBar, ITitleBarProps } from '../layout/titleBar';
import { PaddedBar } from '../layout/paddedBar';

export type CurrentScreen = "start" | "record" | "listen";

export interface IScreenProps extends ITitleBarProps {
}

export class BaseScreen extends Component<IScreenProps> {
    render() {
        return (
            <ScreenWrapper>
                <TitleBar {...this.props} />
                {this.props.children}
            </ScreenWrapper>
        );
    }
}