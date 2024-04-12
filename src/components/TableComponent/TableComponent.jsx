import React from 'react';
import { Table, Tag } from 'antd';
import PropTypes from 'prop-types';
import { isDark } from '../../utils/isDark';

function TableComponent({ filteredProducts, columns, loading }) {
  return (
    <Table
      dataSource={filteredProducts}
      columns={columns}
      rowKey="id"
      loading={loading}
      expandedRowRender={record => record.product_colors.map(color => (
        <Tag color={color.hex_value} key={color.hex_name} style={{ color: isDark(color.hex_value) ? 'white' : 'black' }}>
          {color.colour_name}
        </Tag>
      ))}
      expandIconColumnIndex={6}
    />
  );
}

TableComponent.propTypes = {
  filteredProducts: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default TableComponent;
