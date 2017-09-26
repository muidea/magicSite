import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Article = ({ location, dispatch, article, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = article
  const { pageSize } = pagination

  const nilArticle = {name:'',description:'',catalog:{}}

  const modalProps = {
    item: modalType === 'create' ? nilArticle : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['article/update'],
    title: `${modalType === 'create' ? '新建文章' : '编辑文章'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `article/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'article/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['article/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'article/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'article/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'article/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    selectedRowKeys,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        search: queryString.stringify({
          ...value,
          page: 1,
          pageSize,
        }),
      }))
    },
    onAdd () {
      dispatch(routerRedux.push({
        pathname: '/content/article/editor',
      }))
    },
    onDeleteItems () {
      dispatch({
        type: 'article/multiDelete',
        payload: {
          ids: selectedRowKeys,
        },
      })      
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

Article.propTypes = {
  article: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ article, loading }) => ({ article, loading }))(Article)
