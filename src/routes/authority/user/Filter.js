import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Popconfirm } from 'antd'

const { Search } = Input
const ColProps = {
  xs: 24,
  sm: 12,
  style: { marginBottom: 16 },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onFilterChange,
  onDeleteItems,
  selectedRowKeys,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (const item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleDeleteItems = () => {
    onDeleteItems()
  }

  const { name } = filter

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 14 }} md={{ span: 14 }}>
        {getFieldDecorator('name', { initialValue: name })(<Search placeholder="查找分组" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>查找</Button>
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          <div>
            {
              selectedRowKeys.length > 0 &&
              <Popconfirm title="确认删除选中项?" placement="left" onConfirm={handleDeleteItems}>
                <Button type="primary" style={{ marginRight: 16 }} size="large">删除</Button>
              </Popconfirm>
            }
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  selectedRowKeys: PropTypes.array,
  onDeleteItems: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
