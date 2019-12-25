import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Table, Modal, Tag } from 'antd'
import { DropOption, Status } from '../../../components'

const { confirm } = Modal

const List = ({ onDeleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '2') {
      confirm({
        title: '确认删除用户?',
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
      render: (text, record) => {
        return <Link to={`/account/user/view/${record.id}`}>{text}</Link>
      },
    }, {
      title: '权限组',
      dataIndex: 'privateGroup',
      key: 'privateGroup',
      render: (text, record) => {
        return <Tag> {record.privateGroup.name} </Tag>
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return <Status value={record.status} />
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '2', name: '删除' }]} />
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
  onDeleteItem: PropTypes.func,
}

export default List
