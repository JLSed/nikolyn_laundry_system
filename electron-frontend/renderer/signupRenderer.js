document.addEventListener("DOMContentLoaded", () => {
const signupBtn = document.getElementById("signup");
    signupBtn.addEventListener("submit", async () => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const first_name = document.getElementById("first_name").value;
        const middle_name = document.getElementById("middle_name").value;
        const last_name = document.getElementById("last_name").value;
        const response = await window.electron.signUp(email, password, first_name, middle_name, last_name);
        if (response.success) {
            document.getElementById("message").innerText = "Signup successful! Please check your email: " + response.user.email;
        } else {
            document.getElementById("message").innerText = "Signup failed: " + response.message;
        }
    });

});
