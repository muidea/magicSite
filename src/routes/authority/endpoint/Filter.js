import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input } from 'antd'

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
  onAddItem,
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
    for (let item in fields) {
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
            <Button size="large" type="ghost" onClick={onAddItem}>新建</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onAddItem: PropTypes.func,
}

export default Form.create()(Filter)
