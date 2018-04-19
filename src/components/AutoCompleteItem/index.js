import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AutoComplete } from 'antd'

const { Option } = AutoComplete

export default class AutoCompleteItem extends Component {
  constructor (props) {
    super(props)

    if ('dataSource' in props) {
      const { dataSource } = props
      this.state = { dataSource }
    }
    if ('value' in props) {
      const { value } = props
      const { id } = value
      this.state = { ...this.state, value: String(id) }
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
      this.setState({ value: String(value.id) })
    }
  }

  onSelect = (value) => {
    console.log('onSelect....')
    const { onChange, isNumber } = this.props
    if (onChange) {
      if (isNumber) {
        onChange(Number(value))
      } else {
        onChange(value)
      }
    }
  }

  handleSearch = (value) => {
    const { onSearch } = this.props
    if (onSearch) {
      onSearch(value)
    }
  }

  renderOption = (item) => {
    return (
      <Option key={item.id} text={item.name} >
        {item.name}
      </Option>
    )
  }

  render () {
    const { style, placeholder } = this.props
    const { dataSource, value } = this.state

    return (
      <AutoComplete
        dataSource={dataSource.map(this.renderOption)}
        style={style}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        defaultValue={value}
        placeholder={placeholder}
      />
    )
  }
}

AutoCompleteItem.propTypes = {
  dataSource: PropTypes.array,
  style: PropTypes.object,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  isNumber: PropTypes.bool,
  value: PropTypes.any,
  placeholder: PropTypes.string,
}
