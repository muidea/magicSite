import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const User = ({ location, dispatch, user, loading }) => {
  const { list, selectedRowKeys, pagination, currentItem, groupList, modalTitle, modalVisible } = user
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    groupList,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['user/update'],
    title: modalTitle,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'user/submitUser',
        payload: { id: currentItem.id, ...data },
      })
    },
    onCancel() {
      dispatch({ type: 'user/cancelUser' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['user/queryAllUser'],
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
    onUpdateItem(id) {
      dispatch({
        type: 'user/invokeUpdateUser',
        payload: id,
      })
    },

    onDeleteItem(id) {
      dispatch({
        type: 'user/deleteUser',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'user/updateModelState',
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
          pathname: '/user',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/user' }))
      }
    },

    onAdd() {
      dispatch({ type: 'user/invokeNewUser' })
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

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ user, loading }) => ({ user, loading }))(User)
