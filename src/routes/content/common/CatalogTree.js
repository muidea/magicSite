import React from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'

export default class CatalogTree extends React.Component {
  constructor(props) {
    super(props)

    let treeData = [
    ]

    if (props.treeData) {
      treeData = props.treeData
    }

    let value
    if (props.value) {
      if (props.multiple) {
        props.value.forEach((v) => {
          value.push(v.id)
        })
      } else {
        value = props.value.id
      }
    }

    this.state = {
      treeData,
      value,
    }
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state

    if (nextProps.value) {
      if (nextProps.multiple) {
        value = []
        nextProps.value.forEach((v) => {
          value.push(v.id)
        })
      } else {
        value = nextProps.value.id
      }
    }

    if (nextProps.treeData) {
      this.setState({ treeData: nextProps.treeData, value })
    }
  }

  onLoadData = treeNode =>
  new Promise((resolve) => {
    const { id } = treeNode.props
    if (this.props.onLoadData) {
      this.props.onLoadData(id)
    }

    resolve()
  })

  onChange = (value) => {
    this.setState({ value })

    if (this.props.multiple) {
      const vals = []
      value.forEach((v) => {
        vals.push({ id: Number(v) })
      })

      if (this.props.onChange) {
        this.props.onChange(vals)
      }
      return
    }

    if (value) {
      if (this.props.onChange) {
        this.props.onChange({ id: Number(value) })
      }
    } else if (this.props.onChange) {
      this.props.onChange({ })
    }
  }

  convertData = (tree) => {
    let ret = []

    if (tree instanceof Array) {
      tree.forEach(((val) => {
        ret = ret.concat(this.convertData(val))
      }))

      return ret
    }

    const { id, pid, name, subs, isLeaf } = tree
    let childs = []
    if (subs) {
      subs.forEach((sub) => {
        childs = childs.concat(this.convertData(sub))
      })
    }

    ret.push({ title: name, value: id.toString(), id, pId: pid, isLeaf })

    return ret.concat(childs)
  }

  render() {
    const { treeData } = this.state
    const treeVal = this.convertData(treeData)
    return (
      <TreeSelect
        allowClear
        treeDataSimpleMode
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择分类"
        onChange={this.onChange}
        loadData={this.onLoadData}
        treeData={treeVal}
        multiple={this.props.multiple}
      />
    )
  }
}

CatalogTree.propTypes = {
  treeData: PropTypes.array,
  onLoadData: PropTypes.func,
  multiple: PropTypes.bool,
}
