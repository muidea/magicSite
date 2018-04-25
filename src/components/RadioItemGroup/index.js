import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default class RadioItemGroup extends Component {
  constructor (props) {
    super(props)

    if ('value' in props) {
      const { value } = props
      this.state = { value }
    }

    if ('disabled' in props) {
      const { disabled } = props
      this.state = { ...this.state, disabled }
    } else {
      this.state = { ...this.state, disabled: false }
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps
      this.setState({ value })
    }
  }

  handleInputChange = (e) => {
    let { value } = e.target
    this.setState({ value })
    const { onChange } = this.props
    if (onChange) { onChange(value) }
  }

  render () {
    const { dataSource } = this.props
    return (
      <RadioGroup style={this.props.style} disabled={this.state.disabled} onChange={this.handleInputChange} value={this.state.value}>
        { dataSource && dataSource.map((tag) => {
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
  dataSource: PropTypes.array,
  style: PropTypes.object,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}
