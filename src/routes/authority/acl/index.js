import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Acl = ({ location, dispatch, acl, loading }) => {
  const { list, pagination, selectedRowKeys, currentItem, modalVisible, modalType } = acl
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['acl/update'],
    title: `${modalType === 'create' ? '新建ACL' : '修改ACL'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `acl/${modalType}Acl`,
        payload: { id: currentItem.id, ...data },
      })
    },
    onCancel () {
      dispatch({ type: 'acl/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['acl/query'],
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
        type: 'acl/deleteAcl',
        payload: id,
      })
    },
    onEditItem (id) {
      dispatch({
        type: 'acl/updateAcl',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'acl/updateModelState',
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
        pathname: '/acl',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({ pathname: '/acl' }))
    },
    onAdd () {
      dispatch({
        type: 'acl/showModal',
        payload: { modalType: 'create' },
      })
    },
    onDeleteItems () {
      dispatch({
        type: 'acl/multiDeleteACL',
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

Acl.propTypes = {
  acl: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ acl, loading }) => ({ acl, loading }))(Acl)
