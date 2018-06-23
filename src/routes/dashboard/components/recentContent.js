import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import styles from './recentContent.less'

function RecentContent({ data }) {
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
    }, {
      title: '类型',
      dataIndex: 'type',
      render: text => <Tag >{text}</Tag>,
    }, {
      title: '更新时间',
      dataIndex: 'createDate',
      render: text => new Date(text).format('yyyy-MM-dd'),
    },
  ]
  return (
    <div className={styles.recentcontent}>
      <Table pagination={false} columns={columns} rowKey={(record, key) => key} dataSource={data.filter((item, key) => key < 5)} />
    </div>
  )
}

RecentContent.propTypes = {
  data: PropTypes.array,
}

export default RecentContent
