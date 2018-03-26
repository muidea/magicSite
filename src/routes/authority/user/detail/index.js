import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table } from 'antd'
import styles from './index.less'

const Detail = ({ userDetail }) => {
  const { name, moduleAuthGroup } = userDetail

  const columns = [{
    title: '模块',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '授权组',
    dataIndex: 'authGroup',
    key: 'authGroup',
    render: (text, record) => {
      const { authGroup } = record
      const { description } = authGroup
      return <p>{ description }</p>
    },
  }]

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        {name}
      </div>
      <Table pagination={false} columns={columns} dataSource={moduleAuthGroup} />
    </div>
  </div>)
}

Detail.propTypes = {
  userDetail: PropTypes.object,
}

export default connect(({ userDetail, loading }) => ({ userDetail, loading: loading.models.userDetail }))(Detail)
