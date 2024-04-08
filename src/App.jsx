import React, { useState, useEffect } from 'react';
import { Table, Tag, Progress, Tooltip, Form, Input, Select, Layout, Modal, Button, message } from 'antd';
import './App.css';

const { Option } = Select;
const { Header, Content, Footer } = Layout;

function App() {
  const validPrice = price => price === null || +price < 0.1 ? 'no data' : `${(+price).toFixed((+price % 1) === 0 ? 0 : 2)}$`;

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

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        message.destroy();
        message.success('Your order has been placed successfully. We will contact you shortly!', 5);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleOrder = (record) => {
    message.destroy();
    setSelectedProduct(record);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json?brand=colourpop');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const initialProducts = await response.json();
        setProducts(initialProducts);
        setLoading(false);

        const fullResponse = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json');
        if (!fullResponse.ok) {
          throw new Error(`Error: ${fullResponse.status}`);
        }
        const allProducts = await fullResponse.json();
        setProducts(allProducts);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
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
      <Layout className="layout">
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa', padding: '0 26px' }}>
          <a href="/" className="logo" style={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }}>
            Grandia Solutions
          </a>
          <Button type="primary" onClick={showModal}>
            Order
          </Button>
        </Header>

        <Content style={{ padding: '0 10px', backgroundColor: '#fff' }} className="content">
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
        </Content>
        <Footer className="footer">
          <div className="contact-us">
            <p>Contact us:</p>
            <a href="mailto:dmytro.fefelov@gmail.com" target="_blank" rel="noopener noreferrer">Gmail</a>
            <a href="https://t.me/reseneweb" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a href="https://www.linkedin.com/in/dmytro-fefelov" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/reseneweb" target="_blank" rel="noopener noreferrer">Github</a>
          </div>
        </Footer>
        <Modal
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Confirm Order"
        >
          {selectedProduct && (
            <div>
              <div className="modal-content">
                <div className="product-image-container">
                  <img
                    className="product-image"
                    src={selectedProduct.api_featured_image}
                    alt={selectedProduct.name}
                  />
                </div>
                <div className="product-details">
                  <p className="orderDetails"><strong>Order Details:</strong></p>
                  <p><strong>Name:</strong> {selectedProduct.name}</p>
                  <p><strong>Price:</strong> {validPrice(selectedProduct.price)}</p>
                  <p><strong>Brand:</strong> {selectedProduct.brand || 'none'}</p>
                  <p><strong>Type:</strong> {selectedProduct.product_type || 'none'}</p>
                  <p><strong>Category:</strong> {selectedProduct.category || 'none'}</p>
                </div>
              </div>

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
                        style={{ backgroundColor: color.hex_value }}
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
            </div>
          )}
        </Modal>
      </Layout>
    </div>
  );
}

export default App;
