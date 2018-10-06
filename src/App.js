import React, { Component } from 'react'
import TransactionForm from './TransactionForm'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userAddress: '',
      formShown: false,
      processing: false,
      transactionError: false,
      metaMaskEnabled: this.metaMaskEnabled,
    }

    this.toggleForm = this.toggleForm.bind(this)
    this.mainContent = this.mainContent.bind(this)
    this.submitTransaction = this.submitTransaction.bind(this)
    this.onTransactionProcessed = this.onTransactionProcessed.bind(this)
  }
  
  toggleForm () {
    this.setState({
      formShown: !this.state.formShown,
    })

    if (!this.state.formShown) {
      this.setState({
        userAddress: window.web3.eth.coinbase
      })
    }
  }

  submitTransaction (formState) {
    const addressesValid = (
      window.web3.isAddress(this.state.userAddress) &&
      window.web3.isAddress(formState.recipient)
    )
    const transferAmount = parseInt(formState.amount) || false

    if (!transferAmount ||
        !addressesValid ||
        !this.metaMaskEnabled()
       ) {
      console.log('Couldn\'t process transaction')
      return
    }

    this.setState({
      processing: true
    })

    window.web3.eth.sendTransaction({
      to: formState.recipient,
      from: this.state.userAddress,
      value: transferAmount
    }, this.onTransactionProcessed)
  }

  onTransactionProcessed (error, result) {
    this.setState({
      processing: false,
      transactionError: error
    })
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
          this.state.transactionError
          ? <strong>Couldn't process last transaction</strong>
          : null
        }
        {
          this.state.formShown
          ? <TransactionForm
              onSubmit={this.submitTransaction}
              userAddress={this.state.userAddress}/>
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
    return (
      <div className='app'>
        {
          this.state.metaMaskEnabled
          ? this.mainContent()
          : this.metaMaskError()
        }
      </div>
    );
  }
}

export default App;
