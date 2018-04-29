import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { DescriptionList, Status } from 'components'

const { Description } = DescriptionList

const Detail = ({ moduleDetail }) => {
  const { name, description, type, status } = moduleDetail

  return (
    <div className="content-inner">
      <div>
        <DescriptionList size="large" title="模块信息" style={{ marginBottom: 32 }}>
          <Description term="模块名">{name}</Description>
          <Description term="类型">{type.name}</Description>
          <Description term="状态"><Status value={status} /></Description>
          <Description term="描述">{description}</Description>
        </DescriptionList>
      </div>
    </div>)
}

Detail.propTypes = { moduleDetail: PropTypes.object }

export default connect(({ moduleDetail, loading }) => ({ moduleDetail, loading: loading.models.moduleDetail }))(Detail)
