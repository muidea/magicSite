import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { RadioItemGroup } from '../../../components'

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

  const methodItems = [
    { id: 'GET', name: 'GET' },
    { id: 'POST', name: 'POST' },
    { id: 'PUT', name: 'PUT' },
    { id: 'DELETE', name: 'DELETE' },
  ]

  const authGroupItems = [
    { id: 0, name: '访客组' },
    { id: 1, name: '用户组' },
    { id: 2, name: '维护组' },
  ]

  const statusItems = [
    { id: 0, name: '启用' },
    { id: 1, name: '停用' },
  ]

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="URL" {...formItemLayout}>
          {getFieldDecorator('url', {
            initialValue: item.url,
            rules: [
              { required: true },
            ],
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="方法" {...formItemLayout}>
          {getFieldDecorator('method', {
            initialValue: { id: item.method },
            rules: [
              { required: true },
            ],
          })(<RadioItemGroup disabled dataSource={methodItems} />)}
        </FormItem>
        <FormItem label="权限组" {...formItemLayout}>
          {getFieldDecorator('authGroup', {
            initialValue: item.authGroup,
            rules: [
              { required: true },
            ],
          })(<RadioItemGroup dataSource={authGroupItems} />)}
        </FormItem>
        <FormItem label="所属模块" {...formItemLayout}>
          {getFieldDecorator('module', {
            initialValue: item.module,
            rules: [
              { required: true },
            ],
          })(<RadioItemGroup disabled dataSource={[{ id: item.module.id, name: item.module.name }]} />)}
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item.status,
            rules: [
              { required: true },
            ],
          })(<RadioItemGroup dataSource={statusItems} />)}
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
