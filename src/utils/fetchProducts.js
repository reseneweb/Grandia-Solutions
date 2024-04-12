export const fetchProducts = async (setProducts, setLoading, setError) => {
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
