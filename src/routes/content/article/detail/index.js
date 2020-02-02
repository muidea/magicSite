import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import { RichView, EditableTagGroup } from 'components'
import styles from './index.less'

const Detail = ({ articleDetail }) => {
  const { article } = articleDetail
  const { title, content, catalog, creater, createDate } = article

  return (
    <div className="content-inner">
      <Row>
        <Col span={18}>
          <div className={styles.content}>
            <Row gutter={24} type="flex" justify="center"><Col><h1>{title}</h1></Col></Row>
            <Row gutter={24} type="flex" justify="center"><span>作者：{creater.account.name}</span> 分类：<EditableTagGroup readOnly value={catalog} /> <span>创建时间：{createDate}</span></Row>
            <Row gutter={24}><RichView value={content} /> </Row>
          </div>
        </Col>
      </Row>
    </div>)
}

Detail.propTypes = {
  articleDetail: PropTypes.object,
}

export default connect(({ articleDetail }) => ({ articleDetail }))(Detail)
