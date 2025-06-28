// Variables globales
let usuarioIdParaEliminar = null;

// Función para toggle del menú de opciones
window.toggleMenuOpciones = function(userId) {
  // Cerrar todos los menús abiertos
  document.querySelectorAll('.menu-opciones').forEach(menu => {
    if (menu.id !== `menu-opciones-${userId}`) {
      menu.classList.add('hidden');
    }
  });
  
  // Toggle del menú actual
  const menu = document.getElementById(`menu-opciones-${userId}`);
  if (menu) {
    menu.classList.toggle('hidden');
    
    // Focus en el primer botón cuando se abre
    if (!menu.classList.contains('hidden')) {
      const primerBoton = menu.querySelector('.opcion-menu');
      primerBoton?.focus();
    }
  }
};

// Función para editar usuario
window.editarUsuario = function(userId) {
  console.log('Editar usuario con ID:', userId);
  cerrarTodosLosMenus();
  
  // Buscar los datos del usuario en la tabla
  const filaUsuario = encontrarFilaUsuario(userId);
  if (filaUsuario) {
    const nombre = filaUsuario.cells[0].textContent.trim().split(' ')[0];
    const apellido = filaUsuario.cells[0].textContent.trim().split(' ').slice(1).join(' ');
    const email = filaUsuario.cells[1].textContent.trim();
    const sucursal = filaUsuario.cells[3].textContent.trim();
    
    // Pre-llenar el modal de edición
    document.getElementById('edit_usuario_id').value = userId;
    document.getElementById('edit_nombre').value = nombre;
    document.getElementById('edit_apellido').value = apellido;
    document.getElementById('edit_email').value = email;
    document.getElementById('edit_contrasena').value = ''; // Siempre vacío
    
    // Seleccionar la sucursal correcta
    const selectSucursal = document.getElementById('edit_centro_salud');
    for (let option of selectSucursal.options) {
      if (option.textContent.trim() === sucursal) {
        option.selected = true;
        break;
      }
    }
    
    // Abrir modal
    abrirModalEditarUsuario();
  } else {
    console.error('No se pudo encontrar la fila del usuario');
    alert('Error: No se pudieron cargar los datos del usuario');
  }
};

// Función para eliminar usuario (ahora abre el popup)
window.eliminarUsuario = function(userId) {
  console.log('Función eliminarUsuario llamada con ID:', userId);
  usuarioIdParaEliminar = userId;
  mostrarPopupConfirmacion();
  cerrarTodosLosMenus();
};

// Funciones del popup de confirmación
window.mostrarPopupConfirmacion = function() {
  console.log('Función mostrarPopupConfirmacion llamada');
  const popup = document.getElementById('popup-confirmacion');
  console.log('Elemento popup encontrado:', popup);
  
  if (popup) {
    console.log('Clases antes de mostrar:', popup.classList.toString());
    popup.classList.remove('hidden');
    popup.classList.add('mostrar');
    console.log('Clases después de mostrar:', popup.classList.toString());
    console.log('Estilos computados del popup:', window.getComputedStyle(popup).display);
    
    // Focus en el botón cancelar después de un pequeño delay
    setTimeout(() => {
      const btnCancelar = popup.querySelector('.btn-popup-cancelar');
      btnCancelar?.focus();
    }, 100);
  } else {
    console.error('No se encontró el elemento popup-confirmacion');
  }
};

window.cerrarPopupConfirmacion = function() {
  const popup = document.getElementById('popup-confirmacion');
  if (popup) {
    popup.classList.add('hidden');
    popup.classList.remove('mostrar');
    usuarioIdParaEliminar = null;
  }
};

window.confirmarEliminacion = function() {
  if (usuarioIdParaEliminar) {
    console.log('Eliminar usuario con ID:', usuarioIdParaEliminar);
    // Aquí implementar la lógica de eliminación real
    alert(`Usuario ${usuarioIdParaEliminar} eliminado - Por implementar`);
    
    cerrarPopupConfirmacion();
  }
};

// Función auxiliar para cerrar todos los menús
function cerrarTodosLosMenus() {
  const todosLosMenus = document.querySelectorAll('.menu-opciones');
  todosLosMenus.forEach(menu => menu.classList.add('hidden'));
}

