import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tag } from 'antd'
import styles from './index.less'

const Detail = ({ mediaDetail }) => {
  const { name, url, description, catalog, createdate } = mediaDetail
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
