// Hacer que las funciones estén disponibles globalmente
window.abrirModalSucursal = function () {
  const modal = document.getElementById('modal-sucursal');
  modal?.classList.remove('hidden');
};

window.cerrarModalSucursal = function () {
  const modal = document.getElementById('modal-sucursal');
  modal?.classList.add('hidden');
};

// Manejar envío del formulario (opcionalmente puedes hacer fetch aquí)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-sucursal');
  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    console.log('Datos del formulario:', data);

    // Aquí podrías enviar con fetch
    cerrarModalSucursal(); // Oculta el modal después de guardar
  });
});