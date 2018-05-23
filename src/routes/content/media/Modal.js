import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal } from 'antd'
import { EditableTagGroup } from 'components'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="URL" {...formItemLayout}>
          {getFieldDecorator('url', { initialValue: item.url })(<TextArea rows={2} cols={3} />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', { initialValue: item.description })(<TextArea rows={3} cols={3} />)}
        </FormItem>
        <FormItem label="有效期" {...formItemLayout}>
          {getFieldDecorator('expiration', { initialValue: item.expiration })(<InputNumber />)}
        </FormItem>
        <FormItem label="分类" {...formItemLayout}>
          {getFieldDecorator('catalog', { initialValue: item.catalog })(<EditableTagGroup />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
