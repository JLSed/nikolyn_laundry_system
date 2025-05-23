document.addEventListener("DOMContentLoaded", () => {
    const productSearchInput = document.getElementById("search_product");

    serviceInputs.forEach(input => input.addEventListener("input", updateSummary));
    serviceCheckboxes.forEach(checkbox => checkbox.addEventListener("change", updateSummary));

    displayProductList()
});

// DISPLAY PRODUCTS //
async function displayProductList() {
    const products = await window.electron.getAllProducts();
    const productListBody = document.getElementById("productBody");

    const fetchedProducts = {};
    products.forEach(item => {
        const itemName = item.TBL_PRODUCT_ITEM?.item_name || "N/A";
        if (!fetchedProducts[itemName]) fetchedProducts[itemName] = {data: item, count: 0}
        if (fetchedProducts[itemName]) {
            // when product existence found increment count
            fetchedProducts[itemName].count += 1;
        }
    });

    for (const product in fetchedProducts) {
        const price = fetchedProducts[product].data.TBL_PRODUCT_ITEM?.price || "N/A";
        const weight = fetchedProducts[product].data.TBL_PRODUCT_ITEM?.weight || "N/A";
        const barcode = fetchedProducts[product].data.TBL_PRODUCT_ITEM?.barcode || "N/A";
        const quantity = fetchedProducts[product].count;
        const productId = product.replace(/\s/g, '-');
        let row = `<tr  class="hover:bg-blue-600 transition-colors group">
                        <td class="flex-1 p-2">${product} ${weight}</td>
                        <td class="flex-1 p-2">( ${quantity} )</td>
                        <td class="flex-1 p-2 relative overflow-hidden">${price}
                            <div id="addOrder-${productId}" class="cursor-pointer absolute right-0 top-0 bottom-0 flex items-center p-3 font-bold bg-primary text-secondary transform translate-x-full transition-transform duration-300 group-hover:translate-x-0">
                                <span>[ Add ]</span>
                            </div>
                        </td>
                    </tr>`;
        productListBody.insertAdjacentHTML("beforeend",row);
        const addOrderButton = document.getElementById(`addOrder-${productId}`);
        addOrderButton.addEventListener("click", () => {
            event.preventDefault();
            // check for local storage if product orders exist
            let productOrders = JSON.parse(localStorage.getItem("productOrders")) || {};
            console.log(productOrders)
            productOrders[`${addOrderButton}-barcode${barcode}`] = {
                barcode: barcode,
                name: product,
                price: price,
                shared_id: `productOrder-${productId}`,
            };
            localStorage.setItem("productOrders", JSON.stringify(productOrders));
            updateSummary();
            //localStorage.removeItem("productOrders");        
            })
    }
    
}
// DISPLAY PRODUCTS //


