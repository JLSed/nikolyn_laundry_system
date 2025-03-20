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

    const row = `<tr class="selectable-row hover:bg-gray-300 cursor-pointer transition-colors group" onClick="testtest()">
                <td class="p-2 ">
                    ${itemName}
                </td>
                <td class="p-2">₱ ${price}</td>
                <td class="p-2">${purchasedDate}</td>
                <td class="p-2">${expirationDate}</td>
                <td class="p-2">${category}</td>
                <td class="p-2 relative overflow-hidden">${checkStockStatus(expirationDate)}
                    <div class="absolute right-0 top-0 bottom-0 flex items-center p-3 font-bold bg-primary text-secondary transform translate-x-full transition-transform duration-300 group-hover:translate-x-0">
                        <span>&lt; Edit</span>
                    </div>
                </td>
            </tr>
            `;

    tableBody.innerHTML += row;
  });

    window.testtest = function(id) {
        console.log("test " + id);
    }


    const addNewProductModal = document.getElementById("addNewProductModal");
    const addNewProductButton = document.getElementById("addNewProductButton");
    const openAddNewProductModal = document.getElementById("openAddNewProductModal");
    const cancelAddNewProductButton = document.getElementById("cancelAddNewProductButton");
    const productCategories = document.getElementById("product_categories");
    openAddNewProductModal.addEventListener("click", async () => {
        addNewProductModal.classList.remove("hidden");
        const categoryList = await window.electron.getProductCategories();
        const categories = categoryList.map(item => item.category);
        const uniqueCategories = [...new Set(categories)];
        productCategories.innerHTML = "";
        uniqueCategories.forEach(category => {
            productCategories.innerHTML += `<option value="${category}"></option>`;
        });

    });
    cancelAddNewProductButton.addEventListener("click", () => {
        addNewProductModal.classList.add("hidden");

    });
    addNewProductButton.addEventListener("click", async () => {
        event.preventDefault();
        const productName = document.getElementById("product_name").value;
        const productCategory = document.getElementById("product_category").value;
        const productPrice = document.getElementById("product_price").value;
        const result = await window.electron.addNewProduct(productName, productCategory, productPrice);
        if (result.success) {
            document.getElementById("message").innerText = "Added successfully.";
        } else {
            document.getElementById("message").innerText = "Failed added: " + result.error.message;
        }
    });
    
});





// for timestampz na data type
function formatDate(date) {
    const newDate = new Date(date);
    return newDate.toISOString().split("T")[0];
}

// temp
function checkStockStatus(expirationDate) {
  if (!expirationDate) return "Unknown";

  const today = new Date();
  const expiry = new Date(expirationDate);
  return expiry > today ? "In Stock" : "Expired";
}
