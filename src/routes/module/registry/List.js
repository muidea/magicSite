import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { Table } from 'antd'
import { Status } from 'components'
import styles from './List.less'

const List = ({ location, ...tableProps }) => {
  const columns = [
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Link to={`/module/registry/view/${record.id}`}>{text}</Link>
      },
    },
    {
      title: '模块描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render (record) {
        return <Status value={record} />
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

List.propTypes = { location: PropTypes.object }

export default List
