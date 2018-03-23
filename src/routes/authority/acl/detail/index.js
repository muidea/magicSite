import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ aclDetail }) => {
  const { url } = aclDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>账号</div>
        <div>{url}</div>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  aclDetail: PropTypes.object,
}

export default connect(({ aclDetail, loading }) => ({ aclDetail, loading: loading.models.aclDetail }))(Detail)
