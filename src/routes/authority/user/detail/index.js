import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Divider } from 'antd'
import { DescriptionList, EditableTagGroup } from '../../../../components'
import styles from './index.less'

const { Description } = DescriptionList

const Detail = ({ userDetail }) => {
  const { name, account, email, group, registerTime, moduleAuthGroup } = userDetail

  const authGroupColumns = [
    {
      title: '模块名称',
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
        <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
          <Description term="用户名">{name}</Description>
          <Description term="账号">{account}</Description>
          <Description term="EMail">{email}</Description>
          <Description term="所属分组"><EditableTagGroup readOnly value={group} /></Description>
          <Description term="注册时间">{registerTime}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>授权组信息</div>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          dataSource={moduleAuthGroup}
          columns={authGroupColumns}
          rowKey="id"
        />
      </div>
    </div>)
}

Detail.propTypes = { userDetail: PropTypes.object }

export default connect(({ userDetail, loading }) => ({ userDetail, loading: loading.models.userDetail }))(Detail)
