class NavBar extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <nav class="flex border-b-2 border-primary p-2 items-center justify-between">
        <p id="workerNameDisplay" class="select-none font-monstserrat font-semibold bg-gray-300 px-2 shadow-lg rounded">Nikolyn's Laundry Shop</p>
        <div>
          <a href="../html/pos.html" class="border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">Point of Sale</a>
          <a href="../html/inventory.html" class="border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">Inventory</a>
          <a href="../html/usermanagement.html" class="border-2 border-primary px-2 py-1 hover:bg-primary hover:text-secondary transition-colors" type="button">User Management</a>
          <a id="clockOutBtn" class="border-2 border-primary px-2 py-1 cursor-pointer hover:bg-primary hover:text-secondary transition-colors" type="button">Clock out</a>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);
