import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card, Row, Col, Button } from 'antd'
import { Page } from 'components'
import qs from 'qs'
import Modal from './Modal'


const ColProps = {
  xs: 20,
  sm: 10,
  style: {
    marginBottom: 16,
  },
}

const Config = ({ location, dispatch, config }) => {
  location.query = qs.parse(location.search)
  const { modalVisible, modalType, systemProperty } = config
  const { name, domain, description, mailServer, mailAccount, mailPassword } = systemProperty

  const modalProps = {
    item: systemProperty,
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
        <Row gutter={20}><Col {...ColProps}>名称：{name}</Col></Row>
        <Row gutter={20}><Col {...ColProps}>域名：{domain}</Col></Row>
        <Row gutter={20}><Col {...ColProps}>描述：</Col></Row>
        <Row gutter={20}><Col {...ColProps}>{description}</Col></Row>
      </Card>
      <Card title="系统信息" bordered extra={<Button type="primary" onClick={onSystemInfoSetting}>设置</Button>}>
        <Row gutter={20}><Col {...ColProps}>邮件服务器：{mailServer}</Col></Row>
        <Row gutter={20}><Col {...ColProps}>邮件账号：{mailAccount}</Col><Col>账号密码：{mailPassword}</Col></Row>
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
