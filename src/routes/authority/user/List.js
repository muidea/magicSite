import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { Table } from 'antd'
import styles from './List.less'
import { DropOption, EditableTagGroup } from '../../../components'

const List = ({ onEditItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
  }

  const columns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Link to={`/authority/user/view/${record.id}`}>{text}</Link>
      },
    }, {
      title: '模块列表',
      dataIndex: 'module',
      key: 'module',
      render: (text, record) => {
        return <EditableTagGroup readOnly value={record.module} />
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }]} />
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
  location: PropTypes.object,
}

export default List