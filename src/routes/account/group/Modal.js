import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader } from 'antd'
import city from '../../../utils/city'

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
        <FormItem label="分组名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('group_name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '分组名不能为空',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('group_description', {
            initialValue: item.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="分类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('group_catalog', {
            initialValue: item.catalog,
            rules: [
              {
                required: true,
                message: '无效E-mail!',
              },
            ],
          })(<Input />)}
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
