const API_BASE = CONFIG.API_URL;

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const Token = localStorage.getItem("Token");

  if (!Token) {
    alert("You must be logged in to view your cart.");
    window.location.href = "login.html"; 
    return;
  }

  function fetchCart() {
    fetch(`${API_BASE}/cart-summary/`, {
      headers: {
        "Authorization": `Token ${Token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        cartItemsContainer.innerHTML = "";

        if (!data.items || data.items.length === 0) {
          cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
          return;
        }

        let total = data.total || 0;

        data.items.forEach(item => {
          cartItemsContainer.innerHTML += `
            <div class="cart-item">
              <img src="${item.product.image}" alt="${item.product.title}">
              <div class="product-details">
                <h4>${item.product.title}</h4>
                <p>Price: $${item.product.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Subtotal: $${item.subtotal.toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
              </div>  
            </div>
          `;
        });

        cartItemsContainer.innerHTML += `
          <h3>Total: $${total.toFixed(2)}</h3>
          <button class="checkout-btn" onclick="checkout()">Checkout</button>
        `;
      })
      .catch(err => {
        console.error("Error fetching cart:", err);
        cartItemsContainer.innerHTML = "<p>Error loading cart.</p>";
      });
  }

 
  window.removeFromCart = function(cartItemId) {
    fetch(`${API_BASE}/cart/${cartItemId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Token ${Token}`
      }
    })
      .then(res => {
        if (res.ok) {
          fetchCart(); 
        } else {
          alert("Failed to remove item.");
        }
      })
      .catch(err => console.error("Remove error:", err));
  };

  
  window.checkout = function() {
    fetch(`${API_BASE}/orders/create_order/`, {
      method: "POST",
      headers: {
        "Authorization": `Token ${Token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.client_secret && data.order_id) {
          window.location.href = 'checkout.html';
          alert("Order placed successfully!");
          
        } else {
          alert(data.detail || "Order failed.");
        }
      })
      .catch(err => {
        console.error("Checkout error:", err);
        alert("Checkout failed.");
      });
  };

  fetchCart();
});
