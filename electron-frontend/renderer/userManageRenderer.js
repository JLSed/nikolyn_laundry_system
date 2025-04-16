document.addEventListener('DOMContentLoaded', () => {

const employeeBody = document.getElementById('employeeBody');

async function displayWorkerRoles(employee_id) {
    const result = await window.electron.getAllWorkerRoles(employee_id);
    const roles = await window.electron.getAllRoles();
    if (result) {
        const roleRow = document.getElementById(`rolesRow-${employee_id}`)
        let rolesHTML = '';
        result.forEach(role => {
            rolesHTML += `<div id="employeeRoleID-${role.TBL_ROLE?.id}" class="subEmployeeRole-${employee_id} select-none rounded-full px-2 text-center mb-1 border-2 border-primary">${role.TBL_ROLE?.role_name}</div>`
        });
        rolesHTML += `
            <button id="editRole-${employee_id}" class="add-role-btn text-green-600 font-bold w-full" data-worker-id="">
                <span class="material-symbols-outlined">add_box</span>
            </button>
            <div id="roleSubmenu-${employee_id}" class="role-submenu hidden absolute right-0 flex flex-col px-4 bg-white border shadow rounded p-2 z-10">
                <form class="flex flex-col gap-2">            `
        roles.forEach(role => {
        rolesHTML += `
                <label>
                <input type="checkbox" name="${role.role_name}" id="roleId-${role.id}-${employee_id}" data-roleId="${role.id}" data-employeeId="${employee_id}">
                ${role.role_name}
                </label>
            `
        });
        rolesHTML += `</div>`
        roleRow.insertAdjacentHTML("beforeend", rolesHTML);

        //checks all employee roles to the submenu
        result.forEach(role => {
            const activeRole = document.getElementById(`roleId-${role.TBL_ROLE?.id}-${employee_id}`);
            if (activeRole.dataset.roleid == role.TBL_ROLE?.id) {
                activeRole.checked = true;
            }
        });

        // add event listener to each checkbox input
        roles.forEach(role => {
            const activeRole = document.getElementById(`roleId-${role.id}-${employee_id}`);
            activeRole.addEventListener("change", async (e) => {
                const checkbox = e.target;
                const roleId = checkbox.dataset.roleid;
                const employeeId = checkbox.dataset.employeeid;
                if (checkbox.checked) {
                    const result = await window.electron.assignEmployeeRole(roleId, employeeId);
                    if (result.success) {
                        refreshRoles(employeeId);
                    }
                } else {
                    const confirmDelete = confirm("Are you sure you want to remove this role?");
                    if (confirmDelete) {
                        const result = await window.electron.unassignEmployeeRole(roleId, employeeId);
                        if (result.success) {
                            refreshRoles(employeeId);
                        }
                    } else {
                        // If cancelled, re-check the box
                        checkbox.checked = true;
                    }
                }
            });
        });
        const employeeEditRoleBtn = document.getElementById(`editRole-${employee_id}`);
        employeeEditRoleBtn.addEventListener("click", () => {
            toggleSubmenu(employee_id);
        });

    } else {
        console.log("Error on displaying employee roles")
    }
}

async function refreshRoles(employeeId) {
    const roleRow = document.getElementById(`rolesRow-${employeeId}`);
    if (roleRow) {
        roleRow.innerHTML = ""; // Clear existing roles
        await displayWorkerRoles(employeeId);
    }
}

function toggleSubmenu(targetEmployeeId) {
  const allSubmenus = document.querySelectorAll('.role-submenu');
  allSubmenus.forEach(submenu => {
    if (submenu.id === `roleSubmenu-${targetEmployeeId}`) {
      // Toggle the target submenu: if hidden, remove; if visible, hide it.
      submenu.classList.toggle("hidden");
    } else {
      // Hide all other submenus
      submenu.classList.add("hidden");
    }
  });
}


function displayEditRoleSubMenu(employee_id) {
    console.log("helo")
    const roleRow = document.getElementById(`rolesRow-${employee_id}`)
    console.log(roleRow)
    roleRow.innerHTML += `
    <p>hello</p>
    `
}


async function getAllWorkers() {
    const result = await window.electron.getAllWorkers();
    console.log(result)
    result.forEach(async employee => {

        employeeBody.innerHTML += `<tr class=" border-b-2 border-slate-400">
            <td class="px-2">
                <div>
                    <p class="font-bold text-xl">${employee.first_name} ${employee.last_name}</p>
                    <p class="font-poppins -mt-1 text-xs text-gray-500">${employee.email}</p>
                </div>
            </td>
            <td id="rolesRow-${employee.employee_id}" class="px-2 py-2 relative">
                
            </td>
            <td class="px-2">
                <div>Last Clock In</div>
            </td>
            <td class="">
                    <p>${formatDate(employee.created_at)}</p>
            </td>
        </tr>
        `;
        displayWorkerRoles(employee.employee_id)

    });
}

    getAllWorkers();
});

// for timestampz na data type
function formatDate(date) {
    const newDate = new Date(date);
    return newDate.toISOString().split("T")[0];
}