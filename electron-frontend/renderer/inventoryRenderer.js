document.addEventListener("DOMContentLoaded", async () => {
    const inventory = await window.electron.getAllProducts();
    updateProductEntries(inventory);


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
        const productName = document.getElementById("product_name");
        const productWeight = document.getElementById("product_weight");
        const productCategory = document.getElementById("product_category");
        const productPrice = document.getElementById("product_price");
        const result = await window.electron.addNewProductItem(productName.value, productWeight.value, productCategory.value, productPrice.value);
        if (result.success) {
            document.getElementById("message").innerText = "Added successfully.";
            productName.value = "";
            productWeight.value = "";
            productCategory.value = "";
            productPrice.value = "";
            setTimeout(() => {
                document.getElementById("message").innerText = "";
            }, 3000);
        } else {
            document.getElementById("message").innerText = "Failed added: " + result.error.message;
        }
    });

    const addNewEntryModal = document.getElementById("addNewEntryModal");
    const openAddNewEntryModal = document.getElementById("openAddNewEntryModal");
    const cancelAddNewEntryButton = document.getElementById("cancelAddNewEntryButton");
    const addNewEntryButton = document.getElementById("addNewEntryButton");
    openAddNewEntryModal.addEventListener("click", async () => {
        addNewEntryModal.classList.remove("hidden");
        const productItemList = document.getElementById("product_items_list");
        const result = await window.electron.getProductItems();
        if (result.success) {
            // store sa local storage will be use for compare checking pag in-add na sa db
            localStorage.setItem("product_items", JSON.stringify(result.data));
            storedResult = localStorage.getItem("product_items");
            products = JSON.parse(storedResult);
            console.log(products);
            productItemList.innerHTML = "";
            products.forEach(item => {
                const weight = item.weight || 'N/A'
                productItemList.innerHTML += `<option data-id="${item.item_id}" value="${item.item_name} ${weight}"></option>`;
            });
        }

    });
    cancelAddNewEntryButton.addEventListener("click", () => {
        addNewEntryModal.classList.add("hidden");
    });
    addNewEntryButton.addEventListener("click", async () => {
        const newEntryName = document.getElementById("new_entry_name");
        const newEntryExpDate = document.getElementById("expiration_date");
        const newEntryPurchasedDate = document.getElementById("purchased_date");
        const newEntryBarcode = document.getElementById("barcode");
        const newEntryMessage = document.getElementById("new_entry_message");
        storedResult = localStorage.getItem("product_items");
        products = JSON.parse(storedResult);
        let found = false;
        let matchedId = null;
        products.forEach(item => {
            if (item.item_name.toLowerCase() === newEntryName.value.toLowerCase()) {
                found = true;
                matchedId = item.item_id;
            }            
        });
        if(found) {
            const response = await window.electron.addNewProductEntry(matchedId, newEntryExpDate.value, newEntryPurchasedDate.value, newEntryBarcode.value)
            if (response.success) {
                newEntryMessage.innerText = `Add Success`
                newEntryName.value = "";
                newEntryExpDate.value = "";
                newEntryPurchasedDate.value = "";
                newEntryBarcode.value = "";
                const inventory = await window.electron.getAllProducts();
                updateProductEntries(inventory);            }
        } else {
            newEntryMessage.innerText = `No matching item found.`
        }
        setTimeout(() => {
            newEntryMessage.innerText = "";
        }, 3000);

    });



});



function updateProductEntries(inventory) {
  const tableBody = document.getElementById("inventoryBody");
    tableBody.innerHTML = ""; 
    inventory.forEach(product => {
    const itemName = product.TBL_PRODUCT_ITEM?.item_name || "N/A";
    const price = product.TBL_PRODUCT_ITEM?.price || "N/A";
    const category = product.TBL_PRODUCT_ITEM?.category || "N/A";
    const weight = product.TBL_PRODUCT_ITEM?.weight || "N/A";
    const purchasedDate = product.purchased_date || "—";
    const expirationDate = product.expiration_date || "—";
    const addedAt = product.added_at || "—";
    const row = `<tr class="selectable-row hover:bg-gray-300 cursor-pointer transition-colors group" onClick="testtest()">
                <td class="p-2 ">
                    ${itemName}
                </td>
                <td class="p-2">${weight}</td>
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
}

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
