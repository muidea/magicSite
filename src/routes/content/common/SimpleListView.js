import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { Link } from 'dva/router'

function SimpleListView({ summaryList }) {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => {
        if (record.type === 'article') {
          return <Link to={`/content/article/view/${record.id}`}>{text}</Link>
        } else if (record.type === 'catalog') {
          return <Link to={`/content/catalog/view/${record.id}`}>{text}</Link>
        } else if (record.type === 'link') {
          return <Link to={`/content/link/view/${record.id}`}>{text}</Link>
        } else if (record.type === 'media') {
          return <Link to={`/content/media/view/${record.id}`}>{text}</Link>
        }
        return <span>{text}</span>
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
  ]

  return (
    <Table
      pagination={false}
      dataSource={summaryList}
      columns={columns}
      size="small"
      showHeader={false}
      rowKey={record => record.id + record.type}
    />
  )
}

SimpleListView.propTypes = {
  summaryList: PropTypes.array,
}

export default SimpleListView
