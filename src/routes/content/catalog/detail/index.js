import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Table, Divider } from 'antd'
import { DescriptionList, EditableTagGroup } from 'components'

const { Description } = DescriptionList

const Detail = ({ catalogDetail }) => {
  const { name, description, catalog, creater, createDate, summary } = catalogDetail

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
    <div className="content-inner">
      <DescriptionList size="large" title="分类信息" style={{ marginBottom: 32 }}>
        <Description term="名称">{name}</Description>
        <Description term="父分类"><EditableTagGroup readOnly value={catalog} /></Description>
        <Description term="描述">{description}</Description>
        <Description term="创建时间">{createDate}</Description>
        <Description term="创建人">{creater.name}</Description>
      </DescriptionList>
      <Divider style={{ marginBottom: 32 }} />
      <div>
        <h3>分类内容</h3>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          dataSource={summary}
          columns={columns}
          rowKey={record => record.id + record.type}
        />
      </div>
    </div>)
}

Detail.propTypes = { catalogDetail: PropTypes.object }

export default connect(({ catalogDetail }) => ({ catalogDetail }))(Detail)