function updateServicePrice(totalPrice, id) {
    const orderServicePrice = document.getElementById(id);
    if (orderServicePrice) {
        orderServicePrice.innerHTML = totalPrice
    }
}
// ORDER SUMMARY //
const serviceInputs = document.querySelectorAll(".category-input");
const serviceCheckboxes = document.querySelectorAll(".service-checkbox");
const orderSummarySection = document.getElementById("orderSummary");
const orderSummaryTotal = document.getElementById("orderTotal");
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
    .map(cb => {
        const name = cb.value;
        const price = cb.dataset.price;
        return { name, price }
    });

    let orderSummaryHTML = `<p class="font-bold text-3xl">Order</p>`;
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

    selectedServices.forEach(service => {
        const serviceId = `service-${service.name.replace(/\s/g, '-')}`;
        orderSummaryHTML += `<div class="order-section ml-2 text-lg rounded-lg border-gray-300 border-2 my-1 p-1"> `
        // order-header starting tag
        orderSummaryHTML += `
                <div class="order-header cursor-pointer select-none font-semibold text-lg flex justify-between" onClick="toggleSection('${serviceId}')">
                                    <div class="rounded px-2">${service.name} 
                                        <span id="icon-${serviceId}">
                                            <i class="fa-solid fa-chevron-down"></i>
                                        </span>
                                    </div>
                                    <span id="totalprice-${serviceId}" class="rounded bg-gray-300 px-2">0</span>

                                </div>`// order-header closing tag
        // total price for each service
        let totalPrice = 0;
        if (service.name === "Full Service") {
            orderSummaryHTML += `<div id="${serviceId}" class="order-content hidden select-none">

                                    <div class="ml-4 font-normal"><span class="rounded bg-gray-300 px-2">100</span> Fixed Price</div>
                                </div>`
            totalPrice = parseFloat(service.price);
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
                const categoryId = `cat-${service.name.replace(/\s/g, '-')}-${category.replace(/\s/g, '-')}`;
                orderContents[category].forEach(entry => {
                    //kunin kung times na nareach yung max load, kaya ceil para kahit na less than sa max load counted as one
                    let maxLoad = Math.ceil(entry.value / entry.limit)
                    const remainder = entry.value % entry.limit;
                    total += parseFloat(service.price) * maxLoad;
                    if (remainder > 0) {
                      maxLoad -= 1;
                    }
                    orderSummaryHTML += `<div class="order-category-section ml-4 font-normal">`
                    // order-category-header starting tag
                    orderSummaryHTML += `
                                        <div class="order-category-header cursor-pointer select-none text-base flex justify-between" onClick="toggleSection('${categoryId}')">
                                            <span class="px-2">- ${entry.category}</span>
                                            <span class="px-2">${total}</span> 
                                        </div>`
                    // order-category-content starting tag
                    orderSummaryHTML += `<div id="${categoryId}" class="order-category-content ml-8 hidden">`
                    for (let index = 0; index < maxLoad; index++) {
                        orderSummaryHTML += `<div>
                                                <span class="rounded bg-gray-300 px-2">${service.price}</span> - ${entry.limit} ${entry.unit}
                                            </div>`
                    }
                    if (remainder > 0) {
                        const remRounded = Math.round(remainder * 10) / 10;
                        orderSummaryHTML += `<div>
                                                <span class="rounded bg-gray-300 px-2">${service.price}</span> - ${remRounded} ${entry.unit}
                                            </div>`
                    }
                    orderSummaryHTML += `</div>` // order-category-content closing tag
                    orderSummaryHTML += `</div>` // order-category-section closing tag
                });
                totalPrice += total;
            }
        }
        serviceTotalPrices[`totalprice-${serviceId}`] = totalPrice;
        
        orderSummaryHTML += `</div> `;
        orderSummaryHTML += `</div> `; // order-content closing tag
    });
    
    // for product orders summary
    let productOrders = JSON.parse(localStorage.getItem("productOrders"));
    // console.log(productOrders)
    if (productOrders) {
        for (const product in productOrders) {
            console.log(productOrders[product])
            orderSummaryHTML += `
                            <div class="ml-2 order-product-header cursor-pointer select-none font-semibold text-lg flex justify-between rounded-lg border-gray-300 border-2 my-1 p-1">
                                    <div class="rounded px-2">${productOrders[product].name} 
                                        <span id="icon-">
                                            <i class="fa-solid fa-chevron-down"></i>
                                        </span>
                                    </div>
                                    <span id="${product}" class="rounded bg-gray-300 px-2">0</span>
                            </div>`
            serviceTotalPrices[product] = productOrders[product].price
        }
    }
    orderSummaryHTML += `</div> `; // order-section closing tag
    orderSummarySection.innerHTML = orderSummaryHTML;
    // update full price per service
    let overallPrice = 0;
    for (const id in serviceTotalPrices) {
        updateServicePrice(serviceTotalPrices[id], id);
        overallPrice += serviceTotalPrices[id];
    }
    orderSummaryTotal.innerHTML = `PHP ${overallPrice}`
}
// ORDER SUMMARY //
