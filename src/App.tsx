import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Recorder } from './recorder';
import { StartScreen } from './components/screens/startScreen';
import { ListenScreen } from './components/screens/listenScreen';

// App has 3 states. Start, Record and Listen
type Screen = "start" | "record" | "listen";

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

  render() {
    const { currentScreen } = this.state;
    switch (currentScreen) {
      case "record":
        // current functionality is in <Recorder>
        return <Recorder />;
      case "listen":
        return <ListenScreen />
      case "start":
      default:
        return <StartScreen
          onSessionNameChange={sessionName => { this.setState({ sessionName }) }}
          onStart={() => { this.setState({ currentScreen: "record" }) }}
        />
    }
  }
}

export default App;
