import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const { TextArea } = Input
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  type,
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
      {type === 'updateSite' &&
        <Form layout="horizontal">
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="域名" {...formItemLayout}>
            {getFieldDecorator('domain', {
              initialValue: item.domain,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="描述" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true,
                },
              ],
            })(<TextArea rows={5} cols={10} />)}
          </FormItem>
        </Form>
      }
      {type === 'updateSystem' &&
        <Form layout="horizontal">
          <FormItem label="邮件服务器" {...formItemLayout}>
            {getFieldDecorator('mailServer', {
              initialValue: item.emailServer,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="邮件账号" {...formItemLayout}>
            {getFieldDecorator('mailAccount', {
              initialValue: item.emailAccount,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="账号密码" {...formItemLayout}>
            {getFieldDecorator('mailPassword', {
              initialValue: item.emailPassword,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input type="password" />)}
          </FormItem>
        </Form>
      }
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
