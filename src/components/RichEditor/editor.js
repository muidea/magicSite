import React, { Component } from 'react'
import autobind from 'class-autobind'
import RichTextEditor, { EditorValue } from 'react-rte'
import { Tabs, Input } from 'antd'
import defaultFormat from './common'

const TabPane = Tabs.TabPane
const { TextArea } = Input

type Props = {
  value: string,
  placeholder: string,
  editorStyle: any,
  onChange: (value: string) => any
}
type State = {
  value: EditorValue,
  format: string,
  placeholder: string,
  editorStyle: string
}

export default class RichEditor extends Component {
  constructor (props) {
    super(props)

    autobind(this)

    this.state = {
      value: RichTextEditor.createEmptyValue(),
      format: defaultFormat,
      placeholder: props.placeholder,
      editorStyle: props.editorStyle,
    }

    this._onChange = this._onChange.bind(this)
    this._onChangeSource = this._onChangeSource.bind(this)
  }

  state: State

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: this.state.value.setContentFromString(nextProps.value, this.state.format),
      })
    }

    if (this.props.placeholder !== nextProps.placeholder) {
      this.setState({
        placeholder: nextProps.placeholder,
      })
    }
  }
  props: Props

  _onChange (value) {
    this.setState({ value })

    this.props.onChange(value.toString(this.state.format))
  }

  _onChangeSource (event) {
    let source = event.target.value
    let oldValue = this.state.value

    this.setState({
      value: oldValue.setContentFromString(source, this.state.format),
    })

    this.props.onChange(source)
  }

  render () {
    let { value, format, placeholder, editorStyle } = this.state

    return (
      <Tabs type="card">
        <TabPane tab="编辑器" key="richEditor">
          <div className="row">
            <RichTextEditor
              toolbarClassName="demo-toolbar"
              editorClassName="demo-editor"
              value={value}
              onChange={this._onChange}
              placeholder={placeholder}
              editorStyle={editorStyle}
            />
          </div>
        </TabPane>
        <TabPane tab="Markdown模式" key="markdown">
          <div className="row">
            <TextArea rows={27} cols={30} value={value.toString(format)} onChange={this._onChangeSource} />
          </div>
        </TabPane>
        <TabPane tab="预览" key="preView">
          <div className="row">
            <RichTextEditor value={value} editorStyle={editorStyle} readOnly />
          </div>
        </TabPane>
      </Tabs>
    )
  }
}
