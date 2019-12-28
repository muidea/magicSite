import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Steps, Button } from 'antd'
import PrivateGroup from './PrivateGroup'
import PrivateList from './PrivateList'
import PrivateSummary from './PrivateSummary'

const Step = Steps.Step

export default class PrivateGroupSteps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0,
      currentStatus: 'process',
      privateGroup: {},
      privateList: [],
    }
  }

  onNextClick = () => {
    let currentStep = this.state.currentStep
    let state = 'process'
    if (!this.verifyStatus(currentStep)) {
      state = 'error'
    } else {
      currentStep += 1
    }

    this.setState({ currentStep, currentStatus: state })
  }

  onPrevClick = () => {
    const currentStep = this.state.currentStep - 1
    let state = 'process'
    if (!this.verifyStatus(currentStep)) {
      state = 'error'
    }

    this.setState({ currentStep, currentStatus: state })
  }

  onFinishClick =() => {
    if (this.props.modalProps.onOk) {
      const { privateGroup, privateList } = this.state
      this.props.modalProps.onOk({ ...privateGroup, privates: privateList })
    }
  }

  onPrivateGroupChange = (value) => {
    this.setState({ privateGroup: value })
  }

  onPrivateListChange =(value) => {
    this.setState({ privateList: value })
  }

  verifyStatus =(currentStep) => {
    let ok = false
    switch (currentStep) {
      case 0: {
        if (!this.state.privateGroup.name) {
          break
        }
        if (this.state.privateGroup.name === '') {
          break
        }
        ok = true
        break
      }
      case 1: {
        if (!this.state.privateList) {
          break
        }
        if (this.state.privateList.length === 0) {
          break
        }
        ok = true
        break
      }
      default: {
        break
      }
    }
    return ok
  }

  onInitPrivateList =() => {
    return this.props.initPrivateList
  }

  render() {
    const { currentStep, currentStatus, privateGroup, privateList } = this.state

    const modalOpts = {
      ...this.props.modalProps,
    }

    const steps = [{
      title: '权限组信息',
      content: <PrivateGroup value={privateGroup} onChange={this.onPrivateGroupChange} />,
    }, {
      title: '权限列表',
      content: <PrivateList value={privateList} onInitPrivateList={this.onInitPrivateList} onChange={this.onPrivateListChange} />,
    }, {
      title: '权限组总结',
      content: <PrivateSummary
        value={{ ...privateGroup, privates: privateList }}
      />,
    }]

    return (
      <Modal {...modalOpts} footer={null} >
        <Steps current={currentStep} status={currentStatus}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[currentStep].content}</div>
        <div className="steps-action">
          {
            currentStep < steps.length - 1
            && <Button type="primary" onClick={() => this.onNextClick()}>下一步</Button>
          }
          {
            currentStep === steps.length - 1
            && <Button type="primary" onClick={() => this.onFinishClick()}>保存</Button>
          }
          {
            currentStep > 0
            && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.onPrevClick()}>
              上一步
            </Button>
            )
          }
        </div>
      </Modal>
    )
  }
}

PrivateGroupSteps.propTypes = {
  modalProps: PropTypes.object,
  initPrivateList: PropTypes.array,
}
