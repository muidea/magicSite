import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Endpoint = ({ location, dispatch, endpoint, loading }) => {
  const { list, pagination, currentItem, userList, selectedRowKeys, modalVisible, modalType } = endpoint
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    userList,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['endpoint/update'],
    title: modalType === 'create' ? '新建Endpoint' : '更新Endpoint',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      modalType === 'create' ? dispatch({
        type: 'endpoint/createEndpoint',
        payload: { data: { ...data } },
      }) : dispatch({
        type: 'endpoint/updateEndpoint',
        payload: { data: { id: currentItem.id, ...data } },
      })
    },
    onCancel () {
      dispatch({ type: 'endpoint/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['endpoint/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onEditItem (item) {
      dispatch({ type: 'endpoint/showModal', payload: { currentItem: item, modalType: 'update' } })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'endpoint/updateModelState',
          payload: { selectedRowKeys: keys },
        })
      },
    },
  }

  const filterProps = {
    selectedRowKeys,
    filter: { ...location.query },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/endpoint',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({ pathname: '/endpoint' }))
    },
    onAddItem () {
      dispatch({ type: 'endpoint/showModal', payload: { currentItem, modalType: 'create' } })
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
  endpoint: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ endpoint, loading }) => ({ endpoint, loading }))(Endpoint)
