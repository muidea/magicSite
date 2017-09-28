import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'

const Article = ({ location, dispatch, article, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = article
  const { pageSize } = pagination

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
      let editURL = '/content/article/edit/' + item.id
      dispatch(routerRedux.push({
        pathname: editURL,
      }))      
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
      console.log(value)
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
        pathname: '/content/article/add',
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
