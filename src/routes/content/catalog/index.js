import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Catalog = ({ location, dispatch, catalog, loading }) => {
  const { list, pagination, currentItem, selectedRowKeys, modalVisible, modalType } = catalog
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    catalogList: modalType === 'create' ? list : list.filter(item => item.id < currentItem.id),
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['catalog/update'],
    title: `${modalType === 'create' ? '新建分类' : '修改分类'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'catalog/saveCatalog',
        payload: { action: modalType, data: { id: currentItem.id, ...data } },
      })
    },
    onCancel() {
      dispatch({ type: 'catalog/hideModal' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['catalog/query'],
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
        type: 'catalog/deleteCatalog',
        payload: id,
      })
    },
    onEditItem(id) {
      dispatch({
        type: 'catalog/updateCatalog',
        payload: id,
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'catalog/updateModelState',
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
          pathname: '/catalog',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/catalog' }))
      }
    },
    onAdd() {
      dispatch({
        type: 'catalog/showModal',
        payload: { modalType: 'create' },
      })
    },
    onDeleteItems() {
      dispatch({
        type: 'catalog/multiDeleteCatalog',
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

Catalog.propTypes = {
  catalog: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ catalog, loading }) => ({ catalog, loading }))(Catalog)
