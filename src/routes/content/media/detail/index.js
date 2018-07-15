import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button } from 'antd'
import { DescriptionList, EditableTagGroup } from 'components'

const { Description } = DescriptionList

const Detail = ({ mediaDetail }) => {
  const { name, description, catalog, createDate, creater, fileUrl } = mediaDetail

  return (<div className="content-inner">
    <DescriptionList size="large" title="文件信息" style={{ marginBottom: 32 }}>
      <Description term="文件名">{name}</Description>
      <Description term="描述">{description}</Description>
      <Description term="分组"><EditableTagGroup readOnly value={catalog} /></Description>
      <Description term="上传时间">{createDate}</Description>
      <Description term="上传者">{creater.name}</Description>
      <Description term="下载文件"><Button style={{ border: 0 }} size="large" icon="download" target="_blank" href={fileUrl} /></Description>
    </DescriptionList>
  </div>)
}

Detail.propTypes = {
  mediaDetail: PropTypes.object,
}

export default connect(({ mediaDetail, loading }) => ({ mediaDetail, loading: loading.models.mediaDetail }))(Detail)
