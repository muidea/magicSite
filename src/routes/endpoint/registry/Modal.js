import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { AutoCompleteTagGroup, RadioItemGroup } from 'components'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item,
  userList,
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
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const statusItems = [
    { id: 0, name: '启用' },
    { id: 1, name: '停用' },
  ]

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="ID" {...formItemLayout}>
          {getFieldDecorator('id', {
            initialValue: item.id,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem label="名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', { initialValue: item.description })(<TextArea rows={3} cols={3} />)}
        </FormItem>
        <FormItem label="用户" {...formItemLayout}>
          {getFieldDecorator('user', { initialValue: item.user })(<AutoCompleteTagGroup style={{ width: 200 }} dataSource={userList} />)}
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: { id: item.status },
            rules: [{ required: true }],
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
  userList: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
