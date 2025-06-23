const API_BASE = 'http://127.0.0.1:8000/api';

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
//   const search = document.getElementById("search");
 
  function fetchProducts() {
  fetch(`${API_BASE}/products/`, {
    headers: {
      "Authorization": `Token ${localStorage.getItem("Token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = "";

      data.forEach(product => {
        productList.innerHTML += `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <div class="product-details">
              <h2>${product.title}</h2>
              <p>${product.description}</p>
              <p class="price">Price: $${product.price}</p>
              <p class="stock">${product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}</p>
            </div>
          </div>
        `;
      });
    });
}

  fetchProducts();
});

function logout() {
    localStorage.removeItem('Token');
    window.location.href = 'login.html';
}
