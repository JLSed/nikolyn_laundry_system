document.addEventListener("DOMContentLoaded", () => {
const serviceInputs = document.querySelectorAll(".category-input");
const serviceCheckboxes = document.querySelectorAll(".service-checkbox");
const orderSummarySection = document.getElementById("orderSummary");
const orderSummaryTotal = document.getElementById("orderTotal");

function updateServicePrice(totalPrice, id) {
    const orderServicePrice = document.getElementById(id);
    if (orderServicePrice) {
        orderServicePrice.innerHTML = totalPrice
    }
}
function updateSummary() {

    const serviceData = Array.from(serviceInputs).map(data => {
        const value = parseFloat(data.value);
        if (!value || value <= 0) return null;
        return {
            value: value,
            category: data.dataset.category,
            price: data.dataset.price,
            unit: data.dataset.unit,
            limit: data.dataset.limit,
        };
    }).filter(Boolean); // filter to only get non-null

    const selectedServices = Array.from(serviceCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value)

    let orderSummaryHTML = `<p class="font-bold text-3xl">Order Summary</p>`;
    const serviceTotalPrices = {};
    window.toggleSection = function(id) {
        const orderContent = document.getElementById(id);
        if (orderContent) {
            orderContent.classList.toggle("hidden");
            const icon = document.getElementById("icon-" + id);
            if (icon) {
                icon.innerHTML = orderContent.classList.contains("hidden") ? 
                `<i class="fa-solid fa-chevron-down"></i>` : 
                `<i class="fa-solid fa-chevron-up"></i>`;
            }
        }
    };

    selectedServices.forEach(serviceName => {
        const serviceId = `service-${serviceName.replace(/\s/g, '-')}`;
        orderSummaryHTML += `<div class="order-section ml-2 text-lg"> `
        // order-header starting tag
        orderSummaryHTML += `
                <div class="order-header cursor-pointer select-none font-bold text-xl" onClick="toggleSection('${serviceId}')">
                                    <span id="totalprice-${serviceId}" class="rounded bg-gray-300 px-2">0</span>
                                    • ${serviceName} 
                                    <span id="icon-${serviceId}">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>`// order-header closing tag
        // total price for each service
        let totalPrice = 0;
        if (serviceName === "Full Service") {
            orderSummaryHTML += `<div id="${serviceId}" class="order-content hidden select-none">

                                    <div class="ml-4 font-normal"><span class="rounded bg-gray-300 px-2">100</span> Fixed Price</div>
                                </div>`
            totalPrice = 100;
        } else {
            orderSummaryHTML += `<div id="${serviceId}" class="order-content select-none">`
            const orderContents = {};
            serviceData.forEach(data => {
                //check muna kung existing ba yung category array sa orderContents; pag hindi, create new category array
                if (!orderContents[data.category]) orderContents[data.category] = [];
                // push data sa created category array
                orderContents[data.category].push(data);
            });

            for (const category in orderContents) {
                let total = 0;
                const categoryId = `cat-${serviceName.replace(/\s/g, '-')}-${category.replace(/\s/g, '-')}`;
                orderContents[category].forEach(entry => {
                    //kunin kung times na nareach yung max load, kaya ceil para kahit na less than sa max load counted as one
                    const maxLoad = Math.ceil(entry.value / entry.limit)
                    const remainder = entry.value % entry.limit;
                    if (remainder > 0) {
                      maxLoad - 1;
                    }
                    total += parseFloat(entry.price) * maxLoad;
                    orderSummaryHTML += `<div class="order-category-section ml-4 font-normal">`
                    // order-category-header starting tag
                    orderSummaryHTML += `
                                        <div class="order-category-header cursor-pointer select-none" onClick="toggleSection('${categoryId}')">
                                            <span class="rounded bg-gray-300 px-2">${total}</span> - ${entry.category}
                                            <span id="icon-${categoryId}">
                                                <i class="fa-solid fa-chevron-down"></i>
                                            </span>
                                        </div>`
                    // order-category-content starting tag
                    orderSummaryHTML += `<div id="${categoryId}" class="order-category-content ml-8 hidden">`
                    for (let index = 0; index < maxLoad; index++) {
                        orderSummaryHTML += `<div>
                                                <span class="rounded bg-gray-300 px-2">${entry.price}</span> - ${entry.limit} ${entry.unit}
                                            </div>`
                    }
                    if (remainder > 0) {
                        const remRounded = Math.round(remainder * 10) / 10;
                        orderSummaryHTML += `<div>
                                                <span class="rounded bg-gray-300 px-2">${entry.price}</span> - ${remRounded} ${entry.unit}
                                            </div>`
                    }
    
                    orderSummaryHTML += `</div>`
                    orderSummaryHTML += `</div>` // order-category-section closing tag
                });

                totalPrice += total;
          }
        }
        serviceTotalPrices[`totalprice-${serviceId}`] = totalPrice;
        
        orderSummaryHTML += `</div> `; // order-content closing tag
        orderSummaryHTML += `</div> `; // order-section closing tag
    });

    orderSummarySection.innerHTML = orderSummaryHTML;
    // update full price per service
    let overallPrice = 0;
    for (const id in serviceTotalPrices) {
        updateServicePrice(serviceTotalPrices[id], id);
        overallPrice += serviceTotalPrices[id];
    }
    orderSummaryTotal.innerHTML = `Total: ${overallPrice}`
}

serviceInputs.forEach(input => input.addEventListener("input", updateSummary));
serviceCheckboxes.forEach(checkbox => checkbox.addEventListener("change", updateSummary));

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
