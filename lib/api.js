async function getProducts() {
  const response = await fetch(`https://fake-coffee-api.vercel.app/api`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export { getProducts };
