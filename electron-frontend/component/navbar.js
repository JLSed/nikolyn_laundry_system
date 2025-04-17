class NavBar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
    <div>
      <nav class="flex border-b-2 border-primary p-2 items-center justify-between">
        <p id="workerNameDisplay" class="select-none font-monstserrat font-semibold bg-gray-300 px-2 shadow-lg rounded">Nikolyn's Laundry Shop</p>
        <div>
          <a data-role="cashier" href="../html/pos.html" class="nav-link border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">Point of Sale</a>
          <a data-role="inventory manager" href="../html/inventory.html" class="nav-link border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">Inventory</a>
          <a data-role="system admin" href="../html/usermanagement.html" class="nav-link border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">User Management</a>
          <a id="clockOutBtn" class="border-2 border-primary px-2 py-1 cursor-pointer hover:bg-primary hover:text-secondary transition-colors" type="button">Clock out</a>
        </div>
      </nav>
    </div>
        <!-- Clock Out Confirmation Modal -->
    <div id="clockOutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
        <div class="bg-white p-6 w-80 shadow-lg text-center">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Clock Out?</h2>
            <p class="text-gray-600 mb-6">Are you sure you want to clock out?</p>
            <div class="flex justify-center gap-4">
                <button id="cancelClockOut" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-sm hover:bg-gray-400">Cancel</button>
                <button id="confirmClockOut" class="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600">Clock Out</button>
            </div>
        </div>
    </div>
    `;
  }
    
  connectedCallback() {
    const workerNameDisplay = this.querySelector("#workerNameDisplay");
    this.displayWorkerName(workerNameDisplay); // ⬅️ Now safe to call here

  }

  
async displayWorkerName(workerNameDisplay) {
  const cachedWorker = localStorage.getItem("current_worker");

  if (cachedWorker) {
    const worker = JSON.parse(cachedWorker);
    workerNameDisplay.innerText = worker.shortenName || "Unknown Worker";
  } else {
    const response = await window.electron.getCurrentWorker();
    if (response && response.success) {
      const worker = response.worker;
      const worker_roles = response.worker_roles;
      const firstInitial = worker.first_name?.charAt(0).toUpperCase() || '';
      const middleInitial = worker.middle_name?.charAt(0).toUpperCase() || '';
      const lastName = worker.last_name || '';
      const shortenName = `${firstInitial}. ${middleInitial}. ${lastName}`;

      const cachedData = {
        ...worker,
        shortenName,
        worker_roles,
      };

      localStorage.setItem("current_worker", JSON.stringify(cachedData));
      workerNameDisplay.innerText = shortenName;
    } else {
      workerNameDisplay.innerText = "Unknown Worker";
    }
  }

  this.restrictNavByRoles()
}

restrictNavByRoles() {
  const cachedWorker = localStorage.getItem("current_worker");
  if (!cachedWorker) return;

  const worker = JSON.parse(cachedWorker);
  console.log(worker)
  const userRoles = (worker.worker_roles || []).map(r => r.TBL_ROLE?.role_name?.toLowerCase());
  const navLinks = this.querySelectorAll(".nav-link");
  console.log(navLinks)
  navLinks.forEach(link => {
    const requiredRole = link.dataset.role?.toLowerCase();
    if (requiredRole && !userRoles.includes(requiredRole)) {
      link.classList.add("hidden");
    }
  });
}



}

customElements.define('nav-bar', NavBar);
