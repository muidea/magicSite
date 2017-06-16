import React from 'react'
import { Editor } from '../../../../components'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
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

    //const content = ContentState.create('<p>a<code>a</code>a<del>bbb</del></p>')
    //const edit = EditorState.create(content)

    const value = this.props.value
    this.state = {
      editorContent: null,
      contentValue: value,
    }
  }

  onEditorStateChange = (editorContent) => {
    const contentValue = draftToHtml(convertToRaw(editorContent.getCurrentContent()))
    console.log(contentValue);    
    this.setState({
      editorContent,
      contentValue,
    })
  }
  
  render () {
    const { editorContent } = this.state
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
        editorState={editorContent}
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