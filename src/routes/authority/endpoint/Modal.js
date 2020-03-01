import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

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

      const data = { ...getFieldsValue() }
      onOk({ ...data })
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="终端名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('endpoint', {
            initialValue: item.endpoint,
            rules: [
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="标识ID" hasFeedback {...formItemLayout}>
          {getFieldDecorator('identifyID', {
            initialValue: item.identifyID,
            rules: [
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="权限码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('authToken', {
            initialValue: item.authToken,
            rules: [
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', { initialValue: item.description })(<TextArea rows={3} cols={3} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  groupList: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
