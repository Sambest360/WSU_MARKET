let order = [];

function addToOrder(item, price) {
    order.push({ item, price });
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = order.map(i => `<p>${i.item} - R${i.price}</p>`).join("");
    
    const total = order.reduce((sum, item) => sum + item.price, 0);
    orderSummary.innerHTML += `<p><strong>Total: R${total}</strong></p>`;
}

function showProofUpload() {
    const paymentMethod = document.getElementById('payment').value;
    document.getElementById('proof-section').style.display = paymentMethod === 'card' ? 'block' : 'none';
}

function clearOrder() {
    order = [];
    updateOrderSummary();
}

async function submitOrder(event) {
    event.preventDefault();

    try {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const delivery = document.getElementById('delivery').value;
        const location = document.getElementById('location').value;
        const payment = document.getElementById('payment').value;
        const proof = document.getElementById('proof').files[0];

        const orderDetails = {
            name,
            phone,
            delivery,
            location,
            payment,
            order: order.map(item => `${item.item} - R${item.price}`).join(", ")
        };

        const formData = new FormData();
        for (const key in orderDetails) {
            formData.append(key, orderDetails[key]);
        }

        if (payment === 'card' && proof) {
            formData.append('proof', proof);
        }

        const response = await fetch('/submit-order', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message);
        
        // Reset form and order after successful submission
        document.getElementById('orderForm').reset();
        clearOrder();
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while submitting your order: ${error.message}. Please try again.`);
    }
}

function validateForm(event) {
    event.preventDefault();
    
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var delivery = document.getElementById('delivery').value;
    var location = document.getElementById('location').value;
    var payment = document.getElementById('payment').value;
    var proof = document.getElementById('proof');

    if (name.trim() === '' || phone.trim() === '' || delivery === '' || location.trim() === '' || payment === '') {
        alert('Please fill in all required fields.');
        return false;
    }

    if (payment === 'card' && proof.files.length === 0) {
        alert('Please upload proof of payment for card transactions.');
        return false;
    }

    // If all validations pass, submit the form
    submitOrder(event);
    return true;
}
