import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import { RichView, EditableTagGroup } from 'components'
import styles from './index.less'

const Detail = ({ articleDetail }) => {
  const {
    name, content, catalog, creater, createDate,
  } = articleDetail

  return (
    <div className="content-inner">
      <div className={styles.content}>
        <Row gutter={24} type="flex" justify="center"><Col><h1>{name}</h1></Col></Row>
        <Row gutter={24} type="flex" justify="center"><span>作者：{creater.name}</span> 分类：<EditableTagGroup readOnly value={catalog} /> <span>创建时间：{createDate}</span></Row>
        <Row gutter={24}><RichView value={content} /> </Row>
      </div>
    </div>)
}

Detail.propTypes = {
  articleDetail: PropTypes.object,
}

export default connect(({ articleDetail }) => ({ articleDetail }))(Detail)
