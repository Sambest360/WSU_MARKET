let order = [];

function addToOrder(item, price) {
    order.push({ item, price });
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = order.map(i => `<p>${i.item} - R${i.price.toFixed(2)}</p>`).join("");
    
    const total = order.reduce((sum, item) => sum + item.price, 0);
    orderSummary.innerHTML += `<p><strong>Total: R${total.toFixed(2)}</strong></p>`;
}

function showProofUpload() {
    const paymentMethod = document.getElementById('payment').value;
    document.getElementById('proof-section').style.display = paymentMethod === 'card' ? 'block' : 'none';
}

function clearOrder() {
    order = [];
    updateOrderSummary();
}

function toggleLocationField() {
    var deliveryOption = document.getElementById("delivery");
    var locationField = document.getElementById("locationField");
    var locationInput = document.getElementById("location");
    
    if (deliveryOption.value === "delivery") {
        locationField.style.display = "block";
        locationInput.required = true;
    } else {
        locationField.style.display = "none";
        locationInput.required = false;
    }
}

async function submitOrder(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const delivery = document.getElementById('delivery').value;
        const location = document.getElementById('location').value;
        const payment = document.getElementById('payment').value;
        const proof = document.getElementById('proof').files[0];

        const orderDetails = {
            name,
            email,
            phone,
            order: order.map(item => `${item.item} - R${item.price.toFixed(2)}`).join(", "),
            total: order.reduce((sum, item) => sum + item.price, 0).toFixed(2),
            delivery,
            location,
            payment,
            proofOfPayment: proof ? proof.name : 'N/A'
        };

        const response = await fetch('/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails)
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

function validateForm() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var delivery = document.getElementById('delivery').value;
    var location = document.getElementById('location').value;
    var payment = document.getElementById('payment').value;
    var proof = document.getElementById('proof');

    if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || delivery === '' || payment === '') {
        alert('Please fill in all required fields.');
        return false;
    }

    if (delivery === 'delivery' && location.trim() === '') {
        alert('Please enter a delivery location.');
        return false;
    }

    if (payment === 'card' && proof.files.length === 0) {
        alert('Please upload proof of payment for card transactions.');
        return false;
    }

    if (order.length === 0) {
        alert('Please add at least one item to your order.');
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("orderForm").addEventListener("submit", submitOrder);
});