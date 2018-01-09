import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tag, Input, Tooltip, Icon } from 'antd'

export default class EditableTagGroup extends Component {
  constructor (props) {
    super(props)
    if (props.value) {
      this.state = {
        value: props.value,
      }
    }
  }

  state = {
    value: [],
    inputVisible: false,
    inputValue: '',
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState(value)
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
    if (inputValue && value.indexOf(inputValue) === -1) {
      value = [...value, inputValue]
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
          const isLongTag = tag.length > 20
          const tagElem = (
            <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          )
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem
        })}
        {inputVisible && (
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
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    )
  }
}

EditableTagGroup.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
}