// Función para buscar usuarios en tiempo real (mejorada)
window.buscarUsuarios = function() {
  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput.value.toLowerCase().trim();
  const rows = document.querySelectorAll('tbody tr');
  
  let resultadosEncontrados = 0;
  
  rows.forEach(row => {
    // Verificar si es la fila de "No se encontraron usuarios"
    if (row.querySelector('td[colspan]')) {
      return;
    }
    
    const nombre = row.cells[0]?.textContent.toLowerCase() || '';
    const email = row.cells[1]?.textContent.toLowerCase() || '';
    const rol = row.cells[2]?.textContent.toLowerCase() || '';
    const sucursal = row.cells[3]?.textContent.toLowerCase() || '';
    
    // Buscar en nombre, email, rol y sucursal
    const coincide = nombre.includes(searchTerm) || 
                    email.includes(searchTerm) || 
                    rol.includes(searchTerm) ||
                    sucursal.includes(searchTerm);
    
    if (coincide || searchTerm === '') {
      row.style.display = '';
      resultadosEncontrados++;
    } else {
      row.style.display = 'none';
    }
  });
  
  // Mostrar/ocultar mensaje de no encontrados
  mostrarMensajeNoEncontrados(resultadosEncontrados === 0 && searchTerm !== '');
};

// Función para mostrar mensaje cuando no hay resultados
function mostrarMensajeNoEncontrados(mostrar) {
  let mensajeRow = document.querySelector('#mensaje-no-encontrados');
  
  if (mostrar && !mensajeRow) {
    // Crear fila de mensaje si no existe
    const tbody = document.querySelector('tbody');
    mensajeRow = document.createElement('tr');
    mensajeRow.id = 'mensaje-no-encontrados';
    mensajeRow.innerHTML = '<td colspan="5" class="text-center text-gray-500 py-4">No se encontraron usuarios con esos criterios de búsqueda.</td>';
    tbody.appendChild(mensajeRow);
  } else if (!mostrar && mensajeRow) {
    // Eliminar mensaje si existe y no debe mostrarse
    mensajeRow.remove();
  }
};

// Función para abrir modal de usuario
window.abrirModalUsuario = function() {
  console.log('Abrir modal para agregar usuario');
  const modal = document.getElementById('modal-usuario');
  if (modal) {
    modal.classList.remove('hidden');
    
    // Focus en el primer input después de un pequeño delay
    setTimeout(() => {
      const primerInput = modal.querySelector('input[name="nombre"]');
      primerInput?.focus();
    }, 100);
  }
};

// Función para cerrar modal de usuario
window.cerrarModalUsuario = function() {
  const modal = document.getElementById('modal-usuario');
  if (modal) {
    modal.classList.add('hidden');
    
    // Limpiar el formulario
    const form = document.getElementById('form-usuario');
    if (form) {
      form.reset();
    }
  }
};

// Función para crear usuario (conectar con la base de datos)
window.crearUsuario = function(formData) {
  // Obtener el token CSRF del formulario
  const form = document.getElementById('form-usuario');
  const csrfToken = form.querySelector('[name=csrfmiddlewaretoken]')?.value;
  
  if (!csrfToken) {
    console.error('Token CSRF no encontrado');
    alert('Error de seguridad. Por favor, recarga la página e inténtalo de nuevo.');
    return;
  }
  
  // Preparar los datos para enviar
  const data = {
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    email: formData.get('email'),
    contrasena: formData.get('contrasena'),
    centro_salud: formData.get('centro_salud')
  };
  
  // Realizar la petición POST
  fetch('/users/crear/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      // Cerrar el modal
      cerrarModalUsuario();
      
      // Mostrar mensaje de éxito
      alert('Usuario creado exitosamente');
      
      // Recargar la página para mostrar el nuevo usuario
      window.location.reload();
    } else {
      // Mostrar error específico
      alert('Error al crear usuario: ' + (result.error || 'Error desconocido'));
    }
  })
  .catch(error => {
    console.error('Error al crear usuario:', error);
    alert('Error al crear usuario. Por favor, inténtalo de nuevo.');
  });
};

// Función auxiliar para encontrar la fila de un usuario por ID
function encontrarFilaUsuario(userId) {
  const rows = document.querySelectorAll('tbody tr');
  for (let row of rows) {
    // Buscar el botón de opciones que contenga el userId
    const btnOpciones = row.querySelector(`[onclick*="${userId}"]`);
    if (btnOpciones) {
      return row;
    }
  }
  return null;
}

// Funciones del modal de editar usuario
window.abrirModalEditarUsuario = function() {
  console.log('Abrir modal para editar usuario');
  const modal = document.getElementById('modal-editar-usuario');
  if (modal) {
    modal.classList.remove('hidden');
    
    // Focus en el primer campo
    setTimeout(() => {
      const primerCampo = modal.querySelector('#edit_nombre');
      primerCampo?.focus();
    }, 100);
  }
};

