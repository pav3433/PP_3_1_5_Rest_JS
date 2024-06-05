$(async function () {
    await getAllUsers();
})
// navBar
fetch("/api/user")
    .then(response => response.json())
    .then(data => {
        document.querySelector('#emailBarAdmin').textContent = data.email;
        document.querySelector('#roleBarAdmin').textContent = (data.roles.map(role => " " + role.name.substring(5)).join(' '));
    })
    .catch(error => console.log(error))


//all users
async function getAllUsers() {
    const userTable = $('#allUsersTable');
    userTable.empty();
    fetch("/api/admin/users")
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                let tableWithUsers = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.salary}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(role => " " + role.name.substring(5))}</td>
                            <td>
                                <button type="button" class="btn btn-info text-white" data-bs-toggle="modal"
                                 data-id="${user.id}" data-bs-target="#edit">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger" data-bs-toggle="modal"
                                 data-id="${user.id}" data-bs-target="#delete">Delete</button>
                            </td>
                        </tr>)`;
                userTable.append(tableWithUsers);
            })
        }).catch(error => console.log(error))
}

//add user
fetch("/api/admin/roles")
    .then(response => response.json())
    .then(roles => {
        roles.forEach(role => {
            let el = document.createElement("option");
            el.value = role.id;
            el.text = role.name.substring(5);
            $('#rolesNew')[0].appendChild(el);
        })
    }).catch(error => console.log(error));

const createForm = document.forms["createForm"];
const createLink = document.querySelector('#addNewUser');
const createButton = document.querySelector('#createUserButton');


createLink.addEventListener('click', (event) => {
    event.preventDefault();
    createForm.style.display = 'block';
});
createForm.addEventListener('submit', addNewUser)
createButton.addEventListener('click', addNewUser);

async function addNewUser(e) {
    e.preventDefault();
    let newUserRoles = [];
    for (let i = 0; i < createForm.role.options.length; i++) {
        if (createForm.role.options[i].selected) newUserRoles.push({
            id: createForm.role.options[i].value,
            roles: createForm.role.options[i].text
        })
    }

    fetch("/api/admin/add", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: createForm.username.value,
            password: createForm.password.value,
            salary: createForm.salary.value,
            email: createForm.email.value,
            roles: newUserRoles
        })
    }).then(() => {
        createForm.reset();
        $(async function () {
            await getAllUsers();
        })
    })
}

//edit
$('#edit').on('show.bs.modal', (ev) => {
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showEditModal(id);
});

async function showEditModal(id) {

    let user = await getUser(id);
    const form = document.forms["editForm"];

    form.idEditUser.value = user.id;
    form.usernameEditUser.value = user.username;
    form.passwordEditUser.value = user.password;
    form.salaryEditUser.value = user.salary;
    form.emailEditUser.value = user.email;

    $('#rolesEditUser').empty();
    fetch("/api/admin/roles")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let el = document.createElement("option");
                el.value = role.id;
                el.text = role.name.substring(5);
                $('#rolesEditUser')[0].appendChild(el);
            })
        })
}

$('#editUserButton').click(() => {
    updateUser();
});

async function updateUser() {

    const editForm = document.forms["editForm"];
    const id = editForm.idEditUser.value;

    editForm.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        let editUserRoles = [];
        for (let i = 0; i < editForm.rolesEditUser.options.length; i++) {
            if (editForm.rolesEditUser.options[i].selected) editUserRoles.push({
                id: editForm.rolesEditUser.options[i].value,
                role: editForm.rolesEditUser.options[i].text
            })
        }

        fetch("/api/admin/edit/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                username: editForm.usernameEditUser.value,
                password: editForm.passwordEditUser.value,
                salary: editForm.salaryEditUser.value,
                email: editForm.emailEditUser.value,
                roles: editUserRoles,
            }),
        })
            .then(() => {
                $('#editFormCloseButton').click();
                $(async function () {
                    await getAllUsers();
                })
            });
    });
}


//delete
$('#delete').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showDeleteModal(id);
})

async function getUser(id) {
    let response = await fetch("/api/admin/users/" + id);
    return await response.json();
}

async function showDeleteModal(id) {
    let user = await getUser(id)
    const form = document.forms["deleteForm"];

    form.idDeleteUser.value = user.id;
    form.usernameDeleteUser.value = user.username;
    form.salaryDeleteUser.value = user.salary;
    form.emailDeleteUser.value = user.email;


    $('#rolesDeleteUser').empty();

    user.roles.forEach(role => {
        let el = document.createElement("option");
        el.text = role.name.substring(5);
        el.value = role.id;
        $('#rolesDeleteUser')[0].appendChild(el);

    });

}

$('#deleteUserButton').click(() => {
    removeUser();
});

async function removeUser() {

    const deleteForm = document.forms["deleteForm"];
    const id = deleteForm.idDeleteUser.value;


    deleteForm.addEventListener("submit", ev => {
        ev.preventDefault();
        fetch("/api/admin/delete/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            $('#topCloseButtonDelete').click();
            $(async function () {
                await getAllUsers();
            })

        }).catch(error => console.log(error))
    })

}
