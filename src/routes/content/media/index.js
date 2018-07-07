import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Media = ({ location, dispatch, media, loading }) => {
  const { list, pagination, currentItem, selectedRowKeys, modalVisible } = media
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['media/update'],
    title: '新增文件',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'media/saveMedia',
        payload: { data: { id: currentItem.id, ...data } },
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
          page: page.current,
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
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch(fieldsValue) {
      if (fieldsValue.keyword.length) {
        dispatch(routerRedux.push({
          pathname: '/media',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/media' }))
      }
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
