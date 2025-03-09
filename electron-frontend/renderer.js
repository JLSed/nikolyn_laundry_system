document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await window.electron.login(email, password);
    if (!response.success) {
        document.getElementById("message").innerText = "Login failed: " + response.message;
    }
});

document.getElementById("signupBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await window.electron.signUp(email, password);

    if (response.success) {
        document.getElementById("message").innerText = "Signup successful! Please check your email.";
    } else {
        document.getElementById("message").innerText = "Signup failed: " + response.message;
    }
})