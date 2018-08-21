import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { Link } from 'dva/router'

function SummaryListView({ summaryList }) {
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
    {
      title: '创建人',
      dataIndex: 'creater',
      render: (text, record) => <span>{record.creater.name}</span>,
    },
    {
      title: '更新日期',
      dataIndex: 'createDate',
    },
  ]

  return (
    <Table
      style={{ marginBottom: 24 }}
      pagination={false}
      dataSource={summaryList}
      columns={columns}
      rowKey={record => record.id + record.type}
    />
  )
}

SummaryListView.propTypes = {
  summaryList: PropTypes.array,
}

export default SummaryListView
