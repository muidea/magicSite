import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Form, Input, Radio } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 22,
  },
}

const Editor = ({ 
  articleEditor,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }, }) => {
  const { data } = articleEditor
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: data.key,
      }
      //onOk(data)
    })
  }

  return (<div className="content-inner">
    <div className={styles.content}>
    <Form layout="horizontal">
        <FormItem label="标题" hasFeedback {...formItemLayout}>
          {getFieldDecorator('article_title', {
            initialValue: data.title,
            rules: [
              {
                required: true,
                message: '标题不能为空',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="内容" hasFeedback {...formItemLayout}>
          {getFieldDecorator('article_content', {
            initialValue: data.content,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea rows={30} cols={30} />)}
        </FormItem>
        <FormItem label="分类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('article_catalog', {
            initialValue: data.catalog,
            rules: [
              {
                required: true,
                message: '分类必须选择',
              },
            ],
          })(
            <RadioGroup>
            <Radio value={1}>注册用户</Radio>
            <Radio value={2}>特权用户</Radio>
            <Radio value={3}>系统管理员</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    </div>
  </div>)
}

Editor.propTypes = {
  articleEditor: PropTypes.object,
  form: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ articleEditor, loading }) => ({ articleEditor, loading: loading.models.articleEditor }))(Form.create()(Editor))
