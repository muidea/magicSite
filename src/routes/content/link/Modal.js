import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { CatalogTree } from '../common'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item,
  catalogTree,
  onLoadData,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      const data = { ...getFieldsValue() }
      const { catalog } = data
      if (catalog && item.id) {
        if (catalog.id === item.id) {
          setFields({ catalog: { value: catalog, errors: [new Error('父分类不能为当前分类')] } })
          return
        }
      }

      onOk({ ...data })
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
              { required: true },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="URL" {...formItemLayout}>
          {getFieldDecorator('url', {
            initialValue: item.url,
            rules: [
              { required: true },
            ],
          })(<TextArea rows={2} cols={3} />)}
        </FormItem>
        <FormItem label="图标" {...formItemLayout}>
          {getFieldDecorator('logo', { initialValue: item.logo })(<TextArea rows={2} cols={3} />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', { initialValue: item.description })(<TextArea rows={3} cols={3} />)}
        </FormItem>
        <FormItem label="分类" {...formItemLayout}>
          {getFieldDecorator('catalog', {
            initialValue: item.catalog,
            rules: [
              { required: true },
            ],
          })(
            <CatalogTree treeData={catalogTree} onLoadData={onLoadData} multiple />,
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  catalogTree: PropTypes.array,
  onLoadData: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
