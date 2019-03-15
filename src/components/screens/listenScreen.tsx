import React, { Component } from 'react';
import { ScreenWrapper } from '../layout/screenWrapper';
import { TitleBar } from '../layout/titleBar';
import { IScreenProps, BaseScreen } from './baseScreen';
import { PaddedBar } from '../layout/paddedBar';

export interface IListScreenProps extends IScreenProps {
}

export class ListenScreen extends Component<IListScreenProps> {
    render() {
        return (
            <BaseScreen title={this.props.title} screen={this.props.screen} onScreenChange={this.props.onScreenChange}>
                <PaddedBar>Listening!</PaddedBar>
            </BaseScreen>
        );
    }
}