import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

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
    getFieldValue,
    setFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      const password = getFieldValue('password')
      const repassword = getFieldValue('repassword')
      if (password !== repassword) {
        setFields({ repassword: { value: repassword, errors: [new Error('两次密码输入不一致')] } })
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
        <FormItem label="账号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('account', {
            initialValue: item.account,
            rules: [
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: item.password,
            rules: [
              { required: true },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem label="确认密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('repassword', {
            initialValue: item.repassword,
            rules: [
              { required: true },
            ],
          })(<Input type="password" />)}
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
