import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Endpoint = ({ location, dispatch, registry, loading }) => {
  const { list, pagination, currentItem, userList, selectedRowKeys, modalVisible, modalType } = registry
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    userList,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['registry/update'],
    title: modalType === 'create' ? '新建Endpoint' : '更新Endpoint',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      if (modalType === 'create') {
        dispatch({
          type: 'registry/createEndpoint',
          payload: { data: { ...data } },
        })
      } else {
        dispatch({
          type: 'registry/updateEndpoint',
          payload: { data: { id: currentItem.id, ...data } },
        })
      }
    },
    onCancel() {
      dispatch({ type: 'registry/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['registry/query'],
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
    onEditItem(item) {
      dispatch({ type: 'registry/showModal', payload: { currentItem: item, modalType: 'update' } })
    },
    onDeleteItem(id) {
      dispatch({ type: 'registry/deleteEndpoint', payload: { id } })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'registry/updateModelState',
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
          pathname: '/registry',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/registry' }))
      }
    },
    onAddItem() {
      dispatch({ type: 'registry/showModal', payload: { currentItem, modalType: 'create' } })
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

Endpoint.propTypes = {
  registry: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ registry, loading }) => ({ registry, loading }))(Endpoint)
