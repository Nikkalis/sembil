// GENERIC POPUPS
console.log('scripts.js loaded', import.meta.url);
localStorage.clear;
document.getElementById('bill-tutorial_popup')?.classList.add('inactive');

let genericPopupTitle = document.getElementById('generic-popup-title_text');
let genericPopupBody = document.getElementById('generic-popup-content_text');
let genericPopupOkButton = document.getElementById('generic-popup-options-ok_button');
let genericPopupSecondButton = document.getElementById('generic-popup-options-placeholder_button');
let genericPopupAction_wrapper = document.getElementById('generic-popup-action_wrapper');
let genericPopupOptions_wrapper = document.getElementById('generic-popup-options_wrapper');

let genericPopupOkButton_wrapper = document.getElementById('generic-popup-options-ok_wrapper');
let genericPopupSecondButton_wrapper = document.getElementById('generic-popup-options-placeholder_wrapper');

let genericPopupClosed = true;

let genericPopup = document.getElementById('generic-popup_wrapper');
const loadingBill = document.getElementById('bill_loading');

const indexpage = window.location.pathname.endsWith('index.html');
const messagingpage = window.location.pathname.endsWith('messaging.html');
const postmake1page = window.location.pathname.endsWith('postmake1.html');
const postmake2page = window.location.pathname.endsWith('postmake2.html');
const accountpage = window.location.pathname.endsWith('account.html');

const usernameInputS = document.getElementById("signup-popup-username_input");
const passwordInputS = document.getElementById("signup-popup-password_input");
const confirmPasswordInputS = document.getElementById("signup-popup-passwordconfirm_input");
const emailInputS = document.getElementById("signup-popup-email_input");
const displayNameInputS = document.getElementById("signup-popup-displayname_input");
const pfpUploadButton = document.getElementById("signup-popup-profilepicture_input");
console.log(pfpUploadButton);

const usernameInputL = document.getElementById("login-popup-username_input");
const passwordInputL = document.getElementById("login-popup-password_input");

// css sheet variables
let mainColour = window.getComputedStyle(document.body).getPropertyValue('--mainColour');
let bgColour = window.getComputedStyle(document.body).getPropertyValue('--bgColour');
let isDark = window.getComputedStyle(document.body).getPropertyValue('--isDark');
let iconSet = window.getComputedStyle(document.body).getPropertyValue('--iconSet');

// 3d stuff
const activeRenderers = new Map();

window.addEventListener('load', loadIcons);
// window.addEventListener('load', rendering);
rendering();
window.addEventListener('load', onboarding);

function onboarding() {
  const isNewUser = localStorage.getItem('onboarded?');
  if(isNewUser) {return;}
  if(!document.getElementById('bill-tutorial_popup')) {return;}
  const onboardingPopup = document.getElementById('bill-tutorial_popup');
  onboardingPopup.classList.remove('inactive');
  const onboardingButton = document.getElementById('tutorial-options-ok_button');
  onboardingButton.addEventListener('click', function (e) {
    onboardingPopup.classList.add('inactive');
    localStorage.setItem('onboarded?', true);
  });
}

async function loadIcons() {
  const directory = `icons/${iconSet}--${isDark}`;
  const home_div = document.getElementById('nav-icon_home');
  const messages_div = document.getElementById('nav-icon_messages');
  const createPost_div = document.getElementById('nav-icon_create_post');
  const dropdown_divs = document.querySelectorAll('.search-filters-dropdown_icon');
  const pagination_prev = document.getElementById('pagination-previous_button');
  const pagination_next = document.getElementById('pagination-next_button');

  for (let div of dropdown_divs) {
    div.style.setProperty('background-image', `url('${directory}/dropdown.svg')`);
    div.parentElement.addEventListener('click', () => {
      div.classList.toggle('dropdown--active');
      let panelName = div.getAttribute('id');

      panelName = panelName.replace('_dropdown', '');
      const panel = document.getElementById(panelName);
      panel.classList.toggle('panel--active');
    });
  }

  home_div.style.setProperty('background-image', `url('${directory}/home.svg')`);
  messages_div.style.setProperty('background-image', `url('${directory}/messages.svg')`);
  createPost_div.style.setProperty('background-image', `url('${directory}/create_post.svg')`);
  try {
    pagination_prev.style.setProperty('background-image', `url('${directory}/create_post.svg')`);
    pagination_prev.style.setProperty('background-image', `url('${directory}/dropdown.svg')`);
    pagination_next.style.setProperty('background-image', `url('${directory}/dropdown.svg')`);
  }
  catch {}
}


