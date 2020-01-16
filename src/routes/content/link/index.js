import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import qs from 'qs'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const Link = ({ location, dispatch, link, loading }) => {
  const { list, selectedRowKeys, pagination, currentItem, catalogTree, modalVisible, modalType } = link
  const { pageSize } = pagination

  const modalProps = {
    item: currentItem,
    catalogTree,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['link/submitLink'],
    title: `${modalType === 'create' ? '新建链接' : '修改链接'}`,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'link/submitLink',
        payload: { id: currentItem.id, ...data },
      })
    },
    onCancel() {
      dispatch({ type: 'link/cancelLink' })
    },
    onLoadData(id) {
      dispatch({ type: 'link/queryCatalogTree', payload: { namespace: 'link', catalog: id, loadData: true } })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['link/queryAllLink'],
    pagination,
    location,
    onChange(page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        search: qs.stringify({
          ...query,
          pageNum: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
    onUpdateItem(id) {
      dispatch({
        type: 'link/invokeUpdateLink',
        payload: id,
      })
    },

    onDeleteItem(id) {
      dispatch({
        type: 'link/deleteLink',
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

    onFilterChange(value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          pageNum: 1,
          pageSize,
        },
      }))
    },

    onSearch(fieldsValue) {
      if (fieldsValue.keyword.length) {
        dispatch(routerRedux.push({
          pathname: '/link',
          query: {
            field: fieldsValue.field,
            keyword: fieldsValue.keyword,
          },
        }))
      } else {
        dispatch(routerRedux.push({ pathname: '/link' }))
      }
    },

    onAdd() {
      dispatch({ type: 'link/invokeNewLink' })
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
