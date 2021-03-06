import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Row, Col, Button } from 'antd'
import { RichView, EditableTagGroup } from 'components'
import styles from './index.less'

const Detail = ({ articleDetail }) => {
  const { article } = articleDetail
  const { title, content, catalog, creater, createDate } = article

  return (
    <div className="content-inner">
      <Row>
        <Col>
          <div className={styles.content}>
            <Row gutter={24} type="flex" justify="center"><Col><h1>{title}</h1></Col></Row>
            <Row gutter={24} type="flex" justify="center"><span>作者：{creater.name}</span> 分类：<EditableTagGroup readOnly value={catalog} /> <span>创建时间：{createDate}</span></Row>
            <Row gutter={24}><RichView value={content} /> </Row>
          </div>
          <div className={styles.item}>
            <Link to={'/content/article/'} style={{ width: '100%' }}><Button type="dashed" style={{ width: '100%', marginBottom: 8 }} >返回</Button></Link>
          </div>
        </Col>
      </Row>
    </div>)
}

Detail.propTypes = {
  articleDetail: PropTypes.object,
}

export default connect(({ articleDetail }) => ({ articleDetail }))(Detail)