window.addEventListener('load', loadUserInfo);

usernameInputL.addEventListener("keypress", (e) => shiftFocus(e, passwordInputL));
passwordInputL.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
    loginAttempt();
    shiftFocus(e, genericPopupOkButton);
  }
});


usernameInputS.addEventListener("keypress", (e) => shiftFocus(e, displayNameInputS));
displayNameInputS.addEventListener("keypress", (e) => shiftFocus(e, emailInputS));
emailInputS.addEventListener("keypress", (e) => shiftFocus(e, pfpUploadButton));
pfpUploadButton.addEventListener("keypress", (e) => shiftFocus(e, passwordInputS));
passwordInputS.addEventListener("keypress", (e) => shiftFocus(e, confirmPasswordInputS));
confirmPasswordInputS.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
    createAccount();
  }
});

function shiftFocus(e, input) {
  if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
    input.focus();
  }
};

async function loadUserInfo() {
  loadingBill.classList.remove('inactive');
  const params = new URLSearchParams(window.location.search);
  const loginreq = params.get('loginreq');
  const res_raw = await fetch("/api/accounts/checkauth");
  const res = await res_raw.json();
  // const logout_item = document.getElementById('nav-logout');
  const signupLogin_item = document.getElementById('nav-signupLogin');
  const account_item = document.getElementById('nav-account');
  logout_item.classList.add('inactive');
  signupLogin_item.classList.add('inactive');
  account_item.classList.add('inactive');

  if (res.isLoggedIn) {
    logout_item.classList.remove('inactive');
    account_item.classList.remove('inactive');
    const userDetails = await fetch("/api/accounts/myprofile");
    const userDetails_json = await userDetails.json();
    const username = userDetails_json.username;
    console.log("THIS USERNAME SHOULD APPEAR IN ACCOUNTS");
    console.log(username);
    const navAccount_text = document.getElementById('nav-account_text');
    navAccount_text.textContent = username;

    const navAccount_pfp = document.getElementById('nav-icon_account');
    navAccount_pfp.setAttribute('src', userDetails_json.profile_picture);

  } else if (messagingpage || postmake1page || postmake2page || accountpage) {
    unauthorisedRedirect();
  } else if (loginreq) {
    toggleLoginPopup();
  }
  if (!res.isLoggedIn) {
    signupLogin_item.classList.remove('inactive');
    account_item.classList.add('inactive');
  }
  loadingBill.classList.add('inactive');
}
function unauthorisedRedirect() {
  window.location.replace(
    "index.html?loginreq=true",
  );
}

function customPopup(popupTitle, popupBody, okButtonText, secondButtonText, hasAction, reload, parentAction) {
  let reopenParent = true;
  if (hasAction) {
    if (parentAction) {
      parentAction.classList.add('inactive');
      reopenParent = true;
    }
    genericPopupAction_wrapper.classList.remove('inactive');
  }
  if (secondButtonText) {
    genericPopupSecondButton.classList.remove('inactive');
  } else { genericPopupSecondButton.classList.add('inactive'); }
  genericPopupClosed = false;
  genericPopup.classList.remove('invisible');

  genericPopupBody.classList.remove('inactive');
  genericPopupTitle.classList.remove('inactive');
  genericPopupOptions_wrapper.classList.remove('inactive');
  genericPopupTitle.textContent = popupTitle;
  genericPopupBody.textContent = popupBody;
  genericPopupOkButton.textContent = okButtonText;
  genericPopupSecondButton.textContent = secondButtonText;
  return new Promise((resolve) => {
    const close = () => {
      genericPopupOkButton.removeEventListener('click', close);
      genericPopupOkButton.removeEventListener("keypress", onKey);
      genericPopupSecondButton.removeEventListener('click', close);
      genericPopupSecondButton.removeEventListener("keypress", onKey);
      if (reload) {
        dismissPopup(genericPopup, parentAction);
      }
      else {
        dismissPopupNoReload(genericPopup, parentAction);
      }
      resolve();
    };
    const onKey = (e) => {
      if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
        close();
      }
    };
    genericPopupOkButton.addEventListener('click', close);
    genericPopupOkButton.addEventListener("keypress", onKey);
    genericPopupSecondButton.addEventListener('click', close);
    genericPopupSecondButton.addEventListener("keypress", onKey);
  });
}

