import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;

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
          })(<TextArea rows={4} />)}
        </FormItem>
        <FormItem label="分类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('group_catalog', {
            initialValue: item.catalog.id,
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
