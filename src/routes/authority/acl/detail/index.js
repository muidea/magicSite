import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Badge } from 'antd'
import { DescriptionList, EditableTagGroup } from '../../../../components'

const { Description } = DescriptionList

const statusMap = ['processing', 'warning']
const statusInfo = ['启用', '停用']

const Detail = ({ aclDetail }) => {
  const { url, method, module, status, authGroup } = aclDetail

  return (
    <div className="content-inner">
      <div>
        <DescriptionList size="large" title="ACL信息" style={{ marginBottom: 32 }}>
          <Description term="URL">{url}</Description>
          <Description term="Method">{method}</Description>
          <Description term="状态"><Badge status={statusMap[status]} text={statusInfo[status]} /></Description>
          <Description term="所属模块">{module.name}</Description>
          <Description term="权限组"><EditableTagGroup readOnly value={[authGroup]} /></Description>
        </DescriptionList>
      </div>
    </div>)
}

Detail.propTypes = { aclDetail: PropTypes.object }

export default connect(({ aclDetail, loading }) => ({ aclDetail, loading: loading.models.aclDetail }))(Detail)
