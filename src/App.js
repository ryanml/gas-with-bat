import React, { Component } from 'react'
import TransactionForm from './TransactionForm'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userAddress: '',
      formShown: true,
      processing: false,
      transactionError: false,
      userBalance: 0,
      metaMaskEnabled: this.metaMaskEnabled,
    }

    this.mainContent = this.mainContent.bind(this)
    this.submitTransaction = this.submitTransaction.bind(this)
    this.onWalletBalance = this.onWalletBalance.bind(this)
    this.onTransactionProcessed = this.onTransactionProcessed.bind(this)
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

  onWalletBalance (error, result) {
    this.setState({
      userBalance: result.e
    })
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
    const addressSplit = window.location.href.split('?address=')
    const toAddress = addressSplit.length > 0 && addressSplit[1]

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
              toAddress={toAddress}
              onSubmit={this.submitTransaction}
              userBalance={this.state.userBalance}
              userAddress={this.state.userAddress}/>
          : <div className='contentContainer'>
              <p>MetaMask is enabled, welcome to bat-guano-dev!</p>
              <button onClick={this.toggleForm}>
                Initiate Transaction
              </button>
            </div>
        }
      </div>
    )
  }

  componentDidMount () {
    this.setState({
      userAddress: window.web3.eth.coinbase,
    })
    window.web3.eth.getBalance(window.web3.eth.coinbase, this.onWalletBalance)
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
