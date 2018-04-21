import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tag, Tooltip, Icon } from 'antd'
import AutoCompleteItem from '../AutoCompleteItem'

export default class AutoCompleteTagGroup extends Component {
  state = {
    value: [],
    inputVisible: false,
    inputValue: {},
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps
      this.setState({ value })
    }
  }

  handleClose = (removedTag) => {
    const value = this.state.value.filter(tag => tag.name !== removedTag)
    this.setState({ value })

    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e })
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state
    const { id } = inputValue
    if (id === undefined) {
      this.setState({
        inputVisible: false,
        inputValue: {},
      })

      return
    }

    let { value } = this.state
    let exitFlag = false
    for (let item of value) {
      if (item.id === inputValue.id) {
        exitFlag = true
        break
      }
    }
    if (inputValue && !exitFlag) {
      value = [...value, inputValue]
    }

    this.setState({
      value,
      inputVisible: false,
      inputValue: {},
    })

    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
  }

  saveInputRef = (input) => {
    this.input = input
  }

  render () {
    const { value, inputVisible, inputValue } = this.state
    const { dataSource } = this.props
    return (
      <div>
        {value && value.map((tag) => {
          const isLongTag = tag.name.length > 20
          const tagElem = (
            <Tag key={tag.name} closable afterClose={() => this.handleClose(tag.name)}>
              {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </Tag>
          )
          return isLongTag ? <Tooltip title={tag.name} key={tag.name}>{tagElem}</Tooltip> : tagElem
        })}
        {inputVisible && (
          <AutoCompleteItem
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            dataSource={dataSource}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> 添加
          </Tag>
        )}
      </div>
    )
  }
}

AutoCompleteTagGroup.propTypes = {
  dataSource: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
}
