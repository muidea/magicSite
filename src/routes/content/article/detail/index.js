import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Tag } from 'antd'
import styles from './index.less'

const Detail = ({ articleDetail }) => {
  const { title, content, catalog, author, createdate } = articleDetail
  const catalogTags = []
  for (let val of catalog) {
    catalogTags.push(<Tag key={val.id}>{val.name}</Tag>)
  }

  return (<div className="content-inner">
    <div className={styles.content}>
      <Row gutter={24} type="flex" justify="center"><Col><h1>{title}</h1></Col></Row>
      <Row gutter={24} type="flex" justify="center"><span>作者：{author.name}</span> 分类：{catalogTags} <span>创建时间：{createdate}</span></Row>
      <Row gutter={24}>{content}</Row>
    </div>
  </div>)
}

Detail.propTypes = {
  articleDetail: PropTypes.object,
}

export default connect(({ articleDetail }) => ({ articleDetail }))(Detail)
