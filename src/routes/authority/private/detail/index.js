import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Table, Divider } from 'antd'
import { DescriptionList, EditableTagGroup, Status } from 'components'

const { Description } = DescriptionList

const Detail = ({ groupDetail }) => {
  const { name, description, catalog, accountList } = groupDetail
  const catalogs = [catalog]

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => {
        return <Link to={`/authority/account/view/${record.id}`}>{text}</Link>
      },
    },
    {
      title: 'EMail',
      dataIndex: 'email',
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        return <Status value={record.status} />
      },
    },
  ]

  return (
    <div className="content-inner">
      <DescriptionList size="large" title="分组信息" style={{ marginBottom: 32 }}>
        <Description term="分组名">{name}</Description>
        <Description term="描述">{description}</Description>
        <Description term="父分组"><EditableTagGroup readOnly value={catalogs} /></Description>
      </DescriptionList>
      <Divider style={{ marginBottom: 32 }} />
      <div>
        <h3>成员列表</h3>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          dataSource={accountList}
          columns={columns}
          rowKey={record => record.id}
        />
      </div>
    </div>)
}

Detail.propTypes = { groupDetail: PropTypes.object }

export default connect(({ groupDetail, loading }) => ({ groupDetail, loading: loading.models.groupDetail }))(Detail)
