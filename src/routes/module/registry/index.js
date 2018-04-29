import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'

const ModuleRegistry = ({ location, dispatch, moduleRegistry, loading }) => {
  const { list, pagination, selectedRowKeys } = moduleRegistry
  const { pageSize } = pagination

  const listProps = {
    dataSource: list,
    loading: loading.effects['moduleRegistry/query'],
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
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'moduleRegistry/updateModelState',
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
        pathname: '/moduleRegistry',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({ pathname: '/moduleRegistry' }))
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

ModuleRegistry.propTypes = {
  moduleRegistry: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ moduleRegistry, loading }) => ({ moduleRegistry, loading }))(ModuleRegistry)
