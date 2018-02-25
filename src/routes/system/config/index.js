import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card, Row, Col, Button } from 'antd'
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

const Config = ({ location, dispatch, config }) => {
  location.query = queryString.parse(location.search)
  const { modalVisible, modalType, systemInfo } = config
  const { siteName, siteDomain, siteDescription, emailServer, emailAccount, emailPassword } = systemInfo

  const modalProps = {
    item: systemInfo,
    type: modalType,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'updateSite' ? '站点信息' : '系统信息'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'config/updateSystemInfo',
        payload: data,
      })
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
      payload: {
        modalType: 'updateSite',
      },
    })
  }

  const onSystemInfoSetting = () => {
    dispatch({
      type: 'config/showModal',
      payload: {
        modalType: 'updateSystem',
      },
    })
  }

  return (
    <Page inner>
      <Card title="站点信息" bordered extra={<Button type="primary" onClick={onSiteInfoSetting}>设置</Button>}>
        <Row gutter={20}><Col {...ColProps}>名称：{siteName}</Col></Row>
        <Row gutter={20}><Col {...ColProps}>域名：{siteDomain}</Col></Row>
        <Row gutter={20}><Col {...ColProps}>描述：</Col></Row>
        <Row gutter={20}><Col {...ColProps}>{siteDescription}</Col></Row>
      </Card>
      <Card title="系统信息" bordered extra={<Button type="primary" onClick={onSystemInfoSetting}>设置</Button>}>
        <Row gutter={20}><Col {...ColProps}>邮件服务器：{emailServer}</Col></Row>
        <Row gutter={20}><Col {...ColProps}>邮件账号：{emailAccount}</Col><Col>账号密码：{emailPassword}</Col></Row>
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
