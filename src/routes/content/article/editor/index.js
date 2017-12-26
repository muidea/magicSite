import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { RichEditor } from 'components'
import { Tabs, Form, Input, Checkbox, Button } from 'antd'
import styles from './index.less'

const TabPane = Tabs.TabPane
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
  const { article, catalogs, editorValue, editorFormat, actionType } = articleEditor
  const { id, title, content, catalog } = article

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

  const onEditorValueChange = (value) => {
    dispatch({
      type: 'articleEditor/updateEditorState',
      payload: { editorValue: value },
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
          {getFieldDecorator('article_content', {
            initialValue: content,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea rows={3} cols={30} style={{ display: 'none' }} />)}
          <Tabs type="card">
            <TabPane tab="编辑器" key="1">
              <RichEditor
                value={editorValue}
                onChange={onEditorValueChange}
                className="react-rte-demo"
                placeholder="Tell a story"
                toolbarClassName="demo-toolbar"
                editorClassName="demo-editor"
                editorStyle={{
                  minHeight: 376,
                }}
              />
            </TabPane>
            <TabPane tab="Markdown模式" key="2">
              <TextArea rows={27} cols={30} value={content} />
            </TabPane>
            <TabPane tab="预览" key="preView">
              <div>ddd</div>
            </TabPane>
          </Tabs>

        </FormItem>
        <FormItem label="分类" {...formItemLayout}>
          {getFieldDecorator('article_catalog', {
            initialValue: catalog,
            rules: [
              {
                required: true,
                message: '分类必须选择',
              },
            ],
          })(<Input />)}
          <CheckboxGroup options={catalogs} value={catalog} onChange={onCheckBoxStateChange} />
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
