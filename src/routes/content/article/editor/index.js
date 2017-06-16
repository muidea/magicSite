import React from 'react'
import { Editor } from '../../../../components'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, InputNumber, Radio, Button } from 'antd'
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
  constructor(props) {
    super(props)

    this.state = {
      editorContent: EditorState.createEmpty(),
    }
  }

  onEditorStateChange = (editorContent) => {
    this.setState({
      editorContent,
    })
  }

  render() {
    const { editorContent } = this.state
    const { onChange } = this.props
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
        onChange={onChange}
      />
    </div>)
  }
}

class EditorPage extends React.Component {
  constructor(props) {
    super(props)
  }

  onEditorStateChange = (editorContent) => {
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (<div className="content-inner">
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        <Row>
          <Col>
            <FormItem label="标题" hasFeedback {...formItemLayout}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="内容" {...formItemLayout}>
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<ContentEditor onChange={this.onEditorStateChange} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <FormItem>
              <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>)
  }
}

export default Form.create()(EditorPage)