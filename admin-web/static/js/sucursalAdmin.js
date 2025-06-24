function showTab(tab) {
  const tabs = {
    resumen: {
      button: document.getElementById("tabResumen"),
      content: document.getElementById("contenidoResumen")
    },
    personal: {
      button: document.getElementById("tabPersonal"),
      content: document.getElementById("contenidoPersonal")
    },
    pacientes: {
      button: document.getElementById("tabPacientes"),
      content: document.getElementById("contenidoPacientes")
    }
  };

  const activeClasses = ["bg-white", "shadow", "border", "border-gray-200", "text-gray-900"];
  const inactiveClasses = ["bg-transparent", "shadow-none", "border-none", "text-gray-500"];

  for (const key in tabs) {
    const { button, content } = tabs[key];
    if (key === tab) {
      button.classList.add(...activeClasses);
      button.classList.remove(...inactiveClasses);
      content.classList.remove("hidden");
    } else {
      button.classList.add(...inactiveClasses);
      button.classList.remove(...activeClasses);
      content.classList.add("hidden");
    }
  }
}

// Helper para obtener el token CSRF (si es necesario)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('w-64');
  sidebar.classList.toggle('w-20');
  document.querySelectorAll('.sidebar-label').forEach(el => el.classList.toggle('hidden'));
}

function abrirModalPaciente() {
  const modal = document.getElementById("modalAgregarPaciente");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function cerrarModalPaciente() {
  const modal = document.getElementById("modalAgregarPaciente");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function abrirModalMedico() {
  const modal = document.getElementById("modalAgregarMedico");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function cerrarModalMedico() {
  const modal = document.getElementById("modalAgregarMedico");
  if (modal) {
    modal.classList.add("hidden");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Formulario Paciente
  const formPaciente = document.getElementById('form-paciente');
  if (formPaciente) {
    formPaciente.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(formPaciente);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/crear_paciente/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'ok') {
          alert('Paciente creado correctamente');
          cerrarModalPaciente();
          location.reload();
        } else {
          alert('Error al crear paciente');
        }
      } catch (error) {
        console.error('Error al crear paciente:', error);
      }
    });
  }

  // Formulario Médico
  const formMedico = document.getElementById('form-medico');
  if (formMedico) {
    const selectEspecialidad = document.getElementById('esp_id');
    const inputEspecialidad = document.getElementById('especialidad_nombre');

    if (selectEspecialidad && inputEspecialidad) {
      selectEspecialidad.addEventListener('change', function () {
        const selectedOption = selectEspecialidad.options[selectEspecialidad.selectedIndex];
        inputEspecialidad.value = selectedOption.text;
      });
    }

    formMedico.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Forzar asignar nombre de especialidad antes del submit
      if (selectEspecialidad && inputEspecialidad) {
        const selectedOption = selectEspecialidad.options[selectEspecialidad.selectedIndex];
        inputEspecialidad.value = selectedOption.text;
      }

      const formData = new FormData(formMedico);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/crear_medico/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'ok') {
          alert('Médico creado correctamente');
          cerrarModalMedico();
          location.reload();
        } else {
          alert('Error al crear médico');
          console.error(result.error);
        }
      } catch (error) {
        console.error('Error al crear médico:', error);
      }
    });
  }
});

function togglePerfilMenu() {
  const menu = document.getElementById('perfilMenu');
  menu.classList.toggle('hidden');
  // Cierra el menú si se hace click fuera
  function handler(e) {
    if (!document.getElementById('perfilBtn').contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
      document.removeEventListener('click', handler);
    }
  }
  setTimeout(() => document.addEventListener('click', handler), 0);
}

function showTab(tab) {
  // Botones
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab' + capitalize(tab)).classList.add('active');

  // Contenidos
  const tabs = ['Resumen', 'Personal', 'Pacientes'];
  tabs.forEach(name => {
    const contenido = document.getElementById('contenido' + name);
    if (contenido) {
      if (name.toLowerCase() === tab) {
        contenido.classList.remove('hidden');
      } else {
        contenido.classList.add('hidden');
      }
    }
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener('DOMContentLoaded', function() {
  showTab('resumen');
});