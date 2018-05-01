import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

export default class AutoCompleteSelect extends Component {
  constructor (props) {
    super(props)

    if ('dataSource' in props) {
      const { dataSource } = props
      this.state = { dataSource }

      if ('value' in props && dataSource.length > 0) {
        const { value } = props
        if (value !== null && value !== undefined) {
          const { id } = value
          if (id !== undefined) {
            this.state = { ...this.state, value: id }
          }
        }
      }
    }
  }

  state = { dataSource: [] }

  componentWillReceiveProps (nextProps) {
    if ('dataSource' in nextProps) {
      const { dataSource } = nextProps
      this.setState({ dataSource })
    }

    if ('value' in nextProps) {
      const { value } = nextProps
      if (value !== null && value !== undefined) {
        const { id } = value
        this.setState({ value: id })
      }
    }
  }

  handleChange = (value) => {
    const { onChange } = this.props
    if (onChange !== null && onChange !== undefined) {
      const { dataSource } = this.state
      for (let idx = 0; idx < dataSource.length;) {
        const item = dataSource[idx]
        const { id } = item
        if (id === value) {
          onChange(item)
          break
        }
        idx += 1
      }
    }
  }

  focus () {
    this.input.focus()
  }

  blur () {
    this.input.blur()
  }

  saveInputRef = (input) => {
    this.input = input
  }

  render () {
    const { style, placeholder, disabled, onBlur } = this.props
    const { dataSource, value } = this.state

    return (
      <Select
        showSearch
        disabled={disabled}
        style={style}
        ref={this.saveInputRef}
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={this.handleChange}
        onBlur={onBlur}
        value={value}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {dataSource && dataSource.map((item) => {
          const { id, name } = item
          return <Option key={id} value={id}>{name}</Option>
        })}
      </Select>
    )
  }
}

AutoCompleteSelect.propTypes = {
  dataSource: PropTypes.array,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.any,
  placeholder: PropTypes.string,
}
