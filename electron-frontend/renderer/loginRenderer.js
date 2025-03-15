document.addEventListener("DOMContentLoaded", () => { 
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.addEventListener("click", async () => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const response = await window.electron.login(email, password);
        // switch html to pos when login is success
        if (response.success) {
            window.location.href = "./pos.html";
        } else {
            document.getElementById("message").innerText = "Login failed: " + response.message;
        }
    });
});