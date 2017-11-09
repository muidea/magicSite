import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'antd'
import { Search } from 'components'

const Filter = ({
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
  },
}) => {

  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }

  const { account } = filter

  return (
    <div style={{ paddingBottom: 20 }}>
    <Row>
      <Col offset={6}>
        {getFieldDecorator('account', { initialValue: account })(<Search placeholder="请输入" size="large" style={{ width: 648 }} onSearch={handleSubmit} />)}
      </Col>
    </Row>
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
