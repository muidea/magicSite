import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ moduleDetail }) => {
  const { name } = moduleDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>模块</div>
        <div>{name}</div>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  moduleDetail: PropTypes.object,
}

export default connect(({ moduleDetail, loading }) => ({ moduleDetail, loading: loading.models.moduleDetail }))(Detail)
