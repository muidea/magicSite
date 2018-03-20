import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { EditableTagGroup } from '../../../../components'

const Detail = ({ catalogDetail }) => {
  const { name, description, catalog, creater, createDate } = catalogDetail

  return (<div className="content-inner">
    <div className={styles.content}>
      <div className={styles.item}>
        <div>名称</div>
        <div>{name}</div>
      </div>
      <div className={styles.item}>
        <div>父分类</div>
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
    </div>
  </div>)
}

Detail.propTypes = {
  catalogDetail: PropTypes.object,
}

export default connect(({ catalogDetail, loading }) => ({ catalogDetail, loading: loading.models.catalogDetail }))(Detail)
