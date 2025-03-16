document.addEventListener("DOMContentLoaded", async () => {
  const inventory = await window.electron.getAllProducts();
  const tableBody = document.getElementById("inventoryBody");

  inventory.forEach(product => {
    const itemName = product.TBL_PRODUCT_ITEM?.item_name || "N/A";
    const price = product.TBL_PRODUCT_ITEM?.price || "N/A";
    const category = product.TBL_PRODUCT_ITEM?.category || "N/A";
    const purchasedDate = product.purchased_date || "—";
    const expirationDate = product.expiration_date || "—";
    const addedAt = product.added_at || "—";

    const row = `<tr class="selectable-row hover:bg-blue-100 cursor-pointer transition-colors">
      <td class="p-2">${itemName}</td>
      <td class="p-2">₱ ${price}</td>
      <td class="p-2">${purchasedDate}</td>
      <td class="p-2">${expirationDate}</td>
      <td class="p-2">${category}</td>
      <td class="p-2">${checkStockStatus(expirationDate)}</td>
      </tr>
    `;

    tableBody.innerHTML += row;
  });
});
// for timestampz na data type
function formatDate(date) {
    const newDate = new Date(date);
    return newDate.toISOString().split("T")[0];
}


// Optional: Add a basic function to determine stock status
function checkStockStatus(expirationDate) {
  if (!expirationDate) return "Unknown";

  const today = new Date();
  const expiry = new Date(expirationDate);
  return expiry > today ? "In Stock" : "Expired";
}