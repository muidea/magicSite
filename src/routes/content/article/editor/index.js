import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Form, Input, Checkbox, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 20,
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 10,
    },
  },
};

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
  { label: 'Banana', value: 'Banana' },
  { label: 'Aa', value: 'Aa' },
  { label: 'Bb', value: 'Bb' },
  { label: 'Cc', value: 'Cc' },
  { label: 'Dd', value: 'Dd' },
  { label: 'Ee', value: 'Ee' },
  { label: 'Ff', value: 'Ff' },
  { label: 'Gg', value: 'Gg' },
  { label: 'Hh', value: 'Hh' },
  { label: 'Ii', value: 'Ii' },
  { label: 'Jj', value: 'Jj' },
];

const Editor = ({ 
  articleEditor,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  }, }) => {
  const { data } = articleEditor
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: data.key,
      }
      //onOk(data)
    })
  }

  return (<div className="content-inner">
    <div className={styles.content}>
    <Form layout="horizontal">
        <FormItem label="标题" hasFeedback {...formItemLayout}>
          {getFieldDecorator('article_title', {
            initialValue: data.title,
            rules: [
              {
                required: true,
                message: '标题不能为空',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="内容" hasFeedback {...formItemLayout}>
          {getFieldDecorator('article_content', {
            initialValue: data.content,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea rows={30} cols={30} />)}
        </FormItem>
        <FormItem label="分类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('article_catalog', {
            initialValue: data.catalog,
            rules: [
              {
                required: true,
                message: '分类必须选择',
              },
            ],
          })(<CheckboxGroup options={options} defaultValue={['Pear']}/>)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
        <Button type="default" style={{ marginRight: 16 }} htmlType="submit">重填</Button>
        <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    </div>
  </div>)
}

Editor.propTypes = {
  articleEditor: PropTypes.object,
  form: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ articleEditor, loading }) => ({ articleEditor, loading: loading.models.articleEditor }))(Form.create()(Editor))
