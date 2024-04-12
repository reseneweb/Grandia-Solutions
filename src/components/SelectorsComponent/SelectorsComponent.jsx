import React from 'react';
import { Input, Select } from 'antd';
import './SelectorsComponent.css';
import { getUniqueBrands, getUniqueTags, getUniqueCategories, getUniqueTypes } from '../../utils/getUniqueValues';
import { replaceUnderscores } from '../../utils/replaceUnderscores';
import PropTypes from 'prop-types';


const { Option } = Select;

function SelectorsComponent({
  searchText,setSearchText,
  selectedCategory,setSelectedCategory,
  selectedBrands,setSelectedBrands,
  selectedType,setSelectedType,
  selectedTags,setSelectedTags,
  products,
}) {
  return (
    <div className="selectors">
      <Input
        style={{ width: '200px', marginRight: '10px' }}
        placeholder="Search by name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Select
        mode="multiple"
        style={{ width: '200px', marginRight: '10px' }}
        placeholder="Select categories"
        onChange={setSelectedCategory}
        value={selectedCategory}
      >
        {getUniqueCategories(products).map(category => (
          <Option key={category} value={category}>{replaceUnderscores(category)}</Option>
        ))}
      </Select>
      <Select
        mode="multiple"
        style={{ width: '200px', marginRight: '10px' }}
        placeholder="Select brands"
        onChange={setSelectedBrands}
        value={selectedBrands}
      >
        {getUniqueBrands(products).map(brand => (
          <Option key={brand} value={brand}>{replaceUnderscores(brand)}</Option>
        ))}
      </Select>
      <Select
        mode="multiple"
        style={{ width: '200px', marginRight: '10px' }}
        placeholder="Select types"
        onChange={setSelectedType}
        value={selectedType}
      >
        {getUniqueTypes(products).map(type => (
          <Option key={type} value={type}>{replaceUnderscores(type)}</Option>
        ))}
      </Select>
      <Select
        mode="multiple"
        allowClear
        style={{ width: '200px' }}
        placeholder="Select tags"
        onChange={setSelectedTags}
        value={selectedTags}
      >
        {getUniqueTags(products).map(tag => (
          <Option key={tag} value={tag}>{replaceUnderscores(tag)}</Option>
        ))}
      </Select>
    </div>
  );
}

SelectorsComponent.propTypes = {
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired,
  selectedCategory: PropTypes.array.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  selectedBrands: PropTypes.array.isRequired,
  setSelectedBrands: PropTypes.func.isRequired,
  selectedType: PropTypes.array.isRequired,
  setSelectedType: PropTypes.func.isRequired,
  selectedTags: PropTypes.array.isRequired,
  setSelectedTags: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default SelectorsComponent;
