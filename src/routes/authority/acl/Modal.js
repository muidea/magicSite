import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Select, Modal } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const Option = Select.Option

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
        <FormItem label="URL" hasFeedback {...formItemLayout}>
          {getFieldDecorator('url', {
            initialValue: item.url,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="方法" {...formItemLayout}>
          {getFieldDecorator('method', {
            initialValue: item.method,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <RadioGroup>
              <RadioButton value={'POST'}>POST</RadioButton>
              <RadioButton value={'GET'}>GET</RadioButton>
              <RadioButton value={'PUT'}>PUT</RadioButton>
              <RadioButton value={'DELETE'}>DELETE</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="权限组" {...formItemLayout}>
          {getFieldDecorator('authgroup', {
            initialValue: item.authgroup,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <RadioGroup>
              <RadioButton value={0}>访客组</RadioButton>
              <RadioButton value={1}>用户组</RadioButton>
              <RadioButton value={2}>维护组</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="所属模块" {...formItemLayout}>
          {getFieldDecorator('module', {
            initialValue: item.module,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select defaultValue="lucy" style={{ width: 120 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item.status,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <RadioGroup>
              <RadioButton value={0}>启用</RadioButton>
              <RadioButton value={1}>停用</RadioButton>
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
