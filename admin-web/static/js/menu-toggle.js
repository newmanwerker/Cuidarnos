document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');
  const toggle = document.getElementById('toggle-theme');
  const thumb = document.getElementById('toggle-thumb');

  // Debug logging
  console.log('Theme toggle elements:', { iconMoon, iconSun, toggle, thumb });

  if (!iconMoon || !iconSun || !toggle || !thumb) {
    console.error('Some theme toggle elements are missing');
    return;
  }

  // Check stored theme and apply it
  const storedTheme = localStorage.getItem('theme');
  console.log('Stored theme:', storedTheme);
  
  if (storedTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  updateToggle();

  toggle.addEventListener('click', () => {
    console.log('Toggle clicked');
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    console.log('Theme changed to:', newTheme);
    updateToggle();
  });

  function updateToggle() {
    const isDark = html.classList.contains('dark');
    console.log('Updating toggle, isDark:', isDark);
    
    iconMoon.classList.toggle('hidden', isDark);
    iconSun.classList.toggle('hidden', !isDark);
    thumb.classList.toggle('translate-x-6', isDark);
    
    // Force a repaint to ensure styles are applied
    document.body.offsetHeight;
  }
});