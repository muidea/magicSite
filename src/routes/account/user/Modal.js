import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { AutoCompleteTagGroup } from '../../../components'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item,
  groupList,
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
        <FormItem label="账号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('account', {
            initialValue: item.account,
            rules: [
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="EMail" {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="分组" {...formItemLayout}>
          {getFieldDecorator('group', {
            initialValue: item.group,
            rules: [
              { required: true },
            ],
          })(<AutoCompleteTagGroup
            dataSource={groupList}
          />)}
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
