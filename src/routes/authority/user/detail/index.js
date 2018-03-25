import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card } from 'antd'
import styles from './index.less'

const Detail = ({ userDetail }) => {
  const { name, moduleAuthGroup } = userDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        {name}
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  userDetail: PropTypes.object,
}

export default connect(({ userDetail, loading }) => ({ userDetail, loading: loading.models.userDetail }))(Detail)
