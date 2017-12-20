import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Tag } from 'antd'
import { Parser } from 'html-to-react'
import styles from './index.less'

const Detail = ({ articleDetail }) => {
  const { title, content, catalog, author, createdate } = articleDetail
  const catalogTags = []
  for (let val of catalog) {
    catalogTags.push(<Tag key={val.id}>{val.name}</Tag>)
  }

  let parser = new Parser()
  let reactElement = parser.parse(content)

  return (<div className="content-inner">
    <div className={styles.content}>
      <Row gutter={24}><Col>{title}</Col></Row>
      <Row gutter={24}>创建时间：{createdate} 分类：{catalogTags} 作者：{author.name}</Row>
      <Row gutter={24}>{reactElement}</Row>
    </div>
  </div>)
}

Detail.propTypes = {
  articleDetail: PropTypes.object,
}

export default connect(({ articleDetail }) => ({ articleDetail }))(Detail)
