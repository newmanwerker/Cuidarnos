document.addEventListener('DOMContentLoaded', () => {
  const html = document.getElementById('html-root');
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');
  const toggle = document.getElementById('toggle-theme');

  if (!html || !iconMoon || !iconSun || !toggle) {
    console.warn("Faltan elementos para el toggle de tema");
    return;
  }

  // Aplicar tema guardado
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    html.classList.add('dark');
  }

  updateIcons();

  toggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcons();
  });

  function updateIcons() {
    const isDark = html.classList.contains('dark');
    iconMoon.classList.toggle('hidden', isDark); // ícono luna aparece en modo claro
    iconSun.classList.toggle('hidden', !isDark); // ícono sol aparece en modo oscuro
  }
});