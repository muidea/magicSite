import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon } from 'antd'

const { Dragger } = Upload

export default class MultiUpload extends Component {
  state = {
    fileList: [],
  }

  handleChange = (info) => {
    let newFileList = []
    info.fileList.forEach((val) => {
      const existFlag = newFileList.some((v) => {
        return val.name === v.name && val.lastModified === v.lastModified && val.size === v.size
      })

      if (!existFlag) {
        if (this.props.multiple) {
          newFileList.push(val)
        } else {
          newFileList = [val]
        }
      }
    })

    if (info.file.status !== 'uploading') {
      const valList = []
      newFileList = newFileList.filter((val) => {
        if (val.response) {
          if (val.response.errorCode === 0) {
            const { file } = val.response
            valList.push({ name: file.fileName, fileToken: file.fileToken })
            return true
          }
        }

        return true
      })

      const { onChange, multiple } = this.props
      if (onChange) {
        if (multiple) {
          onChange(valList)
        } else if (valList.length > 0) {
          onChange(valList[0])
        }
      }
    }

    this.setState({ fileList: newFileList })
  }

  beforeUpload = (file) => {
    const { fileList } = this.state

    return !fileList.some((val) => {
      return val.name === file.name
    })
  }

  render() {
    const props = {
      name: 'file',
      multiple: false,
      action: this.props.serverUrl,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
    }

    return (
      <Dragger {...props} fileList={this.state.fileList}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">选择上传文件</p>
      </Dragger>
    )
  }
}

MultiUpload.propTypes = {
  onChange: PropTypes.func,
  serverUrl: PropTypes.string,
  multiple: PropTypes.bool,
}
