import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Modal } from 'antd'
import { DropOption } from '../../../components'

const { confirm } = Modal

const List = ({ onDeleteItem, onUpdateItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onUpdateItem(record.id)
    } else if (e.key === '2') {
      confirm({
        title: '确认删除分类?',
        onOk() {
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
    }, {
      title: '父类',
      dataIndex: 'catalog',
      key: 'catalog',
      render: (text, record) => {
        let tag = { name: '-' }
        if (record.catalog) {
          tag = record.catalog
        }

        return <Tag> {tag.name} </Tag>
      },
    }, {
      title: '创建人',
      dataIndex: 'creater',
      key: 'creater',
      render: (text, record) => {
        return <span>{record.creater.account}</span>
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
  onUpdateItem: PropTypes.func,
}

export default List
