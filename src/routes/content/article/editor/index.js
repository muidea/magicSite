import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { RichEditor, EditableTagGroup } from 'components'
import { Form, Input, Button } from 'antd'
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
  const { article, actionType } = articleEditor
  const { id, name, content, catalog } = article

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

  return (
    <div className="content-inner">
      <div className={styles.content}>
        <Form layout="horizontal">
          <FormItem label="标题" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: name,
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
            })(<EditableTagGroup readOnly={false} />)}
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
  loading: PropTypes.bool,
}

export default connect(({ articleEditor, loading }) => ({ articleEditor, loading: loading.models.articleEditor }))(Form.create()(ArticleEditor))
