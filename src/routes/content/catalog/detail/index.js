import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { DescriptionList, EditableTagGroup } from 'components'

const { Description } = DescriptionList

const Detail = ({ catalogDetail }) => {
  const { name, description, catalog, creater, createDate } = catalogDetail

  return (
    <div className="content-inner">
      <DescriptionList size="large" title="分类信息" style={{ marginBottom: 32 }}>
        <Description term="名称">{name}</Description>
        <Description term="父分类"><EditableTagGroup readOnly value={catalog} /></Description>
        <Description term="描述">{description}</Description>
        <Description term="创建时间">{createDate}</Description>
        <Description term="创建人">{creater.name}</Description>
      </DescriptionList>
    </div>)
}

Detail.propTypes = { catalogDetail: PropTypes.object }

export default connect(({ catalogDetail }) => ({ catalogDetail }))(Detail)
