import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ aclDetail }) => {
  const { url, method, module, authGroup, status } = aclDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>URL</div>
        <div>{url}</div>
      </div>
      <div className={styles.item}>
        <div>Method</div>
        <div>{method}</div>
      </div>
      <div className={styles.item}>
        <div>所属模块</div>
        <div>{module.name}</div>
      </div>
      <div className={styles.item}>
        <div>授权组</div>
        <div>{authGroup.name}</div>
      </div>
      <div className={styles.item}>
        <div>状态</div>
        <div>{status}</div>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  aclDetail: PropTypes.object,
}

export default connect(({ aclDetail, loading }) => ({ aclDetail, loading: loading.models.aclDetail }))(Detail)
