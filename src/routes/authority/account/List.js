import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption, Status } from '../../../components'

const { confirm } = Modal

const List = ({ onUpdateItem, onDeleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onUpdateItem(record.id)
    }

    if (e.key === '2') {
      confirm({
        title: '确认删除账号?',
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    }, {
      title: '权限组',
      dataIndex: 'privateGroup',
      key: 'privateGroup',
      render: (text, record) => {
        let tag = { name: '-' }
        if (record.privateGroup) {
          tag = record.privateGroup
        }

        return <Tag> {tag.name} </Tag>
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return <Status value={record.status} />
      },
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '更新' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        scroll={{ x: '100%' }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onUpdateItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
}

export default List