window.cerrarModalEditarUsuario = function() {
  console.log('Cerrar modal de editar usuario');
  const modal = document.getElementById('modal-editar-usuario');
  if (modal) {
    modal.classList.add('hidden');
    
    // Limpiar formulario
    const form = document.getElementById('form-editar-usuario');
    if (form) {
      form.reset();
    }
  }
};

// Función para actualizar usuario
async function actualizarUsuario(formData) {
  console.log('Actualizando usuario...');
  
  try {
    // Convertir FormData a objeto
    const data = {
      usuario_id: formData.get('usuario_id'),
      nombre: formData.get('nombre').trim(),
      apellido: formData.get('apellido').trim(),
    };
    
    // Solo incluir contraseña si se proporcionó
    const contrasena = formData.get('contrasena').trim();
    if (contrasena) {
      data.contrasena = contrasena;
    }
    
    console.log('Datos a enviar:', data);
    
    // Obtener el token CSRF
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    const response = await fetch('/users/editar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('Respuesta del servidor:', result);
    
    if (result.success) {
      alert('Usuario actualizado exitosamente');
      cerrarModalEditarUsuario();
      
      // Recargar la página para mostrar los cambios
      window.location.reload();
    } else {
      alert(`Error: ${result.error}`);
    }
    
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    alert('Error de conexión. Por favor, intenta nuevamente.');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log('Sistema de gestión de usuarios cargado');
  
  // Inicializar el searchbar
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    // Evento para búsqueda en tiempo real
    searchInput.addEventListener('input', buscarUsuarios);
    
    // Limpiar búsqueda con Escape
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        searchInput.value = '';
        buscarUsuarios();
        searchInput.blur();
      }
    });
  }
  
  // Event listener para el formulario de crear usuario
  const formUsuario = document.getElementById('form-usuario');
  if (formUsuario) {
    formUsuario.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevenir el envío normal del formulario
      
      // Validar que todos los campos requeridos estén llenos
      const formData = new FormData(formUsuario);
      const requiredFields = ['nombre', 'apellido', 'email', 'contrasena', 'centro_salud'];
      
      for (let field of requiredFields) {
        if (!formData.get(field) || formData.get(field).trim() === '') {
          alert(`Por favor, completa el campo ${field}`);
          return;
        }
      }
      
      // Validar formato de email
      const email = formData.get('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un email válido');
        return;
      }
      
      // Validar longitud de contraseña
      const password = formData.get('contrasena');
      if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      
      // Si todas las validaciones pasan, crear el usuario
      crearUsuario(formData);
    });
  }
  
  // Event listener para el formulario de editar usuario
  const formEditarUsuario = document.getElementById('form-editar-usuario');
  if (formEditarUsuario) {
    formEditarUsuario.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevenir el envío normal del formulario
      
      // Validar que los campos requeridos estén llenos
      const formData = new FormData(formEditarUsuario);
      const requiredFields = ['nombre', 'apellido'];
      
      for (let field of requiredFields) {
        if (!formData.get(field) || formData.get(field).trim() === '') {
          alert(`Por favor, completa el campo ${field}`);
          return;
        }
      }
      
      // Validar longitud de contraseña solo si se proporcionó
      const password = formData.get('contrasena').trim();
      if (password && password.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
      
      // Si todas las validaciones pasan, actualizar el usuario
      actualizarUsuario(formData);
    });
  }
  
  // Cerrar menús al hacer clic fuera
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.contenedor-opciones')) {
      cerrarTodosLosMenus();
    }
  });
  
  // Cerrar con tecla Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      cerrarTodosLosMenus();
      cerrarPopupConfirmacion();
      cerrarModalUsuario();
      cerrarModalEditarUsuario();
    }
  });
  
  // Cerrar popup al hacer clic en el overlay
  document.addEventListener('click', function(event) {
    const popup = document.getElementById('popup-confirmacion');
    if (event.target === popup) {
      cerrarPopupConfirmacion();
    }
    
    // Cerrar modal de usuario al hacer clic en el overlay
    const modalUsuario = document.getElementById('modal-usuario');
    if (event.target === modalUsuario) {
      cerrarModalUsuario();
    }
    
    // Cerrar modal de editar usuario al hacer clic en el overlay
    const modalEditarUsuario = document.getElementById('modal-editar-usuario');
    if (event.target === modalEditarUsuario) {
      cerrarModalEditarUsuario();
    }
  });
});
