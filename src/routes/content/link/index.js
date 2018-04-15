import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Link = ({ location, dispatch, link, loading }) => {
  const { list, pagination, currentItem, selectedRowKeys, modalVisible, modalType } = link
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['link/update'],
    title: `${modalType === 'create' ? '新建链接' : '修改链接'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'link/saveLink',
        payload: { action: modalType, data: { id: currentItem.id, ...data } },
      })
    },
    onCancel () {
      dispatch({ type: 'link/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['link/query'],
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
    onDeleteItem (id) {
      dispatch({
        type: 'link/deleteLink',
        payload: id,
      })
    },
    onEditItem (id) {
      dispatch({
        type: 'link/updateLink',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'link/updateModelState',
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
        pathname: '/link',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({ pathname: '/link' }))
    },
    onAdd () {
      dispatch({
        type: 'link/showModal',
        payload: { modalType: 'create' },
      })
    },
    onDeleteItems () {
      dispatch({
        type: 'link/multiDeleteLink',
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

Link.propTypes = {
  link: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ link, loading }) => ({ link, loading }))(Link)
