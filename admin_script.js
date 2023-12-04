window.addEventListener('DOMContentLoaded', () => {
    fetch("/get_users_admin_info", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }) 
    .then(response => response.json())
    .then(data => {
        document.getElementById("total_users").textContent = data.data.totalUsers
        document.getElementById("total_payments").textContent = data.data.totalPayments
        document.getElementById("total_pro").textContent = data.data.totalPro
        document.getElementById("total_advanced").textContent = data.data.totalAdvanced
        document.getElementById("total_basic").textContent = data.data.totalBasic
    })
})