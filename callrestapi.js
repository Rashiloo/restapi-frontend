const API_URL = "https://users-restapi-mysql.onrender.com/api/users"; // Ajusta el puerto si es distinto

function getUsers() {
    $("#resultado").html("<p class='loading'>Cargando usuarios...</p>");

    $.ajax({
        url: API_URL,
        type: "GET",
        success: function (response) {
            const users = response.users;
            if (!users.length) {
                $("#resultado").html("<p>No hay usuarios registrados.</p>");
                return;
            }

            let table = `<table class='user-table'><thead><tr>
                <th>ID</th><th>Nombre</th><th>Correo</th><th>Edad</th><th>Comentarios</th><th>Acciones</th>
                </tr></thead><tbody>`;

            users.forEach(user => {
                table += `<tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.age}</td>
                    <td>${user.comments || ""}</td>
                    <td>
                        <button class='btn-sm btn-warning' onclick='loadUser(${JSON.stringify(user)})'>Editar</button>
                        <button class='btn-sm btn-danger' onclick='deleteUser(${user.id})'>Eliminar</button>
                    </td>
                </tr>`;
            });

            table += "</tbody></table>";
            $("#resultado").html(table);
        },
        error: function (err) {
            console.error(err);
            $("#resultado").html("<p class='loading'>Error al obtener los usuarios.</p>");
        }
    });
}

function postUser() {
    const user = getFormData();
    if (!user.name || !user.email) {
        alert("Nombre y correo son obligatorios.");
        return;
    }

    $.ajax({
        url: API_URL,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function () {
            clearForm();
            getUsers();
        },
        error: function (err) {
            alert("Error al crear usuario");
            console.error(err);
        }
    });
}

function putUser() {
    const id = $("#id").val();
    if (!id) {
        alert("Debes seleccionar un usuario para actualizar.");
        return;
    }

    const user = getFormData();
    user.id = parseInt(id, 10); // Asegurar que el ID sea número

    $.ajax({
        url: `${API_URL}/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function () {
            clearForm();
            getUsers();
            alert("Usuario actualizado correctamente"); // Feedback positivo
        },
        error: function (err) {
            console.error("Detalles del error:", err.responseJSON || err);
            alert(`Error al actualizar usuario. Detalles en consola (F12)`);
        }
    });
}

function deleteUser(id) {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    $.ajax({
        url: `${API_URL}/${id}`,
        type: "DELETE",
        success: function () {
            getUsers();
        },
        error: function (err) {
            alert("Error al eliminar usuario");
            console.error(err);
        }
    });
}

function loadUser(user) {
    $("#id").val(user.id);
    $("#name").val(user.name);
    $("#email").val(user.email);
    $("#age").val(user.age);
    $("#comments").val(user.comments || "");
}

function getFormData() {
    return {
        name: $("#name").val(),
        email: $("#email").val(),
        age: parseInt($("#age").val(), 10),
        comments: $("#comments").val()
    };
}

function clearForm() {
    $("#id").val('');
    $("#name").val('');
    $("#email").val('');
    $("#age").val('');
    $("#comments").val('');
}



