export const filterProducts = (products, selectedBrands, selectedTags, selectedCategory, selectedType, searchText) => {
  return products.filter(product => {
    return (
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
      (selectedTags.length === 0 || product.tag_list.some(tag => selectedTags.includes(tag))) &&
      (selectedCategory.length === 0 || selectedCategory.includes(product.category)) &&
      (selectedType.length === 0 || selectedType.includes(product.product_type)) &&
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
  });
};
