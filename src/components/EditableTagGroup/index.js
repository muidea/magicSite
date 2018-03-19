import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tag, Input, Tooltip, Icon } from 'antd'

export default class EditableTagGroup extends Component {
  state = {
    value: [],
    inputVisible: false,
    inputValue: '',
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({ value })
    }
  }

  handleClose = (removedTag) => {
    const value = this.state.value.filter(tag => tag !== removedTag)
    this.setState({ value })
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const state = this.state
    const inputValue = state.inputValue
    let value = state.value
    let exitFlag = false
    for (let item of value) {
      if (item.name === inputValue) {
        exitFlag = true
        break
      }
    }
    if (inputValue && !exitFlag) {
      value = [...value, { name: inputValue, id: -1 }]
    }

    this.setState({
      value,
      inputVisible: false,
      inputValue: '',
    })

    const onChange = this.props.onChange
    if (onChange) {
      onChange(value)
    }
  }

  saveInputRef = (input) => {
    this.input = input
  }

  render () {
    const { value, inputVisible, inputValue } = this.state
    return (
      <div>
        {value.map((tag) => {
          const isLongTag = tag.name.length > 20
          const tagElem = (
            <Tag key={tag.name} closable={!this.props.readOnly} afterClose={() => this.handleClose(tag.name)}>
              {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </Tag>
          )
          return isLongTag ? <Tooltip title={tag.name} key={tag.name}>{tagElem}</Tooltip> : tagElem
        })}
        {inputVisible && !this.props.readOnly && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && !this.props.readOnly && (
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

EditableTagGroup.propTypes = {
  value: PropTypes.array,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
}
