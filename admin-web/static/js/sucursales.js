// Hacer que las funciones estén disponibles globalmente
window.abrirModalSucursal = function () {
  const modal = document.getElementById('modal-sucursal');
  modal?.classList.remove('hidden');
};

window.cerrarModalSucursal = function () {
  const modal = document.getElementById('modal-sucursal');
  modal?.classList.add('hidden');
};

// Manejar envío del formulario
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-sucursal');
  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    console.log('Datos del formulario:', data);

    cerrarModalSucursal();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-sucursal');

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
});

// CSRF Token helper
function getCSRFToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue;
}
