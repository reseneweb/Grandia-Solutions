import React from 'react';
import { Progress, Tooltip, Button } from 'antd';
import { validPrice } from './validPrice';
import { replaceUnderscores } from './replaceUnderscores';

export const getColumns = (handleOrder) => [
  {
    title: 'Image',
    dataIndex: 'image_link',
    key: 'image',
    render: (text, record) => (
      <img
        src={record.api_featured_image}
        alt={record.name}
        style={{ width: '200px', height: '200px' }}
      />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    sorter: (a, b) => (a.category || '').localeCompare(b.category || ''),
    render: replaceUnderscores,
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
    sorter: (a, b) => (a.brand || '').localeCompare(b.brand || ''),
    render: replaceUnderscores,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    sorter: (a, b) => (a.price || 0) - (b.price || 0),
    render: validPrice,
  },
  {
    title: '',
    render: () => 'View colors:'
  },
  {
    title: 'Type',
    dataIndex: 'product_type',
    key: 'productType',
    sorter: (a, b) => (a.product_type || '').localeCompare(b.product_type || ''),
    render: replaceUnderscores,
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
    render: (rating) => {
      const ratingValue = rating === null ? 0 : rating;
      return (
        <Tooltip title={`Rating: ${ratingValue}`}>
          <Progress
            percent={ratingValue * 20}
            status={ratingValue ? "active" : "exception"}
            strokeColor={ratingValue ? undefined : 'darkgrey'}
          />
        </Tooltip>
      );
    },
    sorter: (a, b) => (b.rating || 0) - (a.rating || 0),
  },
  {
    title: 'Order',
    key: 'order',
    render: (text, record) => (
      <Button type="primary" onClick={() => handleOrder(record)}>
        Order
      </Button>
    ),
  }
];