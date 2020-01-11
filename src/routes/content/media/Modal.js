import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal } from 'antd'
import { MultiUpload } from 'components'
import { CatalogTree } from '../common'


const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item,
  serverUrl,
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
      const { name, description, file } = data
      const { fileToken } = file

      onOk({ name, description, catalog, fileToken })
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              { required: true },
            ],
          })(<Input />)}
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
        <FormItem label="文件" {...formItemLayout}>
          {getFieldDecorator('file', {
            rules: [{
              required: true, message: '文件不能为空',
            }],
          })(<MultiUpload serverUrl={serverUrl} />)}
        </FormItem>
        <FormItem label="有效期" {...formItemLayout}>
          {getFieldDecorator('expiration', {
          })(<div><InputNumber defaultValue={0} /><span>&nbsp;天, 0表示永久有效</span></div>)}
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
