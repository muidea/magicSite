import React, { Component } from 'react'
import autobind from 'class-autobind'
import RichTextEditor, { EditorValue } from 'react-rte'
import { Tabs, Input } from 'antd'

const TabPane = Tabs.TabPane
const { TextArea } = Input

type Props = {
  value: string,
  onChange: (value: string) => any
}
type State = {
  value: EditorValue,
  format: string
}

export default class RichEditor extends Component {
  constructor (props) {
    super(props)
    autobind(this)
    let defaultFormat = 'markdown'
    let val = RichTextEditor.createEmptyValue()
    this.state = {
      value: val.setContentFromString(this.props.value, defaultFormat),
      format: defaultFormat,
    }

    this._onChange = this._onChange.bind(this)
    this._onChangeSource = this._onChangeSource.bind(this)
  }

  state: State
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
    let { value, format } = this.state
    return (
      <Tabs type="card">
        <TabPane tab="编辑器" key="richEditor">
          <RichTextEditor value={value} onChange={this._onChange} />
        </TabPane>
        <TabPane tab="Markdown模式" key="markdown">
          <TextArea rows={27} cols={30} value={value.toString(format)} onChange={this._onChangeSource} />
        </TabPane>
        <TabPane tab="预览" key="preView">
          <RichTextEditor value={value} readOnly />
        </TabPane>
      </Tabs>
    )
  }
}
