import React from 'react'
import { List, Button } from 'antd'

export default class PrivateGroupView extends React.Component {
  onNewClick = () => {
    this.props.onNewItem()
  }

  onSelectClick = (name) => {
    this.props.onSelectItem(name)
  }

  onDeleteClick = (name) => {
    this.props.onDeleteItem(name)
  }

  render() {
    const NewPanel = () => (
      <div>
        <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus" onClick={this.onNewClick} >
          <span>添加</span>
        </Button>
      </div>
    )

    return (
      <List
        size="small"
        style={{ paddingRight: '30px' }}
        footer={<div><NewPanel /></div>}
        dataSource={this.props.groupItemList}
        renderItem={item => (
          <List.Item actions={[<a onClick={() => { this.onDeleteClick(item.name) }}>删除</a>]}>
            <List.Item.Meta
              title={<a onClick={() => { this.onSelectClick(item) }}>{item.name}</a>}
            />
          </List.Item>
        )}
      />
    )
  }
}

PrivateGroupView.propTypes = {
}
