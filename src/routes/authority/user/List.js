import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Table, Tag, Tooltip } from 'antd'
import styles from './List.less'
import { DropOption } from '../../../components'

const List = ({ onEditItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
  }

  const columns = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    }, {
      title: '模块列表',
      dataIndex: 'module',
      key: 'module',
      render: (text, record) => {
        const content = []
        if (record.module) {
          for (let tag of record.module) {
            const isLongTag = tag.name.length > 20
            const tagElem = (
              <Tag key={tag.name}> {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name} </Tag>
            )
            content.push(isLongTag ? <Tooltip title={tag.name} key={tag.name}>{tagElem}</Tooltip> : tagElem)
          }
        }

        return content
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '修改' }]} />
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
