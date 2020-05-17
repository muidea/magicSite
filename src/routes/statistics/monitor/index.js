import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { Page } from 'components'
import { NumberCard, RecentContent, RecentAccount } from './components'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

function Monitor({ monitor, loading }) {
  const { systemSummary, lastContent, lastAccount } = monitor
  const numberCards = systemSummary.map((item, key) => (<Col key={key} lg={6} md={12}>
    <NumberCard {...item} />
  </Col>))

  return (
    <Page loading={loading.models.monitor}>
      <Row gutter={24}>
        {numberCards}
      </Row>
      <Row gutter={24}>
        <Col lg={12} md={24}>
          <Card bordered={false} {...bodyStyle}>
            <RecentContent data={lastContent} />
          </Card>
        </Col>
        <Col lg={12} md={24}>
          <Card bordered={false} {...bodyStyle}>
            <RecentAccount data={lastAccount} />
          </Card>
        </Col>
      </Row>
    </Page>
  )
}

Monitor.propTypes = {
  monitor: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ monitor, loading }) => ({ monitor, loading }))(Monitor)
