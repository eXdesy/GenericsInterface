function showContent(page) {
  var mainContent = document.getElementById("formContent");
  var content = "";

  // Dependiendo de la opción seleccionada, cargar el contenido apropiado
  switch (page) {
    case 'create':
      content = `
      <form class="form" id="createUserForm" action="/createUser" method="post">
        <h1>Crear Usuario</h1>
          <div class="input-form">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input name="firstName" id="firstName" type="text" required>
            </div>
          <div class="form-group">
            <label for="lastName">Apellidos</label>
            <input name="lastName" id="lastName" type="text" required>
          </div>
          <div class="form-group">
            <label for="age">Edad</label>
            <input name="age" id="age" type="number" required>
          </div>
          <div class="form-group">
            <label for="email">Correo</label>
            <input name="email" id="email" type="email" required>
          </div>
          <div class="form-group">
            <label for="address">Direccion</label>
            <input name="address" id="address" type="text" required>
          </div>
          <div class="form-group">
            <label for="mobile">Telefono</label>
            <input name="mobile" id="mobile" type="number" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input name="password" id="password" type="password" required>
          </div>
        </div>
        <button type="submit" class="form-submit-btn">Crear</button>
      </form>
      `;
      break;

    case 'edit':
      content = `
        <form class="form" id="searchForm" action="/getUser" method="post">
          <h1>Editar Usuario</h1>
          <div class="input-form form-edit">
            <div class="form-group">
              <label for="email">Correo del usuario a editar</label>
              <input name="email" id="email" type="email" required>
            </div>
            <div class="form-group">
              <button type="submit" class="form-submit-btn">Buscar</button>
            </div>
          </div>
        </form>
        `;
      break;

    case 'delete':
      content = `
        <form class="form" id="deleteUserForm" action="/deleteUser" method="post">
          <h1>Eliminar Usuario</h1>
          <div class="input-form form-delete">
              <div class="form-group">
                <label for="email">Correo</label>
                <input name="email" id="email" type="email" required>
              </div>
              <div class="form-group">
                <button type="submit" class="form-submit-btn">Eliminar</button>
              </div>
          </div>
        </form>
        `;
      break;
      
    case 'consult':
      content = `
      <form class="form" id="searchForm" action="/getUser" method="post">
        <h1>Buscar Usuario</h1>
        <div class="input-form">
          <div class="form-group">
            <label for="searchBy">Buscar por:</label>
            <select name="searchBy" id="searchBy" required>
              <option value="nombre">Nombre</option>
              <option value="apellidos">Apellidos</option>
              <option value="edad">edad</option>
              <option value="correo">Correo</option>
              <option value="direccion">Direccion</option>
              <option value="telefono">Telefono</option>
            </select>
          </div>
          <div class="form-group">
            <label for="searchTerm">Término de búsqueda:</label>
            <input name="searchTerm" id="searchTerm" type="text" required>
          </div>
          <div class="form-group">
            <button type="submit" class="form-submit-btn">Buscar</button>
          </div>
        </div>
      </form>
      `;
      break;

    case 'prove':
      content = `
        <h1>Aprobar Usuario</h1>
      `;
      break;
  }
  // Actualizar el contenido de <main>
  mainContent.innerHTML = content;

  // Agregar evento de escucha para el envío del formulario
  if (page === 'create') {
    document.getElementById('createUserForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
  
      const formData = new FormData(event.target); // Obtener datos del formulario
  
      try {
        const response = await fetch('/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData)) // Convertir FormData a objeto JSON y enviar al servidor
        });
  
        if (!response.ok) {
          showToast('createError');
        } else {
          showToast('createSuccess');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('createError');
      }
    });
  }
  
  if (page === 'delete') {
    document.getElementById('deleteUserForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
  
      const formData = new FormData(event.target); // Obtener datos del formulario
  
      try {
        const response = await fetch('/deleteUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData)) // Convertir FormData a objeto JSON y enviar al servidor
        });
  
        if (!response.ok) {
          showToast('deleteError');
        } else {
          showToast('deleteSuccess');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('deleteError');
      }
    });
  }
  
  if (page === 'edit') {
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
  
        const formData = new FormData(event.target); // Obtener datos del formulario
        const searchBy = 'correo'; // Obtener el campo de búsqueda seleccionado
        const searchTerm = formData.get('email'); // Obtener el término de búsqueda
  
        try {
            const response = await fetch('/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchBy, searchTerm }) // Enviar el campo y el término de búsqueda al servidor
            });
  
            if (!response.ok) {
                showToast('consultInvalid');
            } else {
                showToast('consultSuccess');
            }
  
            const usersData = await response.json(); // Convertir la respuesta a JSON (un array de usuarios)
  
            if (usersData.length > 0) {
              const dataContainer = document.querySelector('.data');
              dataContainer.innerHTML = '';
              // Crear el contenedor de la tabla
              const tableContainer = document.createElement('div');
              tableContainer.classList.add('tableContainer');
              // Crear la tabla
              const table = document.createElement('table');
              table.id = 'userData';
              // Crear el encabezado de la tabla
              const thead = document.createElement('thead');
              thead.innerHTML = `
                  <tr>
                      <th>Nombre</th>
                      <th>Apellidos</th>
                      <th>Correo</th>
                      <th>Edad</th>
                      <th>Direccion</th>
                      <th>Telefono</th>
                      <th>Acciones</th>
                  </tr>
              `;
              table.appendChild(thead);
              // Crear el cuerpo de la tabla
              const tbody = document.createElement('tbody');
              tbody.id = 'userDataBody';
              // Agregar filas para cada usuario
              usersData.forEach(user => {
                  const row = document.createElement('tr');
                  row.id = 'userData';
                  row.innerHTML = `
                      <td contenteditable="true">${user.nombre}</td>
                      <td contenteditable="true">${user.apellidos}</td>
                      <td contenteditable="true">${user.correo}</td>
                      <td contenteditable="true">${user.edad}</td>
                      <td contenteditable="true">${user.direccion}</td>
                      <td contenteditable="true">${user.telefono}</td>
                      <td><button id="true" class="form-submit-btn">Editar</button></td>
                  `;
                  tbody.appendChild(row);
              });
              // Agregar el cuerpo de la tabla a la tabla
              table.appendChild(tbody);
              // Agregar la tabla al contenedor de la tabla
              tableContainer.appendChild(table);
              // Agregar el contenedor de la tabla al contenedor de datos
              dataContainer.appendChild(tableContainer);
  
              dataContainer.addEventListener('click', function(event) {
                if (event.target.classList.contains('form-submit-btn')) {
                  const row = event.target.closest('tr');
                  const cells = row.querySelectorAll('td');
                  const updatedUser = {
                    nombre: cells[0].innerText.trim(),
                    apellidos: cells[1].innerText.trim(),
                    correo: cells[2].innerText.trim(),
                    edad: parseInt(cells[3].innerText.trim()),
                    direccion: cells[4].innerText.trim(),
                    telefono: cells[5].innerText.trim()
                  };
                  
                  edit(searchTerm, updatedUser);
                }
              });
            } else {
                // Si no se encontraron usuarios, mostrar un mensaje de error
                showToast('consultInvalid');
                const dataContainer = document.querySelector('.data');
                dataContainer.innerHTML = '';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
  
    async function edit(email, data) {
        try {
            const response = await fetch('/editUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, data })
            });
            console.log(response);
  
            if (!response.ok) {
                showToast('editError');
            } else {
                showToast('editSuccess');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('editError');
        }
    }
  }

  // Agregar el evento submit al formulario de búsqueda
  if (page === 'consult') {
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

      const formData = new FormData(event.target); // Obtener datos del formulario
      const searchBy = formData.get('searchBy'); // Obtener el campo de búsqueda seleccionado
      const searchTerm = formData.get('searchTerm'); // Obtener el término de búsqueda

      try {
        const response = await fetch('/getUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ searchBy, searchTerm }) // Enviar el campo y el término de búsqueda al servidor
        });

        if (!response.ok) {
          showToast('consultInvalid');
        } else {
          showToast('consultSuccess');
        }

        const usersData = await response.json(); // Convertir la respuesta a JSON (un array de usuarios)

        if (usersData.length > 0) {

          const dataContainer = document.querySelector('.data');
          dataContainer.innerHTML = '';
          // Crear el contenedor de la tabla
          const tableContainer = document.createElement('div');
          tableContainer.classList.add('tableContainer');
          // Crear la tabla
          const table = document.createElement('table');
          table.id = 'userData';
          // Crear el encabezado de la tabla
          const thead = document.createElement('thead');
          thead.innerHTML = `
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Edad</th>
              <th>Direccion</th>
              <th>Telefono</th>
            </tr>
          `;
          table.appendChild(thead);
          // Crear el cuerpo de la tabla
          const tbody = document.createElement('tbody');
          tbody.id = 'userDataBody';
          // Agregar filas para cada usuario
          usersData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${user.nombre}</td>
              <td>${user.apellidos}</td>
              <td>${user.correo}</td>
              <td>${user.edad} años</td>
              <td>${user.direccion}</td>
              <td>${user.telefono}</td>
            `;
            tbody.appendChild(row);
          });
          // Agregar el cuerpo de la tabla a la tabla
          table.appendChild(tbody);
          // Agregar la tabla al contenedor de la tabla
          tableContainer.appendChild(table);
          // Agregar el contenedor de la tabla al contenedor de datos
          dataContainer.appendChild(tableContainer);          
        } else {
          // Si no se encontraron usuarios, mostrar un mensaje de error
          showToast('consultInvalid');
          const dataContainer = document.querySelector('.data');
          dataContainer.innerHTML = '';
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  } else {
    // Si no estás en la página de consulta, limpiar el contenedor de tarjetas
    const dataContainer = document.querySelector('.data');
    dataContainer.innerHTML = '';
  }

  
  if (page === 'prove') {
    (async () => { // Utilizando una función asincrónica autoinvocada
      try {
        const response = await fetch('/getUserRegister', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
  
        const usersData = await response.json();
  
        if (usersData.length > 0) {
          const dataContainer = document.querySelector('.data');
          dataContainer.innerHTML = '';
        
          // Crear el contenedor de la tabla
          const tableContainer = document.createElement('div');
          tableContainer.classList.add('tableContainer');
        
          // Crear la tabla
          const table = document.createElement('table');
          table.id = 'userData';
        
          // Crear el encabezado de la tabla
          const thead = document.createElement('thead');
          thead.innerHTML = `
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          `;
          table.appendChild(thead);
        
          // Crear el cuerpo de la tabla
          const tbody = document.createElement('tbody');
          tbody.id = 'userDataBody';
        
          // Agregar filas para cada usuario
          usersData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${user.nombre}</td>
              <td>${user.apellidos}</td>
              <td>${user.correo}</td>
              <td class="buttons">
                <button type="button" id="true" class="true form-submit-btn"><i class="fas fa-check"></i></button>
                <button type="button" id="false" class="false form-submit-btn"><i class="fas fa-times"></i></button>
              </td>
            `;
            tbody.appendChild(row);
          });
        
          // Agregar el cuerpo de la tabla a la tabla
          table.appendChild(tbody);
        
          // Agregar la tabla al contenedor de la tabla
          tableContainer.appendChild(table);
        
          // Agregar el contenedor de la tabla al contenedor de datos
          dataContainer.appendChild(tableContainer);
        
          // Agregar evento de clic a los botones de aprobación
          const approveButtons = document.querySelectorAll('.true');
          approveButtons.forEach(button => {
            button.addEventListener('click', () => {
              const email = button.parentElement.previousElementSibling.textContent;
              checkRegister(email);
            });
          });
        
          // Agregar evento de clic a los botones de eliminación
          const deleteButtons = document.querySelectorAll('.false');
          deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
              const email = button.parentElement.previousElementSibling.textContent;
              deleteUser(email);
            });
          });
        } else {
          showToast('verificyInvalid');
        }
        
      } catch (error) {
        console.error('Error:', error);
      }
    })();

    // Función para aprobar un usuario
    async function checkRegister(email) {
      try {
        const response = await fetch('/checkRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email }) // Pasar el correo del usuario a aprobar
        });

        if (!response.ok) {
          showToast('verificyError');
        } else {
          showToast('verificySuccess');
          setTimeout(() => {
            location.reload();
          }, 6000);
        }
      } catch (error) {
        console.error('Error al aprobar el usuario:', error);
      }
    }
    // Función para eliminar un usuario
    async function deleteUser(email) {
        try {
          const response = await fetch('/deleteUser', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: email }) // Pasar el correo del usuario a eliminar
          });

          if (!response.ok) {
            showToast('declineError');
          } else {
            showToast('declineSuccess');
            setTimeout(() => {
              location.reload();
            }, 6000);
          }
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
        }
    }
  } else {
    // Si no estás en la página de consulta, limpiar el contenedor de tarjetas
    const dataContainer = document.querySelector('.data');
    dataContainer.innerHTML = '';
  }
}