function signupSuccess_popup() {
  genericPopupClosed = false;
  genericPopup.classList.remove('invisible');
  genericPopupBody.classList.remove('inactive');
  genericPopupSecondButton_wrapper.classList.remove('inactive');
  genericPopupTitle.innerHTML = "You have signed up!";
  genericPopupBody.innerHTML = "But you have to log in now to do anything";
  genericPopupSecondButton.innerHTML = "Log in";
  genericPopupSecondButton.addEventListener('click', toggleLoginPopup);
}

function loginSuccess_popup() {
  genericPopupClosed = false;
  genericPopup.classList.remove('invisible');
  genericPopupTitle.classList.remove('inactive');
  genericPopupOptions_wrapper.classList.remove('inactive');
  genericPopupOkButton_wrapper.classList.remove('inactive');
  genericPopupTitle.innerHTML = "You have logged in!";
  genericPopupBody.innerHTML = "";
}

function dismissPopup(popup) {
  genericPopup.classList.remove('popup_xlarge');
  genericPopup.classList.remove('popup_large');
  genericPopup.classList.add('invisible');
  const allChildren = Array.from(genericPopup.children);
  for (let child of allChildren) {
    child.classList.add('inactive');
  }
  const allActions = Array.from(genericPopupAction_wrapper.children);
  for (let child of allActions) {
    child.classList.add('inactive');
  }
  genericPopupTitle.innerHTML = "placeholder";
  genericPopupBody.innerHTML = "placeholder";
  genericPopupSecondButton.innerHTML = "????";
  genericPopupOkButton.innerHTML = "Ok";
  genericPopupClosed = true;
  cancelPopup(popup);
  location.reload();
}

function dismissPopupNoReload(popup) {
  genericPopup.classList.remove('popup_xlarge');
  genericPopup.classList.remove('popup_large');
  genericPopup.classList.add('invisible');
  const allChildren = Array.from(genericPopup.children);
  for (let child of allChildren) {
    child.classList.add('inactive');
  }
  const allActions = Array.from(genericPopupAction_wrapper.children);
  for (let child of allActions) {
    child.classList.add('inactive');
  }
  genericPopupTitle.innerHTML = "placeholder";
  genericPopupBody.innerHTML = "placeholder";
  genericPopupSecondButton.innerHTML = "????";
  genericPopupOkButton.innerHTML = "Ok";
  genericPopupClosed = true;
  cancelPopup(popup);
}

// OTHER STUFF


document.getElementById('nav_button').addEventListener('click', toggleNav);
function toggleNav() {
  const hamburger = document.getElementById('nav_wrapper');
  hamburger.classList.toggle('active-sidebar');
}
function openNav() {
  const hamburger = document.getElementById('nav_wrapper');
  hamburger.classList.add('active-sidebar');
}
function closeNav() {
  const hamburger = document.getElementById('nav_wrapper');
  hamburger.classList.remove('active-sidebar');
}

document.getElementById('login-popup-signup_link').addEventListener('click', toggleSignupPopup);
document.getElementById('nav-signup_link').addEventListener('click', toggleSignupPopup);
function toggleSignupPopup() {
  const otherpopup = document.getElementById('login-popup_wrapper');
  const popup = document.getElementById('signup-popup_wrapper');
  otherpopup.classList.add('invisible');
  popup.classList.toggle('invisible');
  closeNav();
}

document.getElementById('signup-popup-login_link').addEventListener('click', toggleLoginPopup);
document.getElementById('nav-login_link').addEventListener('click', toggleLoginPopup);
function toggleLoginPopup() {
  const otherpopup = document.getElementById('signup-popup_wrapper');
  const popup = document.getElementById('login-popup_wrapper');
  otherpopup.classList.add('invisible');
  popup.classList.toggle('invisible');
  closeNav()
}

