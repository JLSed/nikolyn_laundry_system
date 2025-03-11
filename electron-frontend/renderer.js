document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".category-input");
  const checkboxes = document.querySelectorAll(".service-checkbox");
  const orderSummary = document.getElementById("orderSummary");

  // Global toggle function to show/hide sections
  window.toggleSection = function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle("hidden");
      const icon = document.getElementById("icon-" + id);
      if (icon) {
        icon.innerText = el.classList.contains("hidden") ? "[+]" : "[-]";
      }
    }
  };

  function updateSummary() {
    // Gather selected services from checkboxes.
    const selectedServices = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    // Gather input data from each input field.
    const inputData = Array.from(inputs)
      .map(input => {
        const value = parseFloat(input.value);
        // Only consider valid positive numbers.
        if (!value || value <= 0) return null;
        return {
          category: input.dataset.category, // e.g., "Regular Clothes"
          price: input.dataset.price,       // e.g., "55"
          unit: input.dataset.unit,         // e.g., "kg" or "pc"
          amount: value,                    // the numeric value entered
          limit: input.dataset.limit        // dynamic weight limit per line (e.g., "7" or "4")
        };
      })
      .filter(Boolean);

    // Begin building the summary HTML.
    let summaryHTML = `<p class="font-bold text-3xl">Order Summary</p>`;

    // For each selected service (e.g., "Wash", "Dry", etc.)
    selectedServices.forEach(service => {
      // Create a safe ID string by replacing spaces with dashes.
      const serviceId = `service-${service.replace(/\s/g, '-')}`;
      summaryHTML += `
        <div class="ml-2 font-semibold service-section">
          <div class="service-header cursor-pointer" onclick="toggleSection('${serviceId}')">
            - ${service} <span id="icon-${serviceId}">[+]</span>
          </div>
          <div id="${serviceId}" class="service-content hidden">
      `;

      // Group input data by category.
      const grouped = {};
      inputData.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });

      // For each category, add an expandable section.
      for (const category in grouped) {
        // Create a unique ID for the category section.
        const categoryId = `cat-${service.replace(/\s/g, '-')}-${category.replace(/\s/g, '-')}`;
        summaryHTML += `
          <div class="ml-4 category-section">
            <div class="category-header cursor-pointer" onclick="toggleSection('${categoryId}')">
              -- ${category} <span id="icon-${categoryId}">[+]</span>
            </div>
            <div id="${categoryId}" class="category-content hidden">
        `;

        // For each entry in this category.
        grouped[category].forEach(entry => {
          if (entry.unit === "kg") {
            // Use the limit from the data attribute; default to 7 if not provided.
            const limit = entry.limit ? parseFloat(entry.limit) : 7;
            const fullLines = Math.floor(entry.amount / limit);
            const remainder = entry.amount % limit;

            // Add one line per full limit.
            for (let i = 0; i < fullLines; i++) {
              summaryHTML += `<div class="ml-6">--- (₱ ${entry.price}) ${limit}${entry.unit}</div>`;
            }
            // Add a line for the remaining weight if any.
            if (remainder > 0) {
              const remRounded = Math.round(remainder * 10) / 10;
              summaryHTML += `<div class="ml-6">--- (₱ ${entry.price}) ${remRounded}${entry.unit}</div>`;
            }
          } else {
            // For units other than kg (like pieces), simply display the value.
            summaryHTML += `<div class="ml-6">--- (₱ ${entry.price}) ${entry.amount}${entry.unit}</div>`;
          }
        });

        summaryHTML += `</div></div>`; // Close category-content and category-section.
      }

      summaryHTML += `</div></div>`; // Close service-content and service-section.
    });

    // Update the Order Summary container with the new HTML.
    orderSummary.innerHTML = summaryHTML;
  }
  // Watch for any change in inputs or checkboxes
  inputs.forEach(input => input.addEventListener("input", updateSummary));
  checkboxes.forEach(cb => cb.addEventListener("change", updateSummary));

  const workerNameDisplay = document.getElementById("workerNameDisplay");
  if (workerNameDisplay) {
    displayWorkerName();
  }
});





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
    // remove the current worker name to the local storage then redirect to login page
    localStorage.removeItem("worker_shorten_name")
    window.location.href = "./login.html";
  } else {
    alert("Error logging out: " + response.message);
  }
});

async function displayWorkerName() {
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
