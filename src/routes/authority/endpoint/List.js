import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { Table } from 'antd'
import styles from './List.less'
import { DropOption, EditableTagGroup } from '../../../components'

const List = ({ onEditItem, onDeleteItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
    if (e.key === '2') {
      onDeleteItem(record.id)
    }
  }

  const columns = [
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Link to={`/authority/module/view/${record.id}`}>{text}</Link>
      },
    }, {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => {
        return <EditableTagGroup readOnly value={record.user} />
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
