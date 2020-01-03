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

    this.state = {
      treeData,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.treeData) {
      this.setState({ treeData: nextProps.treeData })
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
        treeDataSimpleMode
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择分类"
        onChange={this.onChange}
        loadData={this.onLoadData}
        treeData={treeVal}
      />
    )
  }
}

CatalogTree.propTypes = {
  treeData: PropTypes.array,
  onLoadData: PropTypes.func,
}
