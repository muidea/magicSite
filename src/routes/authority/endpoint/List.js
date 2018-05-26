import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import styles from './List.less'
import { DropOption, EditableTagGroup } from '../../../components'

const { confirm } = Modal

const List = ({ onEditItem, onDeleteItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
    if (e.key === '2') {
      confirm({
        title: '确认删除?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '终端名称',
      dataIndex: 'name',
      key: 'name',
      width: 20,
      render: (text, record) => {
        return <Link to={`/authority/endpoint/view/${record.id}`}>{text}</Link>
      },
    }, {
      title: '用户列表',
      dataIndex: 'user',
      key: 'user',
      width: 70,
      render: (text, record) => {
        return <EditableTagGroup readOnly value={record.user} />
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 10,
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
        scroll={{ x: '100%' }}
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
