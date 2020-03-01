import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import Panel from './Panel'

const Endpoint = ({ location, dispatch, endpoint, loading }) => {
  const { list, selectedRowKeys, pagination, currentItem, privateGroupList, modalVisible, panelVisible } = endpoint
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    privateGroupList,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['endpoint/submitEndpoint'],
    title: '新建终端',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'endpoint/submitEndpoint',
        payload: { id: currentItem.id, ...data },
      })
    },
    onCancel() {
      dispatch({ type: 'endpoint/cancelEndpoint' })
    },
  }

  const panelProps = {
    visible: panelVisible,
    maskClosable: false,
    confirmLoading: loading.effects['endpoint/submitEndpoint'],
    title: '更新终端',
    wrapClassName: 'vertical-center-modal',
    currentEndpoint: currentItem,
    privateGroupList,
    onOk(data) {
      dispatch({
        type: 'endpoint/submitEndpoint',
        payload: { ...data },
      })
    },
    onCancel() {
      dispatch({ type: 'endpoint/cancelEndpoint' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['endpoint/queryAllEndpoint'],
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
        type: 'endpoint/invokeUpdateEndpoint',
        payload: id,
      })
    },

    onDeleteItem(id) {
      dispatch({
        type: 'endpoint/deleteEndpoint',
        payload: id,
      })
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
          pathname: '/endpoint',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/endpoint' }))
      }
    },

    onAdd() {
      dispatch({ type: 'endpoint/invokeNewEndpoint' })
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

Endpoint.propTypes = {
  endpoint: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ endpoint, loading }) => ({ endpoint, loading }))(Endpoint)
