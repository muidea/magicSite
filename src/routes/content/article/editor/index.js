import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import ArticleForm from './Form'

const Editor = ({ articleEditor }) => {
  const { article, result } = articleEditor

  return (<div className="content-inner">
    <ArticleForm />
  </div>)
}

Editor.propTypes = {
  articleEditor: PropTypes.object,
}

export default connect(({ articleEditor }) => ({ articleEditor }))(Editor)
