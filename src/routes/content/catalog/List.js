import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import styles from './List.less'
import { DropOption, EditableTagGroup } from '../../../components'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record.id)
    } else if (e.key === '2') {
      confirm({
        title: '确认删除分类?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '分类名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Link to={`/content/catalog/view/${record.id}`}>{text}</Link>
      },
    }, {
      title: '父类',
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
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
