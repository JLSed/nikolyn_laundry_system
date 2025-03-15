document.addEventListener("DOMContentLoaded", () => {
  const workerNameDisplay = document.getElementById("workerNameDisplay");
  const clockOutBtn = document.getElementById("clockOutBtn");
  const modal = document.getElementById("clockOutModal");
  const cancelBtn = document.getElementById("cancelClockOut");
  const confirmBtn = document.getElementById("confirmClockOut");
  displayWorkerName(workerNameDisplay);

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
      localStorage.removeItem("worker_shorten_name")
      window.location.href = "./login.html";
    } else {
      alert("Error logging out: " + response.message);
    }
  });

});




async function displayWorkerName(workerNameDisplay) {
  // check first if the name is cached in the local storage so it does not fetch data from the database every refresh
  const cached_name = localStorage.getItem("worker_shorten_name");
  if(cached_name) {
    workerNameDisplay.innerText = JSON.parse(cached_name)
  } else {
    const response = await window.electron.getCurrentWorker();
    if (response && response.success) {
      const worker = response.worker;

      const firstInitial = worker.first_name?.charAt(0).toUpperCase() || '';
      const middleInitial = worker.middle_name?.charAt(0).toUpperCase() || '';
      const lastName = worker.last_name || '';
      const shortenName = `${firstInitial}. ${middleInitial}. ${lastName}`;
      localStorage.setItem("worker_shorten_name", JSON.stringify(shortenName))
      workerNameDisplay.innerText = shortenName
    } else {
      workerNameDisplay.innerText = "Unknown Worker";
    }
  }
}
