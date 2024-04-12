export const getUniqueBrands = (products) => {
  return [...new Set(products.map(product => product.brand))].filter(Boolean);
};

export const getUniqueTags = (products) => {
  if (!products) return [];

  const tagSet = new Set();
  products.forEach(product => {
    product.tag_list?.forEach(tag => tagSet.add(tag));
  });
  return [...tagSet];
};

export const getUniqueCategories = (products) => {
  return [...new Set(products.map(product => product.category))].filter(Boolean);
};

export const getUniqueTypes = (products) => {
  return [...new Set(products.map(product => product.product_type))].filter(Boolean);
};
