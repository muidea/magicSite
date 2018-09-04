import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { AutoCompleteTagGroup } from 'components'
import { ToCatalogUnit } from '../../util'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item,
  catalogList,
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
      const { name, description, catalog } = data
      const catalogUnit = ToCatalogUnit(catalog)

      onOk({ name, description, catalog: catalogUnit })
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="分类名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{ required: true }],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', { initialValue: item.description })(<TextArea rows={3} cols={3} />)}
        </FormItem>
        <FormItem label="父类" {...formItemLayout}>
          {getFieldDecorator('catalog', { initialValue: item.catalog })(<AutoCompleteTagGroup
            dataSource={catalogList}
            placeholder="input here"
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
  catalogList: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
