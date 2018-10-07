import React, { Component } from 'react'

class Select extends Component {
  constructor (props) {
    super(props)

    this.renderOption = this.renderOption.bind(this)
  }

  renderOption (option) {
    return (
      <option
        key={option.value}
        value={option.value}
      >
        {option.text}
      </option>
    )
  }

  componentDidMount () {
    this.props.onChange(this.props.name, this.props.options[0].value)
  }

  render () {
    const { title, name, error, options, onChange } = this.props
    const errorClass = error.indexOf(name) > -1 ? 'form-control error' : 'form-control'

    return (
      <>
        <span className={'field-title'}>
          {title}
        </span>
        <select 
          name={name}
          className={errorClass}
          onChange={e => onChange(name, e.target.value)}>
            {options.map(option => this.renderOption(option))}
        </select>
      </>
    )
  }
}

class TextInput extends Component {

  componentDidMount () {
    if (this.props.defaultVal) {
      this.props.onChange(this.props.name, this.props.defaultVal)
    }
  }

  render () {
    const { name, title, error, defaultVal, placeholder, onChange } = this.props
    const errorClass = error.indexOf(name) > -1 ? 'form-control error' : 'form-control'

    return (
      <>
        <span className={'field-title'}>
          {title}
        </span>
        <input
          type='text'
          name={name}
          className={errorClass}
          value={defaultVal}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}/>
      </>
    )
  }
}

class SubmitButton extends Component {
  render () {
    const { title, onClick } = this.props

    return (
      <button
        className={'btn'}
        onClick={onClick}>
          {title}
      </button>
    )
  }
}

export default class TransactionForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      gas: false,
      amount: false,
      recipient: false,
      formError: []
    }

    this.validateForm = this.validateForm.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
  }

  validateForm () {
    for (let key in this.state) {
      if (key === 'formError') {
        continue
      }
      if (!this.state[key]) {
        let newFormError = this.state.formError
        newFormError.push(key)
        this.setState({
          formError: newFormError
        })
      }
    }

    if (this.props.onSubmit && this.state.formError.length === 0) {
      this.props.onSubmit(this.state)
    }
  }

  updateFieldValue (field, value) {
    let newState = {
      formError: []
    }
    newState[field] = value
    this.setState(newState)
  }

  get batAmounts () {
    return [
      {
        value: '5', 
        text: '5 BAT'
      },
      {
        value: '10', 
        text: '10 BAT'
      },
      {
        value: '20', 
        text: '20 BAT'
      },
      {
        value: '30', 
        text: '30 BAT'
      },
      {
        value: '40', 
        text: '40 BAT'
      }
    ]
  }

  get gasAmounts () {
    return [
      {
        value: '1', 
        text: '1 BAT'
      },
      {
        value: '5', 
        text: '5 BAT'
      },
      {
        value: '10', 
        text: '10 BAT'
      }
    ]    
  }

  render () {
    const { toAddress, userAddress, userBalance } = this.props

    return (
      <div className='form'>
        {
          userAddress.length === 2
          ? <>
              <h3>Your Address is: {userAddress}</h3>
              <h4>Your Balance is: {userBalance}</h4>
            </>
          : null
        }
        <TextInput
          defaultVal={toAddress}
          name={'recipient'}
          title={'Address'}
          error={this.state.formError}
          placeholder={'Recipient\'s BAT Address'}
          onChange={this.updateFieldValue}/>
        <Select
          title={'Amount of BAT to tip'}
          name={'amount'}
          error={this.state.formError}
          options={this.batAmounts}
          onChange={this.updateFieldValue}/>
        <Select
          title={'Gas fee for this transaction'}
          name={'gas'}
          error={this.state.formError}
          options={this.gasAmounts}
          onChange={this.updateFieldValue}/>
        <SubmitButton
          onClick={this.validateForm}
          title={'Send Transaction'}/>
      </div>
    )
  }
}