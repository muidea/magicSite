import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { DescriptionList, EditableTagGroup, Status } from '../../../../components'

const { Description } = DescriptionList

const Detail = ({ aclDetail }) => {
  const { url, method, module, status, authGroup } = aclDetail

  return (
    <div className="content-inner">
      <DescriptionList size="large" title="ACL信息" style={{ marginBottom: 32 }}>
        <Description term="URL">{url}</Description>
        <Description term="Method">{method}</Description>
        <Description term="状态"><Status value={status} /></Description>
        <Description term="所属模块">{module.name}</Description>
        <Description term="权限组"><EditableTagGroup readOnly value={[authGroup]} /></Description>
      </DescriptionList>
    </div>)
}

Detail.propTypes = { aclDetail: PropTypes.object }

export default connect(({ aclDetail, loading }) => ({ aclDetail, loading: loading.models.aclDetail }))(Detail)
