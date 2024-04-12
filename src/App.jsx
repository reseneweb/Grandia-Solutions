import React, { useState, useEffect, useMemo } from 'react';
import { Form, Layout } from 'antd';
import './App.css';
import { fetchProducts } from './utils/fetchProducts';
import { handleOk, handleCancel, handleOrder } from './utils/modalHandlers';
import { filterProducts } from './utils/filterProducts';
import { getColumns } from './utils/getColumns';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import SelectorsComponent from './components/SelectorsComponent/SelectorsComponent';
import TableComponent from './components/TableComponent/TableComponent';
import ModalComponent from './components/ModalComponent/ModalComponent';

const { Content } = Layout;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => filterProducts(products, selectedBrands, selectedTags, selectedCategory, selectedType, searchText),
    [selectedBrands, selectedTags, selectedCategory, selectedType, searchText, products]);

  const [form] = Form.useForm();

  const boundHandleOrder = handleOrder(setSelectedProduct, setIsModalVisible);
  const boundHandleOk = () => handleOk(form, setIsModalVisible);
  const boundHandleCancel = () => handleCancel(form, setIsModalVisible);

  const columns = getColumns(boundHandleOrder);

  useEffect(() => {
    fetchProducts(setProducts, setLoading, setError);
  }, []);

  return (
    <Layout className="App">
      <HeaderComponent />

      <Content className="content">
        <SelectorsComponent
          searchText={searchText} setSearchText={setSearchText}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands}
          selectedType={selectedType} setSelectedType={setSelectedType}
          selectedTags={selectedTags} setSelectedTags={setSelectedTags}
          products={products}
        />

        <TableComponent filteredProducts={filteredProducts} columns={columns} loading={loading} />
        {error && <p>Error: {error}</p>}
      </Content>

      <FooterComponent />

      <ModalComponent
        isModalVisible={isModalVisible}
        boundHandleOk={boundHandleOk}
        boundHandleCancel={boundHandleCancel}
        selectedProduct={selectedProduct}
        form={form}
      />
    </Layout>
  );
}

export default App;
