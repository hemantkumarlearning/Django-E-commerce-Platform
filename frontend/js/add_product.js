const API_BASE = CONFIG.API_URL;
const token = localStorage.getItem('Token');

if (!token) {
    window.location.href = 'login.html';
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-table-body')) {
        loadProducts();
    }
});


document.getElementById('add-product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('product-id')?.value;
    const title = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const image = document.getElementById('product-image').value.trim();

    if (!title || !description || isNaN(price) || isNaN(stock) || !image) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const data = { title, description, price, stock, image };
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${API_BASE}/products/${id}/` : `${API_BASE}/products/`;

    try {
        const res = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert(id ? 'Product updated!' : 'Product added!');
            document.getElementById('add-product-form').reset();
            document.getElementById('product-id').value = '';
            loadProducts();
        } else {
            const err = await res.json();
            alert('Error: ' + (err.detail || 'Failed to save product.'));
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Network error.');
    }
});


async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE}/products/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!res.ok) throw new Error('Unauthorized');

        const products = await res.json();
        const tbody = document.getElementById('product-table-body');
        tbody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td><img src="${product.image}" width="50" /></td>
                <td>
                    <button class="edit-button" onclick="editProduct(${product.id})">Edit</button>
                    <button class="delete-button" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Failed to load products:', err);
        alert('Could not load products.');
    }
}

async function editProduct(id) {
    try {
        const res = await fetch(`${API_BASE}/products/${id}/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!res.ok) throw new Error('Failed to fetch product');

        const product = await res.json();
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.title;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image;
        window.scrollTo(0, 0);
    } catch (err) {
        console.error('Edit failed:', err);
        alert('Failed to load product for editing.');
    }
}


async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const res = await fetch(`${API_BASE}/products/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (res.ok) {
            alert('Product deleted.');
            loadProducts();
        } else {
            alert('Failed to delete product.');
        }
    } catch (err) {
        console.error('Delete failed:', err);
        alert('Error deleting product.');
    }
}
function logout() {
    localStorage.removeItem('Token');
    window.location.href = 'login.html';
}