// document.getElementById('nav-logout_link').addEventListener('click', () => logoutPopup("Sure you wanna log out?", "This will return you to the home screen", "Ok", "Cancel", false, true));
function logoutPopup(popupTitle, popupBody, okButtonText, secondButtonText) {
  genericPopupSecondButton.classList.remove('inactive');

  genericPopupClosed = false;
  genericPopup.classList.remove('invisible');

  genericPopupBody.classList.remove('inactive');
  genericPopupTitle.classList.remove('inactive');
  genericPopupOptions_wrapper.classList.remove('inactive');
  genericPopupTitle.textContent = popupTitle;
  genericPopupBody.textContent = popupBody;
  genericPopupOkButton.textContent = okButtonText;
  genericPopupSecondButton.textContent = secondButtonText;

  genericPopupOkButton.addEventListener('click', () => logOutUser(genericPopup));
  genericPopupSecondButton.addEventListener('click', () => dismissPopupNoReload(genericPopup));
}
async function logOutUser(genericPopup) {
  loadingBill.classList.remove('inactive');
  const logout_res = await fetch("/api/accounts/logout");

  console.log(logout_res.status);
  genericPopupTitle.textContent = null;
  const logout_res_json = await logout_res.json();
  console.log(logout_res_json);
  genericPopupBody.textContent = logout_res_json.message;
  if (logout_res.status === 200) {
    genericPopupSecondButton.classList.add('inactive');
    genericPopupOkButton.addEventListener('click', () => dismissPopup(genericPopup));
  }
  else if (logout_res.status === 500) {
    genericPopupOkButton.addEventListener('click', () => dismissPopupNoReload(genericPopup));
  } else if (logout_res.status === 401) {
    genericPopupSecondButton.classList.add('inactive');
    genericPopupOkButton.addEventListener('click', () => dismissPopupNoReload(genericPopup));
  }
  loadingBill.classList.add('inactive');

}

const fileInput = document.getElementById('signup-popup-profilepicture_input');
let preview_url = null;
const filePreview = document.getElementById('signup-popup-profilepicture-preview_image');
fileInput.onchange = () => {
  if (preview_url) {
    preview_url = URL.revokeObjectURL(preview_url);
  }
  preview_url = URL.createObjectURL(fileInput.files[0]);
  filePreview.setAttribute("src", preview_url);
}

document.getElementById('login-popup-options-submit_button').addEventListener('click', loginAttempt);
console.log("check0");
async function loginAttempt() {
  loadingBill.classList.remove('inactive');
  const username = document.getElementById('login-popup-username_input').value;
  const password = document.getElementById('login-popup-password_input').value;
  if (username && password) {
    const login_res = await fetch("/api/accounts/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    console.log("check3");
    console.log(login_res.status);
    const login_res_json = await login_res.json();
    if (login_res.status === 200) {
      const popup = document.getElementById('login-popup_wrapper');
      genericPopupOkButton.addEventListener('click', () => dismissPopup(popup));
      loginSuccess_popup();
    } else if (login_res.status === 401) {
      customPopup("Cannot log in", login_res_json.message, "Ok");
    }
  }
  loadingBill.classList.add('inactive');
}


const signup_popup = document.getElementById('signup-popup_wrapper');
const login_popup = document.getElementById('login-popup_wrapper');
document.getElementById('login-popup-options-cancel_button').addEventListener('click', () => cancelPopup(login_popup));
document.getElementById('signup-popup-options-cancel_button').addEventListener('click', () => cancelPopup(signup_popup));

function cancelPopup(popup) {
  popup.classList.add('invisible');
  // console.log("WHY am i here");
}

document.getElementById('signup-popup-options-submit_button').addEventListener('click', createAccount);
async function createAccount() {
  loadingBill.classList.remove('inactive');
  const username = document.getElementById('signup-popup-username_input').value;
  let display_name = document.getElementById('signup-popup-displayname_input').value;
  const email = document.getElementById('signup-popup-email_input').value;
  const password = document.getElementById('signup-popup-password_input').value;
  const password_confirm = document.getElementById('signup-popup-passwordconfirm_input').value;

  const pfpFile = document.getElementById('signup-popup-profilepicture_input').files[0];

  if (username && email && pfpFile && password && password_confirm) {
    if (password === password_confirm) {
      if (display_name) {
        // do nothing cuz user has set one
      }
      else {
        // make it the same as username
        display_name = username;
      }
      const newPfpName = `sembil_${username}_profilepicture`;

      function renameFile(file, newName) {
        return new File([file], newName, { type: file.type, lastModified: file.lastModified });
      }

      const renamedFile = renameFile(pfpFile, newPfpName);

      const formData = new FormData();
      formData.append("file", renamedFile);
      formData.append("upload_preset", "sembil_pfp_unsigned");
      const pfp_upload_response = await fetch("https://api.cloudinary.com/v1_1/rqgsug4o/image/upload", {
        method: "POST",
        body: formData
      });
      const pfp_json = await pfp_upload_response.json();
      const profile_picture = pfp_json.secure_url;

      const signup_res = await fetch("/api/accounts/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          display_name: display_name,
          profile_picture: profile_picture
        })
      });
      console.log(signup_res.status);
      if (signup_res.status === 200) {
        const popup = document.getElementById('signup-popup_wrapper');
        genericPopupOkButton.addEventListener('click', () => dismissPopup(popup));
        genericPopupSecondButton.addEventListener('click', () => dismissPopupNoReload(popup));
        signupSuccess_popup();
      }
    }
  }
  loadingBill.classList.add('inactive');
}

