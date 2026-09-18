let display_name_element;
let profile_picture_element;
let date_joined_element;
let bio_element;
let status_element;
const display_name_input = document.getElementById('profile-header-title_input');
const bio_input = document.getElementById('profile-bio_input');
const status_input = document.getElementById('profile-status_input');

const save_button = document.getElementById('profile-edit-save_button');
const cancel_button = document.getElementById('profile-edit-cancel_button');
const edit_button = document.getElementById('profile-edit_button');

window.addEventListener("load", populateProfile);
async function populateProfile() {

    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');
    let userDetails;

    if (uid) {
        userDetails = await fetch(`/api/accounts/loadprofile?uid=${encodeURIComponent(uid)}`);
    } else {
        userDetails = await fetch("/api/accounts/loadprofile");
    }
    const userDetails_json = await userDetails.json();
    const username = userDetails_json.username;
    const display_name = userDetails_json.display_name;
    const profile_picture = userDetails_json.profile_picture;
    const date_joined = userDetails_json.date_joined;
    const bio = userDetails_json.bio;
    const status = userDetails_json.status;


    console.log(userDetails.status + " " + username + " " + display_name + " " + profile_picture + " " + date_joined + "PROFILE: " + status + " " + bio);

    display_name_element = document.getElementById('profile-header-title_text');
    profile_picture_element = document.getElementById('profile-header-picture_img');
    date_joined_element = document.getElementById('profile-header-dateJoined_text');
    bio_element = document.getElementById('profile-bio_text');
    status_element = document.getElementById('profile-status_text');

    display_name_element.textContent = display_name;
    profile_picture_element.src = profile_picture;
    date_joined_element.textContent = date_joined;
    bio_element.textContent = bio;
    status_element.textContent = status;

    edit_button.classList.remove('inactive');
    edit_button.addEventListener('click', editProfile);
}

function editProfile() {
    display_name_input.classList.remove('inactive');
    bio_input.classList.remove('inactive');
    status_input.classList.remove('inactive');
    display_name_element.classList.add('inactive');
    bio_element.classList.add('inactive');
    status_element.classList.add('inactive');
    display_name_input.value = display_name_element.textContent;
    bio_input.value = bio_element.textContent;
    status_input.value = status_element.textContent;

    save_button.classList.remove('inactive');
    cancel_button.classList.remove('inactive');
    edit_button.classList.add('inactive');



    save_button.addEventListener('click', editProfile_save);
    cancel_button.addEventListener('click', editProfile_cancel);
}

async function editProfile_save() {

    const display_name = display_name_input.value;
    const bio = bio_input.value;
    const status = status_input.value;

    const newProfile_res = await fetch("/api/accounts/editprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            display_name: display_name,
            bio: bio,
            status: status
        })
    });
    const newProfile_res_json = await newProfile_res.json();
    display_name_element.textContent = newProfile_res_json.display_name;
    bio_element.textContent = newProfile_res_json.bio;
    status_element.textContent = newProfile_res_json.status;

    display_name_input.classList.add('inactive');
    bio_input.classList.add('inactive');
    status_input.classList.add('inactive');
    display_name_element.classList.remove('inactive');
    bio_element.classList.remove('inactive');
    status_element.classList.remove('inactive');
    display_name_input.value = null;
    bio_input.value = null;
    status_input.value = null;

    save_button.classList.add('inactive');
    cancel_button.classList.add('inactive');
    edit_button.classList.remove('inactive');
}

function editProfile_cancel() {
    display_name_input.classList.add('inactive');
    bio_input.classList.add('inactive');
    status_input.classList.add('inactive');
    display_name_element.classList.remove('inactive');
    bio_element.classList.remove('inactive');
    status_element.classList.remove('inactive');
    display_name_input.value = null;
    bio_input.value = null;
    status_input.value = null;

    save_button.classList.add('inactive');
    cancel_button.classList.add('inactive');
    edit_button.classList.remove('inactive');
}