import React, { Component } from 'react';
import './App.css';

class App extends Component {

  metaMaskEnabled () {
    return typeof window.web3 !== 'undefined'
  }

  metaMaskError () {
    return (
      <div className="error">
        <p>The MetaMask extension does not seem to be enabled</p>
        <p>Please enable the MetaMask extension and reload the page</p>
      </div>
    )
  }

  mainContent () {
    return (
      <p>MetaMask is enabled</p>
    )
  }

  render () {
    const metaMask = this.metaMaskEnabled()

    return (
      <div className="App">
        {
          metaMask
          ? this.mainContent()
          : this.metaMaskError()
        }
      </div>
    );
  }
}

export default App;