// -----------------------------------------------------post related stuff

async function likePost(likeIcon) {
  const likedPost = likeIcon.parentElement;
  const likedPostId = likedPost.dataset.postid;

  if (likeIcon.classList.contains('state-liked')) {
    const unlikepost_res = await fetch(`/api/posts/unlikepost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postid: likedPostId
      })
    });
    console.log(unlikepost_res.status);
    if (unlikepost_res.status === 200) {
      likeIcon.classList.remove('state-liked');
    };
  } else {
    const likepost_res = await fetch(`/api/posts/likepost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postid: likedPostId
      })
    });
    console.log(likepost_res.status);
    if (likepost_res.status === 200) {
      likeIcon.classList.add('state-liked')
    };
  }
}
// -----------------------------------------------------------3D SHIT
import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';

function rendering() {
  const render_boxes = document.querySelectorAll('.render--box');
  for (let box of render_boxes) {
    renderBox(box);
    console.log(box);
  }
}

function labelRenderedItems() {
  const renderItems = document.querySelectorAll('.render');
  let currentId = 0;
  for (let item of renderItems) {
    if (item.lastChild.tagName == 'canvas') {
      activeRenderers.set(currentId, item.lastChild.renderer);
    } else {
      activeRenderers.set(currentId, null);
    }
    item.setAttribute('data-rendererid', currentId);
    currentId++;
  }
}

