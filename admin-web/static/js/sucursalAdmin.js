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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-paciente');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/crear_paciente/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')  // si usas CSRF
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
});

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