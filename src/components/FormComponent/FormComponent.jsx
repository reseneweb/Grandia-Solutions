import React from 'react';
import { Form, Select, Input } from 'antd';
import './FormComponent.css';
import PropTypes from 'prop-types';
import { isDark } from '../../utils/isDark';

const { Option } = Select;

function FormComponent({ form, selectedProduct }) {
  return (
    <Form form={form} layout="vertical" name="orderForm">
      <Form.Item
        name="color"
        rules={[{ required: true, message: 'Please select a color!' }]}
        className="formItem"
      >
        <Select
          showSearch
          placeholder="Select color"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {selectedProduct && selectedProduct.product_colors.map(color => (
            <Option
              value={color.hex_value}
              key={color.hex_value}
              style={{ backgroundColor: color.hex_value, color: isDark(color.hex_value) ? 'white' : 'black' }}
            >
              {color.colour_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
        className="formItem"
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="surname"
        rules={[{ required: true, message: 'Please input your surname!' }]}
        className="formItem"
      >
        <Input placeholder="Surname" />
      </Form.Item>
      <Form.Item
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!'
          },
          {
            pattern: new RegExp(/^\+?\d+$/),
            message: 'Please enter a valid phone number with digits only!'
          }
        ]}
        className="formItem"
      >
        <Input placeholder="Phone" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ type: 'email', message: 'The input is not valid E-mail!' }, { required: true, message: 'Please input your email!' }]}
        className="formItem"
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="delivery"
        rules={[{ required: true, message: 'Please select your delivery method!' }]}
        className="formItem"
      >
        <Select placeholder="Delivery method">
          <Option value="courier">Courier</Option>
          <Option value="pickup">Pickup</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="address"
        rules={[{ required: true, message: 'Please input your branch address!' }]}
      >
        <Input placeholder="Branch address" />
      </Form.Item>
    </Form>
  )
};

FormComponent.propTypes = {
  form: PropTypes.object.isRequired,
  selectedProduct: PropTypes.object.isRequired
};

export default FormComponent;