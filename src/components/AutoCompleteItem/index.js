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
        const { id } = value
        if (id !== undefined) {
          this.state = { ...this.state, value: String(id) }
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
      this.setState({ value: String(value) })
    }
  }

  onSelect = (value) => {
    const { onChange } = this.props
    const { dataSource } = this.state
    for (let idx = 0; idx < dataSource.length;) {
      const item = dataSource[idx]
      const { id } = item
      if (String(id) === value) {
        onChange(item)
        break
      }
      idx += 1
    }
  }

  focus () {
    this.input.focus()
  }

  blur () {
    this.input.blur()
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

  saveInputRef = (input) => {
    this.input = input
  }

  handleOnBlur = () => {
    const { onBlur } = this.props
    if (onBlur) {
      onBlur()
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
        ref={this.saveInputRef}
        dataSource={dataSource.map(this.renderOption)}
        style={style}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        onBlur={this.handleOnBlur}
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
  onBlur: PropTypes.func,
  onSearch: PropTypes.func,
  value: PropTypes.any,
  placeholder: PropTypes.string,
}