function renderBox(box) {

  const colourBg = new THREE.Color(bgColour);
  const colourMain = new THREE.Color(mainColour);
  // console.log(box.getBoundingClientRect().width);
  const scene = new THREE.Scene();
  console.log(`BOX ${box.getAttribute('id')} has WIDTH OF: ${box.getBoundingClientRect().width}`);
  const camera = new THREE.PerspectiveCamera(40, box.getBoundingClientRect().width / box.getBoundingClientRect().height, 0.1, 1000);
  // scene.add(new THREE.AxesHelper(1));
  const canvas = document.createElement('canvas');
  if (box.classList.contains('modgrid_item') || box.classList.contains('modgrid_EX')) {
    canvas.classList.add('modgrid-box_canvas');
  }
  box.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });


  canvas.renderer = renderer;
  renderer.setSize(box.getBoundingClientRect().width, box.getBoundingClientRect().height);

  console.log("pixelunits");
  console.log(box.getBoundingClientRect().width);
  console.log(box.getBoundingClientRect().height);
  console.log("worldunits");
  camera.position.z = 1;
  const boxDepth = 1;
  const totalDepth = boxDepth + camera.position.z;

  // const backGeometry = new THREE.PlaneGeometry(pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width), pxToWorldUnits(box.getBoundingClientRect().height, camera, camera.position.z, box.getBoundingClientRect().width));
  // const btmGeometry = new THREE.PlaneGeometry(pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width), totalDepth);
  // const topGeometry = new THREE.PlaneGeometry(pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width), totalDepth);
  // const leftGeometry = new THREE.PlaneGeometry(totalDepth, pxToWorldUnits(box.getBoundingClientRect().height, camera, camera.position.z, box.getBoundingClientRect().width));
  // const rightGeometry = new THREE.PlaneGeometry(totalDepth, pxToWorldUnits(box.getBoundingClientRect().height, camera, camera.position.z, box.getBoundingClientRect().width));

  const backGeometry = new THREE.PlaneGeometry(1, 1);
  const btmGeometry = new THREE.PlaneGeometry(1, totalDepth);
  const topGeometry = new THREE.PlaneGeometry(1, totalDepth);
  const leftGeometry = new THREE.PlaneGeometry(totalDepth, 1);
  const rightGeometry = new THREE.PlaneGeometry(totalDepth, 1);

  const texture = new THREE.TextureLoader().load('../static/images/test-img_post.jpg');
  const material = new THREE.MeshPhongMaterial({ color: colourBg });

  const backWall = new THREE.Mesh(backGeometry, material);
  const btmWall = new THREE.Mesh(btmGeometry, material);
  const topWall = new THREE.Mesh(topGeometry, material);
  const leftWall = new THREE.Mesh(leftGeometry, material);
  const rightWall = new THREE.Mesh(rightGeometry, material);

  btmWall.rotateX(degToRad(-90));
  btmWall.position.y = -(pxToWorldUnits(box.getBoundingClientRect().height, camera, camera.position.z, box.getBoundingClientRect().width) / 2);

  topWall.rotateX(degToRad(90));
  topWall.position.y = (pxToWorldUnits(box.getBoundingClientRect().height, camera, camera.position.z, box.getBoundingClientRect().width) / 2);

  leftWall.rotateY(degToRad(90));
  leftWall.position.x = -(pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width) / 2);

  rightWall.rotateY(degToRad(-90));
  rightWall.position.x = (pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width) / 2);

  console.log(-(pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width) / 2));

  backWall.position.z = -boxDepth;


  scene.add(backWall);
  scene.add(btmWall);
  scene.add(topWall);
  scene.add(leftWall);
  scene.add(rightWall);
  const light = new THREE.DirectionalLight(0xffffff, 5);
  const lightAm = new THREE.AmbientLight(0xffffff, 4);
  light.position.set(-0.05, 0.05, 0.03);
  scene.add(light);
  scene.add(lightAm);




  function animate(time) {

    renderer.render(scene, camera);
  }

  function fitWalls() {

    const viewH = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;
    const viewW = viewH * camera.aspect;

    btmWall.scale.x = viewW;
    topWall.scale.x = viewW;
    leftWall.scale.y = viewH;
    rightWall.scale.y = viewH;
    backWall.scale.set(viewW, viewH, 1);

    btmWall.position.y = -(pxToWorldUnits(box.getBoundingClientRect().height, camera, camera.position.z, box.getBoundingClientRect().width) / 2);

    topWall.position.y = (pxToWorldUnits(box.getBoundingClientRect().height, camera, camera.position.z, box.getBoundingClientRect().width) / 2);

    leftWall.position.x = -(pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width) / 2);

    rightWall.position.x = (pxToWorldUnits(box.getBoundingClientRect().width, camera, camera.position.z, box.getBoundingClientRect().width) / 2);
  }

  function onBoxResize(camera, renderer, box) {
    camera.aspect = box.getBoundingClientRect().width / box.getBoundingClientRect().height;
    camera.updateProjectionMatrix();

    renderer.setSize(box.getBoundingClientRect().width, box.getBoundingClientRect().height);
    fitWalls();
  }

  fitWalls();

  renderer.setAnimationLoop(animate);

  window.addEventListener('resize', () => onBoxResize(camera, renderer, box), false);
}

function pxToWorldUnits(px, camera, distance, boxWidth) {
  // Convert the vertical FOV to radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Calculate the height of the view at the given distance
  const viewHeight = 2 * Math.tan(vFOV / 2) * distance;

  // Calculate the width of the view using the aspect ratio
  const viewWidth = viewHeight * camera.aspect;

  // Determine the scaling factor: world units per pixel
  const screenWidth = boxWidth;
  const worldUnitPerPx = viewWidth / screenWidth;

  // Convert pixels to world units
  return px * worldUnitPerPx;
}

export { likePost, renderBox, labelRenderedItems };
export default customPopup;