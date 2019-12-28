import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { connect } from 'dva'

import { PrivateGroupPanel, PrivateGroupWizard } from './common'

const Private = ({ dispatch, privateGroup, loading }) => {
  const { privateGroupList, initPrivateList, currentPrivateGroup, showPrivateGroupWizard } = privateGroup

  const modalProps = {
    visible: showPrivateGroupWizard,
    maskClosable: false,
    title: '权限组定义',
    width: 800,
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'privateGroup/savePrivate',
        payload: { ...data },
      })
    },
    onCancel() {
      dispatch({
        type: 'privateGroup/cancelNewPrivate',
      })
    },
  }

  const onNewPrivateGroupItem = () => {
    dispatch({
      type: 'privateGroup/invokeNewPrivate',
    })
  }

  const onSelectPrivateGroupItem = (item) => {
    dispatch({
      type: 'privateGroup/selectPrivate',
      payload: { ...item },
    })
  }

  const onDeletePrivateGroupItem = (groupName) => {
    dispatch({
      type: 'privateGroup/destoryPrivate',
      payload: { groupName },
    })
  }

  return (
    <div className="content-inner">
      <Spin spinning={loading.effects['privateGroup/queryAllPrivate']}>
        <PrivateGroupPanel
          onNewItem={onNewPrivateGroupItem}
          onSelectItem={onSelectPrivateGroupItem}
          onDeleteItem={onDeletePrivateGroupItem}
          currentItem={currentPrivateGroup}
          groupItemList={privateGroupList}
        />
        {showPrivateGroupWizard && <PrivateGroupWizard modalProps={modalProps} initPrivateList={initPrivateList} /> }
      </Spin>
    </div>
  )
}

Private.propTypes = {
  privateGroup: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ privateGroup, loading }) => ({ privateGroup, loading }))(Private)
