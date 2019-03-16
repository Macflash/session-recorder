import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Recorder } from './components/recorder';
import { StartScreen } from './components/screens/startScreen';
import { ListenScreen } from './components/screens/listenScreen';
import { CurrentScreen } from './components/screens/baseScreen';

// App has 3 states. Start, Record and Listen
export type Screen = "start" | "record" | "listen";

interface IAppProps {
}

interface IAppState {
  currentScreen: Screen;
  sessionName?: string;
}

class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = { currentScreen: "start" };
  }

  private setScreen = (currentScreen: CurrentScreen) => {
    this.setState({ currentScreen });
  }

  render() {
    const { currentScreen } = this.state;
    switch (currentScreen) {
      case "record":
        // current functionality is in <Recorder>
        return <Recorder
          screen={this.state.currentScreen}
          onScreenChange={this.setScreen}
          title={this.state.sessionName}
        />;
      case "listen":
        return <ListenScreen
          title={this.state.sessionName}
          screen={this.state.currentScreen}
          onScreenChange={this.setScreen}
        />
      case "start":
      default:
        return <StartScreen
          title={this.state.sessionName}
          screen={this.state.currentScreen}
          onScreenChange={this.setScreen}
          onSessionNameChange={sessionName => { this.setState({ sessionName }) }}
        />
    }
  }
}

export default App;
