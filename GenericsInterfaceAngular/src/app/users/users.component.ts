import { Component, OnInit } from '@angular/core';
import { EndpointsService } from '../services/endpoints.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  constructor(private endpointsService: EndpointsService, private router: Router) { }
  message: string = 'prove';
  currentMessage: string = '';
  token: string = '';

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.message) {
      this.message = navigation.message;
    }
    this.token = localStorage.getItem('token') || '';
    console.log(this.token);

    if (this.message === 'prove') {
      this.proveUser();
    }
  }

  showContent(message: string): void {
    this.message = message;
    if (this.message !== this.currentMessage) {
      this.clearTable();
    }
    if (this.message === 'prove') {
      this.proveUser();
    }
  }

  createUser(firstName: string, lastName: string, age: number, email: string, address: string, mobile: string, password: string) {
    this.currentMessage = 'create'
    this.endpointsService.createUser(firstName, lastName, age, email, address, mobile, password, this.token).subscribe(
      response => {
        if (response) {
          this.showToast('createSuccess');
        } else {
          this.showToast('createError');
        }
      },
      error => {
        console.error(error);
        this.showToast('invalid');
      }
    );
  }

  deleteUser(email: string) {
    this.currentMessage = 'delete'
    this.endpointsService.deleteUser(email, this.token).subscribe(
      response => {
        this.showToast('deleteSuccess')
      },
      error => {
        console.error(error);
        this.showToast('deleteError');
      }
    );
  }

  getUser(searchBy: string, searchTerm: string) {
    this.currentMessage = 'consult'
    this.endpointsService.getUser(searchBy, searchTerm, this.token).subscribe(
      response => {
        if (response.length > 0) {
          this.showToast('consultSuccess');
          this.renderUserData(response);
        } else {
          this.showToast('consultInvalid');
        }
      },
      error => {
        console.error(error);
        this.showToast('invalid');
      }
    );
  }
  private renderUserData(usersData: any) {
    interface UserData {
      nombre: string;
      apellidos: string;
      correo: string;
      edad: number;
      direccion: string;
      telefono: string;
    }

    const dataContainer = document.querySelector('.data');
    if (!dataContainer) return;

    dataContainer.innerHTML = '';
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('tableContainer');
    const table = document.createElement('table');
    table.id = 'userData';
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
    const tbody = document.createElement('tbody');
    tbody.id = 'userDataBody';

    usersData.forEach((user: UserData) => {
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

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    dataContainer.appendChild(tableContainer);
  }

  editeUser(email: string, searchTerm: string) {
    this.currentMessage = 'edit'
    this.endpointsService.getUser(email, searchTerm, this.token).subscribe(
      response => {
        if (response) {
          this.showToast('consultSuccess');
          this.renderEditableUserData(response, searchTerm);
        } else {
          this.showToast('consultInvalid');
        }
      },
      error => {
        console.error(error);
        this.showToast('invalid');
      }
    );
  }
  private renderEditableUserData(usersData: any, searchTerm: string) {
    interface UserData {
      nombre: string;
      apellidos: string;
      correo: string;
      edad: number;
      direccion: string;
      telefono: string;
    }

    const dataContainer = document.querySelector('.data');
    if (!dataContainer) return;
    dataContainer.innerHTML = '';
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('tableContainer');
    const table = document.createElement('table');
    table.id = 'userData';
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
    const tbody = document.createElement('tbody');
    tbody.id = 'userDataBody';

    usersData.forEach((user: UserData) => {
      const row = document.createElement('tr');
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

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    dataContainer.appendChild(tableContainer);

    dataContainer.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('form-submit-btn')) {
        const row = (event.target as HTMLElement).closest('tr');
        if (row) {
          const cells = row.querySelectorAll('td');
          const updatedUser = {
            nombre: cells[0].innerText.trim(),
            apellidos: cells[1].innerText.trim(),
            correo: cells[2].innerText.trim(),
            edad: parseInt(cells[3].innerText.trim(), 10),
            direccion: cells[4].innerText.trim(),
            telefono: cells[5].innerText.trim()
          };
          this.edit(searchTerm, updatedUser);
        }
      }
    });
  }
  private edit(email: string, data: any) {
    this.endpointsService.editUser(email, data, this.token).subscribe(
      response => {
        if (response) {
          this.showToast('editSuccess')
        } else {
          this.showToast('editError');
        }
      },
      error => {
        console.error(error);
        this.showToast('invalid');
      }
    );
  }

  proveUser() {
    this.currentMessage = 'prove'
    this.endpointsService.checkUser(this.token).subscribe(
      response => {
        if (response.length > 0) {
          this.showToast('consultSuccess');
          this.renderApprovalUserData(response);
        } else {
          this.showToast('verificyInvalid');
        }
      },
      error => {
        console.error(error);
        this.showToast('invalid');
      }
    );
  }
  private renderApprovalUserData(usersData: any) {
    interface UserData {
      nombre: string;
      apellidos: string;
      correo: string;
    }

    const dataContainer = document.querySelector('.data');
    if (!dataContainer) return;

    dataContainer.innerHTML = '';
    const tableContainer = document.createElement('div');
    tableContainer.classList.add('tableContainer');
    const table = document.createElement('table');
    table.id = 'userData';
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
    const tbody = document.createElement('tbody');
    tbody.id = 'userDataBody';

    usersData.forEach((user: UserData) => {
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

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    dataContainer.appendChild(tableContainer);

    // Agregar evento de clic a los botones de aprobación
    const approveButtons = document.querySelectorAll('.true');
    approveButtons.forEach(button => {
      button.addEventListener('click', () => {
        const row = (button.closest('tr') as HTMLElement);
        if (row) {
          const email = row.querySelector('td:nth-child(3)')?.textContent?.trim();
          if (email) {
            this.checkRegister(email);
          }
        }
      });
    });

    // Agregar evento de clic a los botones de eliminación
    const deleteButtons = document.querySelectorAll('.false');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const row = (button.closest('tr') as HTMLElement);
        if (row) {
          const email = row.querySelector('td:nth-child(3)')?.textContent?.trim();
          if (email) {
            this.deleteUser(email);
          }
        }
      });
    });
  }

  private checkRegister(email: string) {
    this.endpointsService.proveUsers(email, this.token).subscribe(
      response => {
        this.showToast('verificySuccess');
      },
      error => {
        console.error(error);
        this.showToast('verificyError');
      }
    );
  }

  private clearTable() {
    const dataContainer = document.querySelector('.data');
    if (dataContainer) {
        dataContainer.innerHTML = '';
    }
  }

  private showToast(message: string): void {
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
    if (toastBox){
      toastBox.appendChild(toast);
    }

    // Eliminar el toast al hacer clic fuera de él
    const handleClickOutside = (event: MouseEvent) => {
      if (!toast.contains(event.target as Node)) {
          toast.remove();
          document.removeEventListener('click', handleClickOutside);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Eliminar el toast automáticamente después de 6 segundos
    setTimeout(() => {
      toast.remove();
      document.removeEventListener('click', handleClickOutside);
    }, 6000);
  }
}
