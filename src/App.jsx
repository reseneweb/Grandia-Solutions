import React, { useState, useEffect } from 'react';
import { Table, Tag, Progress, Tooltip, Input, Select } from 'antd';
import './App.css';

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
    render: (price) => {
      if (price === null || +price < 0.1) {
        return 'no data';
      }

      return price % 1 === 0 ? `${price.slice(0, -2)}$` : `${price}$`
    },
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
];

const { Option } = Select;

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    setLoading(true);
    fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
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
    let newFilteredProducts = products.filter(product => {
      return (
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
        (selectedTags.length === 0 || product.tag_list.some(tag => selectedTags.includes(tag))) &&
        (selectedCategory.length === 0 || selectedCategory.includes(product.category)) &&
        (selectedType.length === 0 || selectedType.includes(product.product_type)) &&
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setFilteredProducts(newFilteredProducts);
  }, [selectedBrands, selectedTags, selectedCategory, selectedType, searchText, products]);

  const handleBrandChange = (value) => {
    setSelectedBrands(value);
  };

  const handleTagChange = (value) => {
    setSelectedTags(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
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

  const getUniqueCategories = () => {
    return [...new Set(products.map(product => product.category))].filter(Boolean);
  };

  const getUniqueTypes = () => {
    return [...new Set(products.map(product => product.product_type))].filter(Boolean);
  };

  return (
    <div className="App">
      <div className="selectors">
        <Input
          style={{ width: '200px', marginRight: '10px' }}
          placeholder="Search by name"
          value={searchText}
          onChange={handleSearchChange}
        />
        <Select
          mode="multiple"
          style={{ width: '200px', marginRight: '10px' }}
          placeholder="Select categories"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          {getUniqueCategories().map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
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
          style={{ width: '200px', marginRight: '10px' }}
          placeholder="Select types"
          onChange={handleTypeChange}
          value={selectedType}
        >
          {getUniqueTypes().map(type => (
            <Option key={type} value={type}>{type}</Option>
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
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
        loading={loading}
        expandedRowRender={record => record.product_colors.map(color => (
          <Tag color={color.hex_value} key={color.hex_name} style={{ color: 'black' }}>{color.colour_name}</Tag>
        ))}
        expandIconColumnIndex={6}
      />
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
