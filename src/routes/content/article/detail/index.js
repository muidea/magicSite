import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ articleDetail }) => {
  const { data } = articleDetail
  const content = []

  console.log(data)
  for (let key in data) {
    if ({}.hasOwnProperty.call(data, key)) {
      content.push(<div key={key} className={styles.item}>
        <div>{key}</div>
        <div>{String(data[key])}</div>
      </div>)
    }
  }
  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}><div>ID</div><div>{data.id}</div></div>
      <div className={styles.item}><div>标题</div><div>{data.title}</div></div>
      <div className={styles.item}><div>内容</div><div>{data.content}</div></div>
      <div className={styles.item}><div>分类</div><div>{data.catalog}</div></div>
      <div className={styles.item}><div>新建时间</div><div>{data.createTime}</div></div>
    </div>
  </div>)
}

Detail.propTypes = {
  articleDetail: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ articleDetail, loading }) => ({ articleDetail, loading: loading.models.articleDetail }))(Detail)
