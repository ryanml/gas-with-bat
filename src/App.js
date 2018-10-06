import React, { Component } from 'react'
import TransactionForm from './TransactionForm'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formShown: false
    }

    this.toggleForm = this.toggleForm.bind(this)
    this.mainContent = this.mainContent.bind(this)
  }
  
  toggleForm () {
    this.setState({
      formShown: !this.state.formShown
    })
  }

  submitTransaction () {
    window.alert('Form Submit Action')
  }

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
      <div className='contentContainer'>
        {
          this.state.formShown
          ? <TransactionForm 
              onSubmit={this.submitTransaction}/>
          : <div className='contentContainer'>
              <p>MetaMask is enabled, welcome to bat-guano-dev!</p>
              <p>Click the button below to get started</p>
              <button onClick={this.toggleForm}>
                Enable form
              </button>
            </div>
        }
      </div>
    )
  }

  render () {
    const metaMask = this.metaMaskEnabled()

    return (
      <div className='app'>
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
