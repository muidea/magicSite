import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { connect } from 'dva'
import { Button } from 'antd'
import styles from './index.less'
import { EditableTagGroup } from '../../../../components'

const Detail = ({ mediaDetail }) => {
  const { name, fileUrl, expiration, description, catalog, createDate, creater } = mediaDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>名称</div>
        <div>{name}</div>
      </div>
      <div className={styles.item}>
        <div>分类</div>
        <div><EditableTagGroup readOnly value={catalog} /></div>
      </div>
      <div className={styles.item}>
        <div>描述</div>
        <div>{description}</div>
      </div>
      <div className={styles.item}>
        <div>创建时间</div>
        <div>{createDate}</div>
      </div>
      <div className={styles.item}>
        <div>创建人</div>
        <div>{creater.name}</div>
      </div>
      <div className={styles.item}>
        <div>有效期(天)</div>
        <div>{expiration}</div>
      </div>
      <div className={styles.item}>
        <div>下载文件</div>
        <div><Button style={{ border: 0 }} size="large" icon="download" target="_blank" href={fileUrl} /></div>
      </div>
      <div className={styles.item}>
        <Link to={'/content/media/'} style={{ width: '100%' }}><Button type="dashed" style={{ width: '100%', marginBottom: 8 }} >返回</Button></Link>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  mediaDetail: PropTypes.object,
}

export default connect(({ mediaDetail, loading }) => ({ mediaDetail, loading: loading.models.mediaDetail }))(Detail)
