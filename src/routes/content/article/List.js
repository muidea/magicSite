import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Table, Modal } from 'antd'
import styles from './List.less'
import { DropOption } from '../../../components'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record.id)
    } else if (e.key === '2') {
      confirm({
        title: '确认删除当前记录?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <Link to={`/content/article/view/${record.id}`}>{text}</Link>,
    }, {
      title: '分类',
      dataIndex: 'catalog',
      key: 'catalog',
      render: (text, record) => {
        let catalogVal = ''
        for (let item of record.catalog) {
          catalogVal += item.name
          catalogVal += ', '
        }

        return <span>{catalogVal}</span>
      },
    }, {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (text, record) => <span>{record.author.name}</span>,
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
