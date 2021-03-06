import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, Select, Radio } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

class Panel extends Component {
  constructor(props) {
    super(props)

    let currentEndpoint = {}
    if ('currentEndpoint' in props) {
      currentEndpoint = props.currentEndpoint
      if (currentEndpoint) {
        const { endpoint, status, privateGroup } = currentEndpoint
        let val = { endpoint }
        if (status) {
          val = { ...val, status: status.id.toString() }
        }
        if (privateGroup) {
          val = { ...val, privateGroup: privateGroup.id.toString() }
        }

        currentEndpoint = { ...val }
      }
    }

    let privateGroupList = []
    if ('privateGroupList' in props) {
      privateGroupList = props.privateGroupList
    }

    this.state = { currentEndpoint, privateGroupList }
  }

  state = {
    currentEndpoint: {},
    privateGroupList: [],
  }

  componentWillReceiveProps(nextProps) {
    let currentEndpoint = {}
    if ('currentEndpoint' in nextProps) {
      currentEndpoint = nextProps.currentEndpoint
      if (currentEndpoint) {
        const { endpoint, status, privateGroup } = currentEndpoint
        let val = { endpoint }
        if (status) {
          val = { ...val, status: status.id.toString() }
        }
        if (privateGroup) {
          val = { ...val, privateGroup: privateGroup.id.toString() }
        }

        currentEndpoint = { ...val }
      }
    }

    let privateGroupList = []
    if ('privateGroupList' in nextProps) {
      privateGroupList = nextProps.privateGroupList
    }

    this.setState({ currentEndpoint, privateGroupList })
  }

  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return
      }

      let data = { ...this.props.form.getFieldsValue() }
      const { privateGroup, status } = data
      const { id } = this.props.currentEndpoint

      data = { id, privateGroup: Number(privateGroup), status: Number(status) }
      this.props.onOk({ id, privateGroup: Number(privateGroup), status: Number(status) })
    })
  }

  render() {
    const { currentEndpoint, privateGroupList } = this.state
    const privateGroupOpts = []
    for (let idx = 0; idx < privateGroupList.length; idx += 1) {
      const val = privateGroupList[idx]
      privateGroupOpts.push(<Option key={val.id}>{val.name}</Option>)
    }

    return (<Modal {...this.props} onOk={this.handleOk} >
      <Form layout="horizontal">
        <FormItem label="终端" {...formItemLayout}>
          {this.props.form.getFieldDecorator('endpoint', {
            initialValue: currentEndpoint.endpoint,
            rules: [
              { required: true },
            ],
          })(<Input readOnly />)}
        </FormItem>
        <FormItem label="权限组" {...formItemLayout}>
          {this.props.form.getFieldDecorator('privateGroup', {
            rules: [
              { required: true, message: '请选择权限组' },
            ],
            initialValue: currentEndpoint.privateGroup,
          })(
            <Select
              mode="default"
              style={{ width: '100%' }}
              placeholder="请选择权限组"
            >
              {privateGroupOpts}
            </Select>,
          )}
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {this.props.form.getFieldDecorator('status', {
            rules: [
              { required: true, message: '请选择状态' },
            ],
            initialValue: currentEndpoint.status,
          })(
            <RadioGroup size="small">
              <RadioButton value="1">启用</RadioButton>
              <RadioButton value="2">停用</RadioButton>
            </RadioGroup>,
          )}
        </FormItem>
      </Form>
    </Modal>)
  }
}

Panel.propTypes = {
  currentEndpoint: PropTypes.object,
  privateGroupList: PropTypes.array,
  onOk: PropTypes.func,
}

export default Form.create()(Panel)
