import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
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
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
          })(<TextArea rows={3} cols={3} />)}
        </FormItem>
        <FormItem label="类型" {...formItemLayout}>
          {getFieldDecorator('catalog', {
            initialValue: item.catalog,
          })(
            <RadioGroup>
              <Radio value={0}>访客</Radio>
              <Radio value={1}>用户</Radio>
              <Radio value={2}>管理</Radio>
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
