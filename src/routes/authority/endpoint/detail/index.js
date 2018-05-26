import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Divider } from 'antd'
import { DescriptionList, EditableTagGroup } from '../../../../components'
import styles from './index.less'

const { Description } = DescriptionList

const Detail = ({ endpointDetail }) => {
  const { name, description, type, status, userAuthGroup } = endpointDetail

  const authGroupColumns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '授权组',
      dataIndex: 'authGroup',
      key: 'id',
      render: (text, record) => {
        return <EditableTagGroup readOnly value={[record.authGroup]} />
      },
    },
  ]

  return (
    <div className="content-inner">
      <div>
        <DescriptionList size="large" title="模块信息" style={{ marginBottom: 32 }}>
          <Description term="模块名">{name}</Description>
          <Description term="类型">{type.toString()}</Description>
          <Description term="状态">{status.toString()}</Description>
          <Description term="描述">{description}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>授权组信息</div>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          dataSource={userAuthGroup}
          columns={authGroupColumns}
          rowKey="id"
        />
      </div>
    </div>)
}

Detail.propTypes = { endpointDetail: PropTypes.object }

export default connect(({ endpointDetail, loading }) => ({ endpointDetail, loading: loading.models.endpointDetail }))(Detail)
