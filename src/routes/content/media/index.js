import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Media = ({ location, dispatch, media, loading }) => {
  location.query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const { list, pagination, fileRegistryUrl, selectedRowKeys, modalVisible } = media
  const { pageSize } = pagination

  const modalProps = {
    serverUrl: fileRegistryUrl,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['media/update'],
    title: '新增文件',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'media/saveMedia',
        payload: { data: { ...data } },
      })
    },
    onCancel() {
      dispatch({ type: 'media/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['media/query'],
    pagination,
    location,
    onChange(page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        search: qs.stringify({
          ...query,
          pageNum: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
    onDeleteItem(id) {
      dispatch({
        type: 'media/deleteMedia',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'media/updateModelState',
          payload: { selectedRowKeys: keys },
        })
      },
    },
  }

  const filterProps = {
    selectedRowKeys,
    filter: { ...location.query },
    onFilterChange(value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        search: qs.stringify({
          ...value,
          pageSize,
        }),
      }))
    },
    onAdd() {
      dispatch({ type: 'media/showModal' })
    },
    onDeleteItems() {
      dispatch({
        type: 'media/multiDeleteMedia',
        payload: { ids: selectedRowKeys },
      })
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Media.propTypes = {
  media: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ media, loading }) => ({ media, loading }))(Media)
