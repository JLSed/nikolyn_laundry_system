const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
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
}
const signupBtn = document.getElementById("signup");
if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
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
})
}

  const clockOutBtn = document.getElementById("clockOutBtn");
  const modal = document.getElementById("clockOutModal");
  const cancelBtn = document.getElementById("cancelClockOut");
  const confirmBtn = document.getElementById("confirmClockOut");

  if (clockOutBtn) {
    clockOutBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  confirmBtn.addEventListener("click", async () => {
    modal.classList.add("hidden");

    const response = await window.electron.signOut();
    if (response.success) {
      window.location.href = "login.html";
    } else {
      alert("Error logging out: " + response.message);
    }
  });