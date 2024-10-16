async function getProducts() {
  const response = await fetch(`/api/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.products;
}

async function getProduct(id) {
  const response = await fetch(`/api/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return await response.json();
}

export { getProducts, getProduct };
