import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default class RadioItemGroup extends Component {
  state = { value: '' }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps
      this.setState({ value })
    }
  }

  handleInputChange = (e) => {
    let { value } = e.target
    this.setState({ value })

    console.log(value)

    const { onChange } = this.props
    if (onChange) { onChange(value) }
  }

  render () {
    const { items } = this.props
    return (
      <RadioGroup onChange={this.handleInputChange} value={this.state.value}>
        { items && items.map((tag) => {
          const chkItem = (
            <RadioButton key={tag.id} value={tag.id} >
              {tag.name}
            </RadioButton>
          )
          return chkItem
        })}
      </RadioGroup>
    )
  }
}

RadioItemGroup.propTypes = {
  items: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
}
