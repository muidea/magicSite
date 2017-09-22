import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { DropOption } from '../../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
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
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 64,
      className: styles.avatar,
      render: (text) => <img alt={'avatar'} width={24} src={text} />,
    }, {
      title: '分组名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/account/group/${record.id}`}>{text}</Link>,
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '分类',
      dataIndex: 'catalog',
      key: 'catalog',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return body }

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
        getBodyWrapper={getBodyWrapper}
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
