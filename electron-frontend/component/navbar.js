class NavBar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
    <div>
      <nav class="flex border-b-2 border-primary p-2 items-center justify-between">
        <p id="workerNameDisplay" class="select-none font-monstserrat font-semibold bg-gray-300 px-2 shadow-lg rounded">Nikolyn's Laundry Shop</p>
        <div>
          <a href="../html/pos.html" class="border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">Point of Sale</a>
          <a href="../html/inventory.html" class="border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">Inventory</a>
          <a href="../html/usermanagement.html" class="border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">User Management</a>
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
}

customElements.define('nav-bar', NavBar);
