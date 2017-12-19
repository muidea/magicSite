import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Tag } from 'antd'
import styles from './index.less'

const Detail = ({ articleDetail }) => {
  const { title, content, catalog, author, createdate } = articleDetail
  const catalogTags = []
  for (let val of catalog) {
    catalogTags.push(<Tag key={val.id}>{val.name}</Tag>)
  }
  const contentView = <div>{content}</div>
  return (<div className="content-inner">
    <div className={styles.content}>
      <Row gutter={24}><div>{title}</div></Row>
      <Row gutter={24}><div>{createdate}</div><div>{catalogTags}</div><div>{author.name}</div></Row>
      <Row gutter={24}>{contentView}</Row>
    </div>
  </div>)
}

Detail.propTypes = {
  articleDetail: PropTypes.object,
}

export default connect(({ articleDetail }) => ({ articleDetail }))(Detail)
