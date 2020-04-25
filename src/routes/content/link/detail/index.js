import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Button } from 'antd'
import { connect } from 'dva'
import styles from './index.less'
import { EditableTagGroup } from '../../../../components'

const Detail = ({ linkDetail }) => {
  const { name, url, logo, description, catalog, createDate, creater } = linkDetail

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
        <div>URL</div>
        <div>{url}</div>
      </div>
      <div className={styles.item}>
        <div>图标</div>
        <div>{logo}</div>
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
        <Link to={'/content/link/'} style={{ width: '100%' }}><Button type="dashed" style={{ width: '100%', marginBottom: 8 }} >返回</Button></Link>
      </div>
    </div>
  </div>)
}

Detail.propTypes = {
  linkDetail: PropTypes.object,
}

export default connect(({ linkDetail, loading }) => ({ linkDetail, loading: loading.models.linkDetail }))(Detail)
