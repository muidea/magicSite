import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import { DropOption, EditableTagGroup } from '../../../components'

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
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Link to={`/content/link/view/${record.id}`}>{text}</Link>
      },
    }, {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    }, {
      title: '图标',
      dataIndex: 'logo',
      key: 'logo',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '分类',
      dataIndex: 'catalog',
      key: 'catalog',
      render: (text, record) => {
        return <EditableTagGroup readOnly value={record.catalog} />
      },
    }, {
      title: '创建人',
      dataIndex: 'creater',
      key: 'creater',
      render: (text, record) => {
        return <span>{record.creater.name}</span>
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
  location: PropTypes.object,
}

export default List
