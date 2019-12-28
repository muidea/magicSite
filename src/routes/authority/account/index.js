import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import Panel from './Panel'

const Account = ({ location, dispatch, account, loading }) => {
  const { list, selectedRowKeys, pagination, currentItem, privateGroupList, modalVisible, panelVisible } = account
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    privateGroupList,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['account/submitAccount'],
    title: '新建账号',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'account/submitAccount',
        payload: { id: currentItem.id, ...data },
      })
    },
    onCancel() {
      dispatch({ type: 'account/cancelAccount' })
    },
  }

  const panelProps = {
    visible: panelVisible,
    maskClosable: false,
    confirmLoading: loading.effects['account/submitAccount'],
    title: '更新账号',
    wrapClassName: 'vertical-center-modal',
    currentAccount: currentItem,
    privateGroupList,
    onOk(data) {
      dispatch({
        type: 'account/submitAccount',
        payload: { ...data },
      })
    },
    onCancel() {
      dispatch({ type: 'account/cancelAccount' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['account/queryAllAccount'],
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
        type: 'account/invokeUpdateAccount',
        payload: id,
      })
    },

    onDeleteItem(id) {
      dispatch({
        type: 'account/deleteAccount',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'account/updateModelState',
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
          pathname: '/account',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/account' }))
      }
    },

    onAdd() {
      dispatch({ type: 'account/invokeNewAccount' })
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
      {panelVisible && <Panel {...panelProps} />}
    </div>
  )
}

Account.propTypes = {
  account: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ account, loading }) => ({ account, loading }))(Account)
