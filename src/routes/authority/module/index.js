import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Module = ({ location, dispatch, module, loading }) => {
  const { list, pagination, currentItem, selectedRowKeys, modalVisible } = module
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['module/update'],
    title: '更新用户信息',
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'module/saveModule',
        payload: { data: { id: currentItem.id, ...data } },
      })
    },
    onCancel () {
      dispatch({ type: 'module/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['module/query'],
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
    onEditItemAuthGroup (id) {
      dispatch({
        type: 'module/updateModuleAuthGroup',
        payload: id,
      })
    },
    onAddItemAuthGroup (id) {
      dispatch(routerRedux.push({ pathname: `/authority/module/edit/${id}` }))
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'module/updateModelState',
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
        pathname: '/module',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({ pathname: '/module' }))
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

Module.propTypes = {
  module: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ module, loading }) => ({ module, loading }))(Module)
