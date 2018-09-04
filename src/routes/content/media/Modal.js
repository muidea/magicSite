import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal } from 'antd'
import { EditableTagGroup, MultiUpload } from 'components'
import { ToCatalogUnit } from '../../util'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const modal = ({
  serverUrl,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }

      const { description } = values
      const catalogUnit = ToCatalogUnit(values.catalog)

      if (!description) {
        values = { ...values, description: '' }
      }
      onOk({ ...values, catalog: catalogUnit })
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem>
          {getFieldDecorator('medias', {
            rules: [{
              required: true, message: '文件不能为空',
            }],
          })(<MultiUpload serverUrl={serverUrl} />)}
        </FormItem>
        <FormItem label="有效期(天)" {...formItemLayout}>
          {getFieldDecorator('expiration', {
            rules: [{
              required: true, message: '请输入文件有效期',
            }],
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="分类" {...formItemLayout}>
          {getFieldDecorator('catalog', {
            rules: [{
              required: true, message: '分类不能为空',
            }],
          })(<EditableTagGroup />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', { })(<TextArea rows={3} cols={3} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  serverUrl: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Form.create()(modal)
