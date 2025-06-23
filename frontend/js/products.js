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
              <div class="actions">
                <input type="number" id="qty-${product.id}" min="1" max="${product.stock}" value="1" style="width:60px;" ${product.stock <= 0 ? 'disabled' : ''}>
                <button onclick="addToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
                  ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        `;
      });
    });
}

   window.addToCart = function(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    fetch(`${API_BASE}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("Token")}`
      },
      body: JSON.stringify({
        product: productId,
        quantity: quantity
      })
    }).then(res => {
      if (res.ok) {
        alert("Product added to cart!");
      } else {
        res.json().then(data => {
          alert(data.detail || "Error adding to cart.");
        });
      }
    });
  };


  fetchProducts();
});

function logout() {
    localStorage.removeItem('Token');
    window.location.href = 'login.html';
}
