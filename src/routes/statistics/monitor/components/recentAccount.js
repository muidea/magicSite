import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from './recentAccount.less'

function RecentAccount({ data }) {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '注册时间',
      dataIndex: 'registerDate',
      render: text => new Date(text).format('yyyy-MM-dd'),
    }, {
      title: '最后登录时间',
      dataIndex: 'lastLoginDate',
      render: text => new Date(text).format('yyyy-MM-dd'),
    },
  ]
  return (
    <div className={styles.recentaccount}>
      <Table pagination={false} columns={columns} rowKey={(record, key) => key} dataSource={data.filter((item, key) => key < 5)} />
    </div>
  )
}

RecentAccount.propTypes = {
  data: PropTypes.array,
}

export default RecentAccount
