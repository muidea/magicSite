import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { EditableTagGroup } from '../../../../components'

const Detail = ({ userDetail }) => {
  const { account, name, email, group, registerTime, status } = userDetail

  return (
    <div className="content-inner">
      <div className={styles.content}>
        <div className={styles.item}>
          <div>账号</div>
          <div>{account}</div>
        </div>
        <div className={styles.item}>
          <div>名称</div>
          <div>{name}</div>
        </div>
        <div className={styles.item}>
          <div>EMail</div>
          <div>{email}</div>
        </div>
        <div className={styles.item}>
          <div>所属分组</div>
          <div><EditableTagGroup readOnly value={group} /></div>
        </div>
        <div className={styles.item}>
          <div>注册时间</div>
          <div>{registerTime}</div>
        </div>
        <div className={styles.item}>
          <div>状态</div>
          <div>{status}</div>
        </div>
      </div>
    </div>)
}

Detail.propTypes = { userDetail: PropTypes.object }

export default connect(({ userDetail, loading }) => ({ userDetail, loading: loading.models.userDetail }))(Detail)
