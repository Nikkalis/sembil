//---------------------- Non-3D related stuff


document.getElementById('nav_button').addEventListener('click', toggleNav);
function toggleNav() {
  const hamburger = document.getElementById('nav_wrapper');
  hamburger.classList.toggle('active-sidebar');
}
document.getElementById('nav-signup_link').addEventListener('click', toggleSignupPopup);
function toggleSignupPopup() {
  const popup = document.getElementById('signup-popup_wrapper');
  popup.classList.toggle('invisible');
}

document.getElementById('signup-popup-options-submit_button').addEventListener('click', createAccount);
async function createAccount() {


  const username = document.getElementById('signup-popup-username_input').value;
  let display_name = document.getElementById('signup-popup-displayname_input').value;
  const email = document.getElementById('signup-popup-email_input').value;
  const password = document.getElementById('signup-popup-password_input').value;
  const password_confirm = document.getElementById('signup-popup-passwordconfirm_input').value;

  const pfpFile = document.getElementById('signup-popup-profilepicture_input').files[0];
  const formData = new FormData();
  formData.append("file", pfpFile);
  formData.append("upload_preset", "sembil_pfp_unsigned");
  const pfp_upload_response = await fetch("https://api.cloudinary.com/v1_1/rqgsug4o/image/upload", {
    method: "POST",
    body: formData
  });
  const pfp_json = await pfp_upload_response.json();
  const profile_picture = pfp_json.secure_url;
  console.log(profile_picture);

  if (username && email && profile_picture && password && password_confirm) {
    if (password === password_confirm) {
      if (display_name) {
        // do nothing cuz user has set one
      }
      else {
        // make it the same as username
        display_name = username;
      }
      const signup_res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          display_name: display_name,
          profile_picture: profile_picture
        })
      })
      console.log(signup_res.status);
    }
  }
}
