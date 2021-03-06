import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Input, Button } from 'antd'
import { RichEditor } from 'components'
import { CatalogTree } from '../../common'
import styles from './index.less'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 22 },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 20,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 10,
    },
  },
}

const ArticleEditor = ({
  dispatch,
  articleEditor,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const { article, actionType, catalogTree } = articleEditor
  const { id, title, content, catalog } = article

  const onHandleSummit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = { ...getFieldsValue() }

      dispatch({
        type: (actionType === 'create') ? 'articleEditor/createArticle' : 'articleEditor/updateArticle',
        payload: {
          id,
          ...data,
        },
      })
    })
  }

  const onLoadData = (catalogID) => {
    dispatch({ type: 'articleEditor/queryCatalogTree', payload: { namespace: 'articleEditor', catalog: catalogID, loadData: true } })
  }

  return (
    <div className="content-inner">
      <div className={styles.content}>
        <Form layout="horizontal">
          <FormItem label="标题" {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: title,
              rules: [
                {
                  required: true,
                  message: '标题不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="内容" {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue: content,
              rules: [
                { required: false },
              ],
            })(<RichEditor placeholder="输入内容" editorStyle={{ minHeight: 376 }} />)}
          </FormItem>
          <FormItem label="分类" {...formItemLayout}>
            {getFieldDecorator('catalog', {
              initialValue: catalog,
              rules: [
                {
                  required: true,
                  message: '分类必须选择',
                },
              ],
            })(<CatalogTree multiple treeData={catalogTree} onLoadData={onLoadData} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="default" style={{ marginRight: 16 }} htmlType="submit">重填</Button>
            <Button type="primary" onClick={onHandleSummit} htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </div>
    </div>)
}


ArticleEditor.propTypes = {
  dispatch: PropTypes.func,
  articleEditor: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ articleEditor }) => ({ articleEditor }))(Form.create()(ArticleEditor))
