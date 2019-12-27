import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, List, Checkbox } from 'antd'
import { RowProps } from './common'

export default class PrivateList extends React.Component {
  constructor(props) {
    super(props)

    let initPrivateList = []
    if (props.initPrivateList) {
      initPrivateList = props.initPrivateList
    }

    this.state = {
      initPrivateList,
      selectPrivateList: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectPrivateList } = this.state
    if (nextProps.initPrivateList) {
      this.setState({ selectPrivateList, initPrivateList: nextProps.initPrivateList })
    }
  }

  onChange = (e, item) => {
    let newList = []
    const { selectPrivateList } = this.state
    if (e.target.checked) {
      newList = selectPrivateList
      newList.push(item)
    } else {
      selectPrivateList.forEach((val) => {
        if (val.namePath !== item.namePath) {
          newList.push(val)
        }
      })
    }

    this.setState({ selectPrivateList: newList })

    this.props.onChange(newList)
  }

  render() {
    return (
      <Row {...RowProps} type="flex" justify="left" >
        <Col style={{ marginTop: 'auto', marginBottom: 'auto' }} span={3}>
          <span>权限列表</span>
        </Col>
        <Col span={21}>
          <List
            size="small"
            style={{ paddingRight: '30px' }}
            dataSource={this.state.initPrivateList}
            renderItem={item => (
              <List.Item
                actions={[
                  <Checkbox onChange={e => this.onChange(e, item)} />,
                ]}
              >
                <List.Item.Meta title={item.namePath} />
              </List.Item>
        )}
          />
        </Col>
      </Row>
    )
  }
}

PrivateList.propTypes = {
  initPrivateList: PropTypes.arrary,
  onChange: PropTypes.func,
}
