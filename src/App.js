import React, { Component } from 'react'
import * as qs from 'query-string';
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
      userBalance: 0,
      publisherName: false,
      publisherFavicon: false,
      metaMaskEnabled: this.metaMaskEnabled,
    }

    this.mainContent = this.mainContent.bind(this)
    this.toggleForm = this.toggleForm.bind(this)
    this.submitTransaction = this.submitTransaction.bind(this)
    this.onWalletBalance = this.onWalletBalance.bind(this)
    this.onTransactionProcessed = this.onTransactionProcessed.bind(this)
  }

  submitTransaction (formState) {
    const addressesValid = (
      window.web3.isAddress(this.state.userAddress) &&
      window.web3.isAddress(formState.recipient)
    )
    const transferGas = parseInt(formState.gas) || false
    const transferAmount = parseInt(formState.amount) || false

    if (!transferGas ||
        !transferAmount ||
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
      gas: transferGas,
      gasPrice: 0,
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

  toggleForm () {
    this.setState({
      formShown: !this.state.formShown,
    })
    if (!this.state.formShown) {
      this.setState({
        userAddress: window.web3.eth.coinbase
      })
    }
    window.web3.eth.getBalance(window.web3.eth.coinbase, this.onWalletBalance)
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

  heroBanner () {
    const titleText = this.state.formShown ? 'Send a BAT tip' : 'Tip this creator';

    return (
      <div className={'hero'}>
        <img
          width={'175'}
          height={'100'}
          src={'/bat.png'}
          className={'bat-img'}
        />
        <h4>{titleText}</h4>
      </div>
    )
  }

  publisherContent (name, faviconUrl) {

    return (
      <div className={'publisher-info'}>
        <h6 className={'publisher-label'}>Recipient</h6>
        <div className={'youtube-box'}>
          <img
            src={faviconUrl}
            className={'publisher-icon'}/>
          <span className={'publisher-name'}>{name}</span>
        </div>
      </div>
    )
  }

  mainContent () {
    const queryParams = qs.parse(window.location.search)
    const publisher = queryParams.publisher || false
    const videoTitle = queryParams.videotitle || false
    const faviconUrl = queryParams.faviconurl || false
    const toAddress = queryParams.address || ''

    return (
      <div>
        {this.heroBanner()}
        {
          this.state.formShown
          ? <>
              {
                publisher && faviconUrl
                ? this.publisherContent(publisher, faviconUrl)
                : null
              }
              <TransactionForm
                toAddress={toAddress}
                onSubmit={this.submitTransaction}
                userBalance={this.state.userBalance}
                userAddress={this.state.userAddress}/>
              {
                this.state.transactionError
                ? <strong>Couldn't process last transaction</strong>
                : null
              }
            </>
          : <div className={'content-container'}>
              {
                publisher && videoTitle
                ? <p>Would you like to tip {publisher} for creating "{videoTitle}"?</p>
                : null
              }
              <button
                className={'btn'}
                onClick={this.toggleForm}>
                Send a BAT Tip
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
