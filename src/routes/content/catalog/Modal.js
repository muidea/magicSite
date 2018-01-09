import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { EditableTagGroup } from 'components'

const FormItem = Form.Item
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
      console.log('handleOk')
      console.log(data)
      console.log('...................')

      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  console.log('initial model....')
  console.log(item)
  console.log('finish initial model....')

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="分类名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="父类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('parent', {
            initialValue: item.parent,
          })(<EditableTagGroup />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
          })(<TextArea rows={3} cols={3} />)}
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
