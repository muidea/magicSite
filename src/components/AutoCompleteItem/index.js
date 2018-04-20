import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AutoComplete } from 'antd'

const { Option } = AutoComplete

export default class AutoCompleteItem extends Component {
  constructor (props) {
    super(props)

    const { dataSource, value } = props
    if (dataSource !== undefined) {
      this.state = { dataSource }

      if (value !== undefined && dataSource.length > 0) {
        this.state = { ...this.state, value: String(value) }
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
      this.setState({ value: String(value) })
    }
  }

  onSelect = (value) => {
    console.log('onSelect....')
    console.log(value)
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

    let filteredItem = []

    for (let idx = 0; idx < this.props.dataSource.length;) {
      const item = this.props.dataSource[idx]
      const { name } = item
      if (name.indexOf(value) > -1) {
        filteredItem.push(item)
      }

      idx += 1
    }
    this.setState({ dataSource: filteredItem })
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
