import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Card, Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'

const ColProps = {
  xs: 20,
  sm: 10,
  style: {
    marginBottom: 16,
  },
}

const Config = ({ location, dispatch, config, loading }) => {
  location.query = queryString.parse(location.search)
  const { systemInfo } = config
  const { siteName, siteDomain, siteDescription, emailServer, emailAccount, emailPassword } = systemInfo

  return ( 
    <Page inner>
    <Card title="站点信息" bordered={true} extra={<a href="#">设置</a>}>
      <Row gutter={20}><Col {...ColProps}>名称：{siteName}</Col></Row>
      <Row gutter={20}><Col {...ColProps}>域名：{siteDomain}</Col></Row>
      <Row gutter={20}><Col {...ColProps}>描述：</Col></Row>
      <Row gutter={20}><Col {...ColProps}>{siteDescription}</Col></Row>
    </Card>
    <Card title="系统信息" bordered={true} extra={<a href="#">设置</a>}>
      <Row gutter={20}><Col {...ColProps}>邮件服务器：{emailServer}</Col></Row>
      <Row gutter={20}><Col {...ColProps}>邮件账号：{emailAccount}</Col><Col>邮件密码：{emailPassword}</Col></Row>
    </Card>
    </Page>
  )
}

Config.propTypes = {
  config: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ config, loading }) => ({ config, loading }))(Config)
