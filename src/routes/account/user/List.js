import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import styles from './List.less'
import { DropOption, EditableTagGroup } from '../../../components'

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
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      render: (text, record) => {
        return <EditableTagGroup readOnly value={record.group} />
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
        className={classnames({ [styles.table]: true })}
        bordered
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
