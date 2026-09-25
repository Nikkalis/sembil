// GENERIC POPUPS
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
  const params = new URLSearchParams(window.location.search);
  const loginreq = params.get('loginreq');
  const res_raw = await fetch("/api/accounts/checkauth");
  const res = await res_raw.json();
  const logout_button = document.getElementById('nav-logout_link');
  logout_button.classList.add('inactive');

  if (res.isLoggedIn) {
    logout_button.classList.remove('inactive');
    const userDetails = await fetch("/api/accounts/myprofile");
    const userDetails_json = await userDetails.json();
    const username = userDetails_json.username;
    console.log("THIS USERNAME SHOULD APPEAR IN ACCOUNTS");
    console.log(username);
    const navAccount_text = document.getElementById('nav-account_text');
    navAccount_text.textContent = username;
  } else if (messagingpage || postmake1page || postmake2page || accountpage) {
    unauthorisedRedirect();
  } else if (loginreq) {
    toggleLoginPopup();
  }
}
function unauthorisedRedirect() {
  window.location.replace(
    "index.html?loginreq=true",
  );
}

function customPopup(popupTitle, popupBody, okButtonText, secondButtonText, hasAction, reload) {
  if (hasAction) {
    genericPopupAction_wrapper.classList.remove('inactive');
  }
  if (secondButtonText) {
    genericPopupSecondButton.classList.remove('inactive');
  }
  genericPopupClosed = false;
  genericPopup.classList.remove('invisible');

  genericPopupBody.classList.remove('inactive');
  genericPopupTitle.classList.remove('inactive');
  genericPopupOptions_wrapper.classList.remove('inactive');
  genericPopupTitle.textContent = popupTitle;
  genericPopupBody.textContent = popupBody;
  genericPopupOkButton.textContent = okButtonText;
  genericPopupSecondButton.textContent = secondButtonText;
  if (reload) {
    genericPopupOkButton.addEventListener('click', () => dismissPopup(genericPopup));
    genericPopupOkButton.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
        dismissPopup(genericPopup);
      }
    });
  }
  else {
    genericPopupOkButton.addEventListener('click', () => dismissPopupNoReload(genericPopup));
    genericPopupOkButton.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
       dismissPopupNoReload(genericPopup);
      }
    });
  }
  genericPopupSecondButton.addEventListener('click', () => dismissPopupNoReload(genericPopup));
  genericPopupSecondButton.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
      dismissPopupNoReload(genericPopup);
    }
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

document.getElementById('nav-logout_link').addEventListener('click', () => logoutPopup("Sure you wanna log out?", "This will return you to the home screen", "Ok", "Cancel", false, true));
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
  const logout_res = await fetch("/api/accounts/logout");

  console.log(logout_res.status);
  genericPopupTitle.textContent = null;
  const logout_res_json = await logout_res.json();
  console.log(logout_res_json);
  genericPopupBody.textContent = logout_res_json.message;
  if (logout_res.status === 200) {
    genericPopupOkButton.addEventListener('click', () => dismissPopup(genericPopup));
  }
  else if (logout_res.status === 500) {
    genericPopupOkButton.addEventListener('click', () => dismissPopupNoReload(genericPopup));
  } else if (logout_res.status === 401) {
    genericPopupSecondButton.classList.add('inactive');
    genericPopupOkButton.addEventListener('click', () => dismissPopupNoReload(genericPopup));
  }

}

const fileInput = document.getElementById('signup-popup-profilepicture_input');
let preview_url = null;
const filePreview = document.getElementById('signup-popup-profilepicture-preview_image');
fileInput.onchange = () => {
  if (!preview_url) {
    preview_url = URL.revokeObjectURL(preview_url);
  }
  preview_url = URL.createObjectURL(fileInput.files[0]);
  filePreview.setAttribute("src", preview_url);
}

document.getElementById('login-popup-options-submit_button').addEventListener('click', loginAttempt);
console.log("check0");
async function loginAttempt() {
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
    if (login_res.status === 200) {
      const popup = document.getElementById('login-popup_wrapper');
      genericPopupOkButton.addEventListener('click', () => dismissPopup(popup));
      loginSuccess_popup();
    }
  }
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
      likeIcon.classList.remove('state-liked')
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

export { likePost };
export default customPopup;