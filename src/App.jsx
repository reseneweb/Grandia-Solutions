import React, { useState, useEffect } from 'react';
import { Table, Tag, Progress, Tooltip, Switch, Select } from 'antd';

const columns = [
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
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
    sorter: (a, b) => (a.brand || '').localeCompare(b.brand || ''),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    sorter: (a, b) => (a.price || 0) - (b.price || 0),
  },
  {
    title: 'Product Type',
    dataIndex: 'product_type',
    key: 'productType',
    sorter: (a, b) => (a.product_type || '').localeCompare(b.product_type || ''),
  },
  {
    title: 'Product rating',
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
  },
];

const { Option } = Select;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [groupedData, setGroupedData] = useState([]);
  const [groupByType, setGroupByType] = useState(false);
  const [groupByBrand, setGroupByBrand] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchProducts = async () => {
    try {
      let query = 'http://makeup-api.herokuapp.com/api/v1/products.json?';
      if (selectedBrands.length > 0) {
        query += `brand=${selectedBrands.join('|')}&`;
      }
      if (selectedTags.length > 0) {
        query += `tag_list=${selectedTags.join('|')}`;
      }
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(`Failed to fetch products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedBrands, selectedTags);
  }, []);

  const handleBrandChange = (value) => {
    setSelectedBrands(value);
    fetchProducts(value, selectedTags);
  };

  const handleTagChange = (value) => {
    setSelectedTags(value);
    fetchProducts(selectedBrands, value);
  };

  const getUniqueBrands = () => {
    return [...new Set(products.map(product => product.brand))].filter(Boolean);
  };

  const getUniqueTags = () => {
    const tagSet = new Set();
    products.forEach(product => {
      product.tag_list?.forEach(tag => tagSet.add(tag));
    });
    return [...tagSet];
  };

  useEffect(() => {
    setLoading(true);
    fetch('http://makeup-api.herokuapp.com/api/v1/products.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const groupBy = (array, key) => {
      return array.reduce((result, item) => {
        const keyValue = item[key] || 'undefined';
        (result[keyValue] = result[keyValue] || []).push(item);
        return result;
      }, {});
    };

    const applyGrouping = () => {
      let grouped = { 'undefined': [...products] };

      if (groupByType) {
        grouped = groupBy(products, 'product_type');
      } else if (groupByBrand) {
        grouped = groupBy(products, 'brand');
      } else if (groupByCategory) {
        grouped = groupBy(products, 'category');
      }

      const groupedArray = Object.values(grouped).flat();
      setGroupedData(groupedArray);
    };

    applyGrouping();
  }, [products, groupByType, groupByBrand, groupByCategory]);

  return (
    <div className="App">
      <div>
        {`Group by:  `}
        <Switch
          checkedChildren="Type"
          unCheckedChildren="Type"
          value={groupByType}
          onChange={() => {
            setGroupByType(!groupByType);
            setGroupByBrand(false);
            setGroupByCategory(false);
          }}
        />
        <Switch
          checkedChildren="Brand"
          unCheckedChildren="Brand"
          value={groupByBrand}
          onChange={() => {
            setGroupByBrand(!groupByBrand);
            setGroupByType(false);
            setGroupByCategory(false);
          }}
        />
        <Switch
          checkedChildren="Category"
          unCheckedChildren="Category"
          value={groupByCategory}
          onChange={() => {
            setGroupByCategory(!groupByCategory);
            setGroupByType(false);
            setGroupByBrand(false);
          }}
        />
      </div>

      <div>
        <Select
          mode="multiple"
          style={{ width: '200px', marginRight: '10px' }}
          placeholder="Select brands"
          onChange={handleBrandChange}
          value={selectedBrands}
        >
          {getUniqueBrands().map(brand => (
            <Option key={brand} value={brand}>{brand}</Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '200px' }}
          placeholder="Select tags"
          onChange={handleTagChange}
          value={selectedTags}
        >
          {getUniqueTags().map(tag => (
            <Option key={tag} value={tag}>{tag}</Option>
          ))}
        </Select>
      </div>

      <Table
        dataSource={groupedData}
        columns={columns}
        rowKey="id"
        loading={loading}
        expandedRowRender={record => record.product_colors.map(color => (
          <Tag color={color.hex_value} key={color.hex_name}>{color.colour_name}</Tag>
        ))}
        expandIconColumnIndex={6}
      />
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
