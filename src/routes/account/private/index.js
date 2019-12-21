import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Private = ({ location, dispatch, privateGroup, loading }) => {
  const { list, selectedRowKeys, pagination, currentItem, modalVisible, modalType } = privateGroup
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    privateList: modalType === 'create' ? list : list.filter(item => item.id < currentItem.id),
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['private/update'],
    title: `${modalType === 'create' ? '新建分组' : '修改分组'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'privateGroup/savePrivate',
        payload: { action: modalType, data: { id: currentItem.id, ...data } },
      })
    },
    onCancel() {
      dispatch({ type: 'privateGroup/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['privateGroup/queryAllPrivate'],
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
        type: 'privateGroup/deletePrivate',
        payload: id,
      })
    },
    onEditItem(id) {
      dispatch({
        type: 'privateGroup/updatePrivate',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'privateGroup/updateModelState',
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
      if (fieldsValue.keyword.length > 0) {
        dispatch(routerRedux.push({
          pathname: '/private',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/private' }))
      }
    },
    onAdd() {
      dispatch({
        type: 'privateGroup/showModal',
        payload: { modalType: 'create' },
      })
    },
    onDeleteItems() {
      dispatch({
        type: 'privateGroup/multiDeletePrivate',
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

Private.propTypes = {
  privateGroup: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ privateGroup, loading }) => ({ privateGroup, loading }))(Private)
