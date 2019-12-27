import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import PrivateListView from './PrivateListView'
import PrivateSummary from './PrivateSummary'

const PrivateGroupPanel = ({
  loading,
  onNewItem,
  onSelectItem,
  onDeleteItem,
  currentItem,
  groupItemList,
}) => (
  <Row type="flex" align="top">
    <Col md={8} lg={10}>
      <PrivateListView
        loading={loading}
        onNewItem={onNewItem}
        onSelectItem={onSelectItem}
        onDeleteItem={onDeleteItem}
        groupItemList={groupItemList}
      />
    </Col>
    <Col md={12} offset={2} lg={10}>
      <PrivateSummary value={currentItem} />
    </Col>
  </Row>
)

PrivateGroupPanel.propTypes = {
  loading: PropTypes.object,
  onNewItem: PropTypes.func,
  onSelectItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  currentItem: PropTypes.object,
  groupItemList: PropTypes.array,
}

export default PrivateGroupPanel
