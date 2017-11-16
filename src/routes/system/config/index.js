import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Card, Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import Modal from './Modal'


const ColProps = {
  xs: 20,
  sm: 10,
  style: {
    marginBottom: 16,
  },
}

const Config = ({ location, dispatch, config, loading }) => {
  location.query = queryString.parse(location.search)
  const { modalVisible, systemInfo } = config
  const { siteName, siteDomain, siteDescription, emailServer, emailAccount, emailPassword } = systemInfo

  const modalProps = {
    item: systemInfo,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['config/updateSystemInfo'],
    title: `站点信息`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
    },
    onCancel () {
      dispatch({
        type: 'config/hideModal',
      })
    },
  }

  const onSiteInfoSetting = () => {
    dispatch({
      type: 'config/showModal',
      payload: { },
    })
  }

  const onSystemInfoSetting = () => {
    dispatch({
      type: 'config/showModal',
      payload: { },
    })
  }

  return (
    <Page inner>
    <Card title="站点信息" bordered={true} extra={<Button onClick={onSiteInfoSetting}>设置</Button>}>
      <Row gutter={20}><Col {...ColProps}>名称：{siteName}</Col></Row>
      <Row gutter={20}><Col {...ColProps}>域名：{siteDomain}</Col></Row>
      <Row gutter={20}><Col {...ColProps}>描述：</Col></Row>
      <Row gutter={20}><Col {...ColProps}>{siteDescription}</Col></Row>
    </Card>
    <Card title="系统信息" bordered={true} extra={<Button onClick={onSystemInfoSetting}>设置</Button>}>
      <Row gutter={20}><Col {...ColProps}>邮件服务器：{emailServer}</Col></Row>
      <Row gutter={20}><Col {...ColProps}>邮件账号：{emailAccount}</Col><Col>邮件密码：{emailPassword}</Col></Row>
    </Card>
    {modalVisible && <Modal {...modalProps} />}
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
