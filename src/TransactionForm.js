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

  render () {
    const { title, name, options, onChange } = this.props

    return (
      <label className='form-label'>
        <span>{title}: </span>
        <select 
          name={name}
          onChange={e => onChange(name, e.target.value)}>
            {options.map(option => this.renderOption(option))}
        </select>
      </label>
    )
  }
}

class TextInput extends Component {
  render () {
    const { title, name, placeholder, onChange } = this.props

    return (
      <label className='form-label'>
        <span>{title}: </span>
        <input 
          type='text'
          name={name}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}/>
      </label>
    )
  }
}

class SubmitButton extends Component {
  render () {
    const { title, onClick } = this.props

    return (
      <button onClick={onClick}>{title}</button>
    )
  }
}

export default class TransactionForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: false,
      recipient: false
    }

    this.validateForm = this.validateForm.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
  }

  validateForm () {
    for (let key in this.state) {
      if (!this.state[key]) {
        console.log('One of the values was not filled out')
        return
      }
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(this.state)
    }
  }

  updateFieldValue (field, value) {
    let newState = {}
    newState[field] = value
    this.setState(newState)
  }

  get batAmounts () {
    return [
      {
        value: '',
        text: 'Select a value'
      },
      {
        value: '10', 
        text: '10'
      },
      {
        value: '20', 
        text: '20'
      },
      {
        value: '30', 
        text: '30'
      },
      {
        value: '40', 
        text: '40'
      }
    ]
  }

  render () {
    const { userAddress } = this.props

    return (
      <>
        {
          userAddress.length > 0
          ? <h3>Your Address is: {userAddress}</h3>
          : null
        }
        <TextInput
          title={'Recipient Address'}
          name={'recipient'}
          placeholder={'BAT Address'}
          onChange={this.updateFieldValue}/>
        <Select
          title={'BAT'}
          name={'amount'}
          options={this.batAmounts}
          onChange={this.updateFieldValue}/>
        <SubmitButton
          onClick={this.validateForm}
          title={'Send Transaction'}/>
      </>
    )
  }
}