import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Steps, Button, Divider } from 'antd'
import { DescriptionList, AutoCompleteSelect, RadioItemGroup } from '../../../../components'
import styles from './index.less'

const { Step } = Steps
const { Description } = DescriptionList

const Edit = ({ dispatch, endpointEdit }) => {
  let currentInput = null

  const { currentStep, currentTempUserAuthGroup, userList, id, name, description, type, status, userAuthGroup } = endpointEdit
  const { user, authGroup } = currentTempUserAuthGroup

  const authGroupItems = [
    { id: 0, name: '访客组' },
    { id: 1, name: '用户组' },
    { id: 2, name: '维护组' },
  ]

  const onUserValueChange = (value) => {
    dispatch({
      type: 'endpointEdit/updateTempUserAuthGroupInfo',
      payload: { currentTempUserAuthGroup: { ...currentTempUserAuthGroup, user: value } },
    })
  }

  const onAuthGroupValueChange = (value) => {
    dispatch({
      type: 'endpointEdit/updateTempUserAuthGroupInfo',
      payload: { currentTempUserAuthGroup: { ...currentTempUserAuthGroup, authGroup: value } },
    })
  }

  const saveUserInputRef = (input) => {
    if (input !== null && input !== undefined) {
      if (user === null || user === undefined) {
        input.focus()
      }

      currentInput = input
    }
  }

  const saveAuthGroupInputRef = (input) => {
    if (input !== null && input !== undefined) {
      if (authGroup === null || authGroup === undefined) {
        input.focus()
      }

      currentInput = input
    }
  }

  const steps = [{
    title: '基本信息',
    content:
  <div>
    <DescriptionList size="large" title="模块信息" style={{ marginBottom: 32 }}>
      <Description term="模块名">{name}</Description>
      <Description term="类型">{type.toString()}</Description>
      <Description term="状态">{status.toString()}</Description>
      <Description term="描述">{description}</Description>
    </DescriptionList>
    <Divider style={{ marginBottom: 32 }} />
    <div>
      <h3>说明</h3>
      <h4>基本信息</h4>
      <p>介绍模块的基本信息，如名称、类型、当前状态、和描述信息</p>
    </div>
  </div>,
  }, {
    title: '选择用户',
    content:
  <div>
    <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
      <Description term="用户"><AutoCompleteSelect style={{ width: 200 }} dataSource={userList} ref={saveUserInputRef} onChange={onUserValueChange} value={user} /></Description>
    </DescriptionList>
    <Divider style={{ marginBottom: 32 }} />
    <div>
      <h3>说明</h3>
      <h4>选择用户</h4>
      <p>计划给模块分配授权组的用户，只能是系统中已经存在的，如果选择已经存在的用户，则会覆盖已经当前授权组。</p>
    </div>
  </div>,
    validator: () => {
      if (user === null || user === undefined) {
        return false
      }
      return true
    },
  }, {
    title: '选择授权组',
    content:
  <div>
    <DescriptionList size="large" title="授权组信息" style={{ marginBottom: 32 }}>
      <Description term="授权组"><RadioItemGroup dataSource={authGroupItems} ref={saveAuthGroupInputRef} onChange={onAuthGroupValueChange} value={authGroup} /></Description>
    </DescriptionList>
    <Divider style={{ marginBottom: 32 }} />
    <div>
      <h3>说明</h3>
      <h4>选择授权组</h4>
      <p>用户所在授权组，访客组只允许查看信息，用户组可以新增和更新信息，维护组可以新增，更新和删除信息。如果是核心系统模块，也要求用户必须属于维护组。</p>
    </div>
  </div>,
    validator: () => {
      if (authGroup === null || authGroup === undefined) {
        return false
      }
      return true
    },
  }, {
    title: '确认信息',
    content:
  <div>
    <DescriptionList size="large" title="待提交信息" style={{ marginBottom: 32 }}>
      <Description term="模块名">{name}</Description>
      <Description term="类型">{type.toString()}</Description>
      <Description term="状态">{status.toString()}</Description>
      <Description term="用户"><AutoCompleteSelect disabled style={{ width: 200 }} dataSource={userList} onChange={onUserValueChange} value={user} /></Description>
      <Description term="授权组"><RadioItemGroup disabled style={{ width: 400 }} dataSource={authGroupItems} onChange={onAuthGroupValueChange} value={authGroup} /></Description>
    </DescriptionList>
    <Divider style={{ marginBottom: 32 }} />
    <div>
      <h3>说明</h3>
      <h4>选择授权组</h4>
      <p>用户所在授权组，访客组只允许查看信息，用户组可以新增和更新信息，维护组可以新增，更新和删除信息。如果是核心系统模块，也要求用户必须属于维护组。</p>
    </div>
  </div>,
  }, {
    title: '完成',
    content: 'Finish',
  }]

  const nextStep = () => {
    let valueOk = true
    const { validator } = steps[currentStep]
    if (validator !== null && validator !== undefined) {
      valueOk = validator()
    }

    if (!valueOk) {
      if (currentInput !== null && currentInput !== undefined) {
        currentInput.focus()
      }
      return
    }

    if (currentInput !== null && currentInput !== undefined) {
      currentInput.blur()
    }

    const current = currentStep + 1
    dispatch({
      type: 'endpointEdit/moveToStep',
      payload: { currentStep: current },
    })
  }

  const prevStep = () => {
    const current = currentStep - 1
    dispatch({
      type: 'endpointEdit/moveToStep',
      payload: { currentStep: current },
    })
  }

  const completeStep = () => {
    const current = 0
    dispatch({
      type: 'endpointEdit/completeUserAuthGroup',
      payload: { currentTempUserAuthGroup, currentStep: current },
    })
  }

  const submitStep = () => {
    dispatch({
      type: 'endpointEdit/completeUserAuthGroup',
      payload: { currentTempUserAuthGroup, currentStep },
    })

    dispatch({
      type: 'endpointEdit/submitUserAuthGroup',
      payload: { userAuthGroup, id },
    })
  }

  const finishStep = () => {
    dispatch(routerRedux.push({ pathname: '/authority/endpoint' }))
  }

  return (
    <div className="content-inner">
      <Row>
        <Col span={22} offset={1}>
          <div>
            <Steps current={currentStep}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className={styles.stepsContent}>{steps[currentStep].content}</div>
            <div className={styles.stepsAction}>
              {
                  currentStep > 0 && currentStep < steps.length - 1
                  &&
                  <Button onClick={prevStep}>
                    上一步
                  </Button>
              }
              {
                currentStep < steps.length - 2
                &&
                <Button type="primary" style={{ marginLeft: 8 }} onClick={nextStep}>下一步</Button>
              }
              {
                currentStep === steps.length - 2
                &&
                <Button style={{ marginLeft: 8 }} onClick={completeStep}>继续添加</Button>
              }
              {
                currentStep === steps.length - 2
                &&
                <Button type="primary" style={{ marginLeft: 8 }} onClick={submitStep}>确认提交</Button>
              }
              {
                currentStep === steps.length - 1
                &&
                <Button type="primary" style={{ marginLeft: 8 }} onClick={finishStep}>完成</Button>
              }
            </div>
          </div>
        </Col>
      </Row>
    </div>)
}

Edit.propTypes = {
  dispatch: PropTypes.func,
  endpointEdit: PropTypes.object,
}

export default connect(({ endpointEdit, loading }) => ({ endpointEdit, loading: loading.models.endpointEdit }))(Edit)
