// Variables globales
let sucursalIdParaEliminar = null;

// Hacer que las funciones estén disponibles globalmente
window.abrirModalSucursal = function () {
  const modal = document.getElementById('modal-sucursal');
  modal?.classList.remove('hidden');
};

window.cerrarModalSucursal = function () {
  const modal = document.getElementById('modal-sucursal');
  modal?.classList.add('hidden');
};

// Funciones del menú de opciones
window.toggleMenu = function(event, sucursalId) {
  event.stopPropagation();
  
  // Cerrar otros menús abiertos
  const todosLosMenus = document.querySelectorAll('.menu-opciones');
  todosLosMenus.forEach(menu => {
    if (menu.id !== `menu-opciones-${sucursalId}`) {
      menu.classList.add('hidden');
    }
  });
  
  // Toggle del menú actual
  const menu = document.getElementById(`menu-opciones-${sucursalId}`);
  if (menu) {
    menu.classList.toggle('hidden');
    
    // Focus en el primer botón cuando se abre
    if (!menu.classList.contains('hidden')) {
      const primerBoton = menu.querySelector('.opcion-menu');
      primerBoton?.focus();
    }
  }
};

window.editarSucursal = function(sucursalId) {
  console.log('Editar sucursal:', sucursalId);
  // Aquí implementar la lógica de edición
  cerrarTodosLosMenus();
};

window.eliminarSucursal = function(sucursalId) {
  sucursalIdParaEliminar = sucursalId;
  mostrarPopupConfirmacion();
  cerrarTodosLosMenus();
};

// Funciones del popup de confirmación
window.mostrarPopupConfirmacion = function() {
  const popup = document.getElementById('popup-confirmacion');
  if (popup) {
    popup.classList.remove('hidden');
    
    // Focus en el botón cancelar
    const btnCancelar = popup.querySelector('.btn-popup-cancelar');
    btnCancelar?.focus();
  }
};

window.cerrarPopupConfirmacion = function() {
  const popup = document.getElementById('popup-confirmacion');
  if (popup) {
    popup.classList.add('hidden');
    sucursalIdParaEliminar = null;
  }
};

window.confirmarEliminacion = function() {
  if (sucursalIdParaEliminar) {
    console.log('Eliminando sucursal:', sucursalIdParaEliminar);
    // Aquí implementar la lógica de eliminación real
    // Por ejemplo: hacer petición DELETE al backend
    
    cerrarPopupConfirmacion();
  }
};

// Función auxiliar para cerrar todos los menús
function cerrarTodosLosMenus() {
  const todosLosMenus = document.querySelectorAll('.menu-opciones');
  todosLosMenus.forEach(menu => menu.classList.add('hidden'));
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Cerrar menús al hacer clic fuera
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.contenedor-opciones')) {
      cerrarTodosLosMenus();
    }
  });
  
  // Cerrar con tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cerrarTodosLosMenus();
      cerrarPopupConfirmacion();
    }
  });
  
  // Manejar envío del formulario de crear sucursal
  const form = document.getElementById('form-sucursal');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const datos = {
        nombre: formData.get('nombre'),
        ubicacion: formData.get('ubicacion'),
        direccion: formData.get('direccion'),
        fono: formData.get('fono'),
      };

      try {
        const response = await fetch(window.location.origin + '/api/sucursales/crear/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          body: JSON.stringify(datos),
        });

        if (response.ok) {
          const resultado = await response.json();
          console.log('Sucursal creada:', resultado);
          cerrarModalSucursal();
          location.reload();
        } else {
          console.error('Error al crear la sucursal');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});

// CSRF Token helper
function getCSRFToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
}
