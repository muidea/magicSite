import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Editor } from 'components'
import { Form, Input, Checkbox, Button } from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group

const formItemLayout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 22,
  },
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
    setFieldsValue,
    getFieldsValue,
  } }) => {
  const { id, article, catalogs, editorState, actionType } = articleEditor
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      dispatch({
        type: (actionType === 'create') ? 'articleEditor/createArticle' : 'articleEditor/updateArticle',
        payload: {
          id,
          ...data,
        },
      })
    })
  }

  const onContentStateChange = (editorContent) => {
    setFieldsValue({ article_content: JSON.stringify(editorContent) })
  }

  const onEditorStateChange = (state) => {
    dispatch({
      type: 'articleEditor/updateEditorState',
      payload: { editorState: state },
    })
  }

  const onCheckBoxStateChange = (checkedValues) => {
    setFieldsValue({ article_catalog: checkedValues })
  }

  return (<div className="content-inner">
    <div className={styles.content}>
      <Form layout="horizontal">
        <FormItem label="标题" {...formItemLayout}>
          {getFieldDecorator('article_title', {
            initialValue: article.title,
            rules: [
              {
                required: true,
                message: '标题不能为空',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="内容" {...formItemLayout}>
          {getFieldDecorator('article_content', {
            initialValue: article.content,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea rows={3} cols={30} style={{ display: 'none' }} />)}
          <Editor
            wrapperStyle={{
              minHeight: 500,
            }}
            editorStyle={{
              minHeight: 376,
            }}
            editorState={editorState}
            onContentStateChange={onContentStateChange}
            onEditorStateChange={onEditorStateChange}
          />
        </FormItem>
        <FormItem label="分类" {...formItemLayout}>
          {getFieldDecorator('article_catalog', {
            initialValue: article.catalog,
            rules: [
              {
                required: true,
                message: '分类必须选择',
              },
            ],
          })(<Input />)}
          <CheckboxGroup options={catalogs} value={article.catalog} onChange={onCheckBoxStateChange} />
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="default" style={{ marginRight: 16 }} htmlType="submit">重填</Button>
          <Button type="primary" onClick={handleOk} htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    </div>
  </div>)
}


ArticleEditor.propTypes = {
  dispatch: PropTypes.func,
  articleEditor: PropTypes.object,
  form: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ articleEditor, loading }) => ({ articleEditor, loading: loading.models.articleEditor }))(Form.create()(ArticleEditor))
