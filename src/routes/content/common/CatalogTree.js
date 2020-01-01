import React from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'

export default class CatalogTree extends React.Component {
  constructor(props) {
    super(props)

    let treeData = [
      { id: 1, pId: 0, value: '1', title: 'Expand to load' },
      { id: 2, pId: 0, value: '2', title: 'Expand to load' },
      { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
    ]

    if (props.value) {
      treeData = props.value
    }

    this.state = {
      treeData,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ treeData: nextProps.value })
    }
  }

  onGenTreeNode = (parentId, isLeaf = false) => {
    const random = Math.random()
      .toString(36)
      .substring(2, 6)
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
    }
  }

  onLoadData = treeNode =>
  new Promise((resolve) => {
    const { id } = treeNode.props
    setTimeout(() => {
      this.setState({
        treeData: this.state.treeData.concat([
          this.onGenTreeNode(id, false),
          this.onGenTreeNode(id, true),
        ]),
      })
      resolve()
    }, 300)
  })

  onChange = (value) => {
    this.setState({ value })
  }

  render() {
    const { treeData } = this.state
    return (
      <TreeSelect
        treeDataSimpleMode
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择分类"
        onChange={this.onChange}
        loadData={this.onLoadData}
        treeData={treeData}
      />
    )
  }
}

CatalogTree.propTypes = {
  value: PropTypes.object,
}
