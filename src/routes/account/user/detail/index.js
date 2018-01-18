import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ userDetail }) => {
  const { account, password, nickName, email, group } = userDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>账号</div>
        <div>{account}</div>
      </div>
      <div className={styles.item}>
        <div>昵称</div>
        <div>{nickName}</div>
      </div>
      <div className={styles.item}>
        <div>EMail</div>
        <div>{email}</div>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  userDetail: PropTypes.object,
}

export default connect(({ userDetail, loading }) => ({ userDetail, loading: loading.models.userDetail }))(Detail)
