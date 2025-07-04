const API_BASE = CONFIG.API_URL;

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const loadingMessage = document.getElementById("loading-message");
  const authLink = document.getElementById("auth-link");
  const token = localStorage.getItem("Token");


  if (token) {
  
    authLink.innerText = "Logout";
    authLink.href = "#";
    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("Token");
      alert("Logged out successfully.");
      window.location.reload(); // Reload to update UI
    });
  } else {
    // If not logged in → show Login
    authLink.innerText = "Login";
    authLink.href = "login.html";
  }

  function showLoading(msg = "Loading products...") {
    loadingMessage.innerText = msg;
    loadingMessage.style.display = "block";
    productList.style.display = "none";
  }

  function hideLoading() {
    loadingMessage.style.display = "none";
    productList.style.display = "block";
  }
 
  function fetchProducts() {
    showLoading("Waking up server...");

    const start = Date.now();
    fetch(`${API_BASE}/products/`)
      .then(async res => {
        const elapsed = Date.now() - start;

        if (elapsed < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
        }

        if (!res.ok) {
          throw new Error("Server error");
        }

        return res.json();
      })
      .then(data => {
        hideLoading();
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
    // const token = localStorage.getItem("Token");

    if (!token) {
      alert("You must log in to continue.");
      window.location.href = "login.html";  // redirect to login page
      return;
    }
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

// function logout() {
//     localStorage.removeItem('Token');
//     window.location.href = 'login.html';
// }

function searchProducts() {
    const query = document.getElementById('searchInput').value;
    const url = `${API_BASE}/products/?search=${encodeURIComponent(query)}`;

    fetch(url, {
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

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
});