import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tag } from 'antd'
import styles from './index.less'

const Detail = ({ linkDetail }) => {
  const { name, url, logo, catalog, createdate } = linkDetail
  const catalogTags = []
  for (let val of catalog) {
    catalogTags.push(<Tag key={val.id}>{val.name}</Tag>)
  }

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>名称</div>
        <div>{name}</div>
      </div>
      <div className={styles.item}>
        <div>{catalogTags}</div>
      </div>
      <div className={styles.item}>
        <div>URL</div>
        <div>{url}</div>
      </div>
      <div className={styles.item}>
        <div>Logo</div>
        <div>{logo}</div>
      </div>
      <div className={styles.item}>
        <div>创建时间</div>
        <div>{createdate}</div>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  linkDetail: PropTypes.object,
}

export default connect(({ linkDetail, loading }) => ({ linkDetail, loading: loading.models.linkDetail }))(Detail)
