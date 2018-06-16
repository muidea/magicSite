import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Table, Modal } from 'antd'
import styles from './List.less'
import { DropOption, EditableTagGroup } from '../../../components'

const { confirm } = Modal

const List = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record.id)
    } else if (e.key === '2') {
      confirm({
        title: '确认删除当前记录?',
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/content/article/view/${record.id}`}>{text}</Link>,
    }, {
      title: '分类',
      dataIndex: 'catalog',
      key: 'catalog',
      render: (text, record) => {
        return <EditableTagGroup readOnly value={record.catalog} />
      },
    }, {
      title: '作者',
      dataIndex: 'creater',
      key: 'creater',
      render: (text, record) => <span>{record.creater.name}</span>,
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
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
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
