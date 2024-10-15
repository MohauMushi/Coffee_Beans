async function getProducts() {
  const response = await fetch(`https://fake-coffee-api.vercel.app/api`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

async function getProduct(id) {
  const response = await fetch(`https://fake-coffee-api.vercel.app/api/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return await response.json()
}

export { getProducts, getProduct };
