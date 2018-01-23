import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Table, Modal } from 'antd'
import styles from './List.less'
import { DropOption } from '../../../components'

const confirm = Modal.confirm

const List = ({ onEditItem, onDeleteItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
    if (e.key === '2') {
      confirm({
        title: '确认删除分组?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    }, {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
    }, {
      title: '权限组',
      dataIndex: 'authgroup',
      key: 'authgroup',
      render: (text, record) => {
        return record.authgroup.name
      },
    }, {
      title: '所属模块',
      dataIndex: 'module',
      key: 'module',
      render: (text, record) => {
        return record.module.name
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
