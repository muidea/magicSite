import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ mediaDetail }) => {
  const { name, description, parent, author, createdate } = mediaDetail

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
  mediaDetail: PropTypes.object,
}

export default connect(({ mediaDetail, loading }) => ({ mediaDetail, loading: loading.models.mediaDetail }))(Detail)
