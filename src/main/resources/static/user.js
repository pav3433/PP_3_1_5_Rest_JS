// navBar and table
fetch("/api/user")
    .then(response => response.json())
    .then(data => {
        document.querySelector('#emailBar').textContent = data.email;
        document.querySelector('#roleBar').textContent = (data.roles.map(role => " " + role.name.substring(5)).join(' '));
        let user = `$(
                    <tr>
                    <td>${data.id}</td>
                    <td>${data.username}</td>
                    <td>${data.salary}</td>
                    <td>${data.email}</td>
                    <td>${data.roles.map(role => " " + role.name.substring(5))}</td>)</tr>`;
        $('#userInfo').append(user);
    })
    .catch(error => console.log(error))
