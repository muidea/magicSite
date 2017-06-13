import React from 'react'
import { Editor } from '../../../../components'
import { convertToRaw } from 'draft-js'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio } from 'antd'
// https://github.com/jpuri/react-draft-wysiwyg/blob/master/docs/src/components/Demo/index.js

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 22,
  },
}

class ContentEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.value,
    }
  }
  onEditorStateChange = (value) => {
    this.setState({
      value,
    })
  }
  
  render () {
    const { value } = this.state
    const colProps = {
      lg: 12,
      md: 24,
    }
    const textareaStyle = {
      minHeight: 496,
      width: '100%',
      background: '#f7f7f7',
      borderColor: '#F1F1F1',
      padding: '16px 8px',
    }
    return (<div>
      <Editor
        wrapperStyle={{
          minHeight: 500,
        }}
        editorStyle={{
          minHeight: 376,
        }}
        editorState={value}
        onEditorStateChange={this.onEditorStateChange}
      />
    </div>)
  }  
}

class EditorPage extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (<div className="content-inner">
      <Form layout="horizontal">
        <FormItem label="标题" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="内容" hasFeedback {...formItemLayout}>
          {getFieldDecorator('content', {
            rules: [
              {
                required: true,
              },
            ],            
          })(<ContentEditor />)}
        </FormItem>        
        <FormItem label="分类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('catalog', {
            rules: [
              {
                required: true,
                type: 'number',
              },
            ],
          })(
            <Radio.Group>
              <Radio value={1}>管理员组</Radio>
              <Radio value={0}>用户组</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Form>
    </div>)
  }
}

export default Form.create()(EditorPage)