function showToast(message) {
  let toastBox = document.getElementById('toastBox');
  let toast = document.createElement('div');
  toast.classList.add('toast');
  let content = "";

  switch (message) {
    case 'verificySuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue verificado corectamente';
      break;
    case 'verificyError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Error al verificar usuario';
      break;

    case 'declineSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue rechazado corectamente';
      break;
    case 'declineError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Error al rechazar usuario';
      break;
    case 'verificyInvalid':
      toast.classList.add('invalid');
      content = '<i class="fa-solid fa-circle-exclamation"></i> No hay ningun usuario pendiente en verificar';
      break;

    case 'createSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue creado correctamente';
      break;
    case 'createError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Ha ocurrido un error al crear el usuario';
      break;

    case 'editSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> Los datos fueron guardados correctamente';
      break;
    case 'editError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Ha ocurrido un error al modificar los datos';
      break;

    case 'deleteSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> El usuario fue eliminado corectamente';
      break;
    case 'deleteError':
      toast.classList.add('error');
      content = '<i class="fa-solid fa-circle-xmark"></i> Error al eliminar usuario';
      break;

    case 'consultSuccess':
      toast.classList.add('success');
      content = '<i class="fa-solid fa-circle-check"></i> Los usuarios segun tu busqueda:';
      break;
    case 'consultInvalid':
      toast.classList.add('invalid');
      content = '<i class="fa-solid fa-circle-exclamation"></i> No ha encontrado ningun usuario';
      break;
    
    case 'invalid':
      toast.classList.add('invalid');
      content = '<i class="fa-solid fa-circle-exclamation"></i></i> Entrada de datos no válida';
      break;
  }

  toast.innerHTML = content;
  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 6000);

  document.addEventListener('click', function(event) {
    if (!toast.contains(event.target)) {
      toast.remove();
    }
  });
}