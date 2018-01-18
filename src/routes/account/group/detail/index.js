import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ groupDetail }) => {
  const { name, description, parent, author, createdate } = groupDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>名称</div>
        <div>{name}</div>
      </div>
      <div className={styles.item}>
        <div>描述</div>
        <div>{description}</div>
      </div>
      <div className={styles.item}>
        <div>创建时间</div>
        <div>{createdate}</div>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  groupDetail: PropTypes.object,
}

export default connect(({ groupDetail, loading }) => ({ groupDetail, loading: loading.models.groupDetail }))(Detail)
