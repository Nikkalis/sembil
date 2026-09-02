//---------------------- Non-3D related stuff
document.getElementById('nav_button').addEventListener('click', toggleNav);
function toggleNav() {
  const hamburger = document.getElementById('nav_wrapper');
  hamburger.classList.toggle('active-sidebar');
}
