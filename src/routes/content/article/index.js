import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'

const Article = ({ location, dispatch, article, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, selectedRowKeys } = article
  const { pageSize } = pagination

  const listProps = {
    dataSource: list,
    loading: loading.effects['article/queryAllArticle'],
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
        type: 'article/deleteArticle',
        payload: id,
      })
    },
    onEditItem (id) {
      dispatch(routerRedux.push({
        pathname: `/content/article/edit/${id}`,
      }))
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'article/updateModelState',
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
        type: 'article/multiDeleteArticle',
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
