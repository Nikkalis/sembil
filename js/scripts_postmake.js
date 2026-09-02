//---------------------- Non-3D related stuff
document.getElementById('postmake-tab-custom').addEventListener('click', tabCustom);
function tabCustom() {
  const tabCustomContent = document.getElementById('postmake-content-custom_wrapper');
  const tabBasicContent = document.getElementById('postmake-content-basic_wrapper');
  if (tabCustomContent.classList.contains('invisible')){
    tabCustomContent.classList.remove('invisible');
    tabBasicContent.classList.add('invisible');
  }
}
document.getElementById('postmake-tab-basic').addEventListener('click', tabBasic);
function tabBasic() {
  const tabCustomContent = document.getElementById('postmake-content-custom_wrapper');
  const tabBasicContent = document.getElementById('postmake-content-basic_wrapper');
  if (tabBasicContent.classList.contains('invisible')){
    tabBasicContent.classList.remove('invisible');
    tabCustomContent.classList.add('invisible');
  }
}
