document.addEventListener("DOMContentLoaded", () => {
  const clockOutBtn = document.getElementById("clockOutBtn");
  const modal = document.getElementById("clockOutModal");
  const cancelBtn = document.getElementById("cancelClockOut");
  const confirmBtn = document.getElementById("confirmClockOut");

  clockOutBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  confirmBtn.addEventListener("click", async () => {
    modal.classList.add("hidden");

    const response = await window.electron.signOut();
    if (response.success) {
      // remove the current worker name to the local storage then redirect to login page
      localStorage.removeItem("current_worker")
      window.location.href = "./login.html";
    } else {
      alert("Error logging out: " + response.message);
    }
  });

});
