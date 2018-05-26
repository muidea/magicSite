import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { DescriptionList, EditableTagGroup, RadioItemGroup } from '../../../../components'

const { Description } = DescriptionList

const Detail = ({ endpointDetail }) => {
  const { id, name, description, user, status, accessToken } = endpointDetail

  const statusItems = [
    { id: 0, name: '启用' },
    { id: 1, name: '停用' },
  ]

  return (
    <div className="content-inner">
      <div>
        <DescriptionList size="large" title="Endpoint信息" style={{ marginBottom: 32 }}>
          <Description term="ID">{id}</Description>
          <Description term="名称">{name}</Description>
          <Description term="描述">{description}</Description>
          <Description term="用户"><EditableTagGroup readOnly value={user} /></Description>
          <Description term="状态"><RadioItemGroup dataSource={statusItems} value={{ id: status }} disabled /></Description>
          <Description term="授权码">{accessToken}</Description>
        </DescriptionList>
      </div>
    </div>)
}

Detail.propTypes = { endpointDetail: PropTypes.object }

export default connect(({ endpointDetail, loading }) => ({ endpointDetail, loading: loading.models.endpointDetail }))(Detail)
