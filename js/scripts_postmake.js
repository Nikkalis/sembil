

document.getElementById('postmake-tab-custom').addEventListener('click', tabCustom);
function tabCustom() {
  const tabCustomContent = document.getElementById('postmake-content-custom_wrapper');
  const tabBasicContent = document.getElementById('postmake-content-basic_wrapper');
  if (tabCustomContent.classList.contains('invisible')) {
    tabCustomContent.classList.remove('invisible');
    tabBasicContent.classList.add('invisible');
  }
}
document.getElementById('postmake-tab-basic').addEventListener('click', tabBasic);
function tabBasic() {
  const tabCustomContent = document.getElementById('postmake-content-custom_wrapper');
  const tabBasicContent = document.getElementById('postmake-content-basic_wrapper');
  if (tabBasicContent.classList.contains('invisible')) {
    tabBasicContent.classList.remove('invisible');
    tabCustomContent.classList.add('invisible');
  }
}

let mouseDown = false;
let startX, scrollLeft;
const carousels = document.getElementsByClassName('postmake-content_row');


const startDragging = (slider, e) => {
  e.preventDefault();
  mouseDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
}

const stopDragging = (slider, e) => {
  e.preventDefault();
  mouseDown = false;
}

const move = (slider, e) => {
  e.preventDefault();
  if (!mouseDown) { return; }
  const x = e.pageX - slider.offsetLeft;
  const scroll = x - startX;
  slider.scrollLeft = scrollLeft - scroll;
}

for (const slider of carousels) {
  // Add the event listeners
  
  try {
  slider.addEventListener('mousemove', (e) => move(slider, e), false);
  slider.addEventListener('mousedown', (e) => startDragging(slider, e), false);
  slider.addEventListener('mouseup', (e) => stopDragging(slider, e), false);
  slider.addEventListener('mouseleave', (e) => stopDragging(slider, e), false);
  console.log("hi");
  }
  catch(error){
    console.log("DIE");
    break;
  }
}


