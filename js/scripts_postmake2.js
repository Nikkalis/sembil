import TurndownService from "turndown";
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { nanoid } from 'nanoid';
import { error } from "three";
import customPopup from "./scripts.js";
let preview_size = null;

document.getElementById('postmake-options-submit_button').addEventListener('click', submitPost);
async function submitPost() {
    const loadingText = document.getElementById("postmake-options-submit_button");
    loadingText.textContent = "Loading...";
    const post_id = nanoid(8);
    const author_info = await fetch('/api/accounts/myprofile');
    const author_info_json = await author_info.json();
    const post_author = author_info_json.username;
    console.log(post_author);
    const author_display_name = author_info_json.display_name;
    const post_authorUID = author_info_json.uid;
    console.log(post_authorUID);
    const post_title = document.getElementById('post-title_textinput').value;
    console.log(post_title);
    const post_desc = document.getElementById('postmake-settings-description_input').value;
    const post_type = document.getElementById('postmake-settings-posttype_dropdown').value;
    console.log(post_type);
    let post_main_image_TOBESET = null;

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const post_date = `${year}/${month}/${day}`;
    const post_content = document.getElementById('post-content_textinput').value;
    const post_main_image = document.getElementById('post-mainimg_input').files[0];
    const post_tag_elements = Array.from(document.getElementsByClassName('tags-item_text'));
    const post_tags = [];
    for (let tag of post_tag_elements) {
        const tagText = tag.textContent;
        post_tags.push(tagText);
    }


    const post_details_date = document.getElementById('post-details-date_textinput').value;
    const post_details_location = document.getElementById('post-details-location_textinput').value;
    const post_details_time = document.getElementById('post-details-time_textinput').value;
    const post_details_info = document.getElementById('post-details-info_textinput').value;

    const post_details = {
        details_date: post_details_date,
        details_location: post_details_location,
        details_time: post_details_time,
        details_info: post_details_info
    };

    let popupTitle = "Try again IDIOT.";
    let popupBody = "You suck, try again idiot...";
    let okButton = "Ok";
    let secondButton = null;

    if (post_type) {
        if (post_type == "text") {
            if (post_title && post_content && post_tags && post_author && post_authorUID) {
            }
            else {

                customPopup(popupTitle, "Text post requirements not fufilled, you havent set something", okButton, secondButton);
                console.log(post_title);
                console.log(post_type);
                loadingText.textContent = "Submit";
                return;
            }
        }
        else if (post_type == "image") {
            if (post_title && post_main_image && post_tags && post_author && post_authorUID) {
            }
            else {
                console.log(post_type);
                customPopup(popupTitle, "Image post requirements not fufilled, you havent set something", okButton, secondButton);
                loadingText.textContent = "Submit";
                return;
            }
        }
        else if (post_type == "event") {
            if (post_title && post_content && post_details && post_tags && post_author && post_authorUID) {
            }
            else {
                console.log(post_type);
                customPopup(popupTitle, "Event post requirements not fufilled, you havent set something", okButton, secondButton);
                loadingText.textContent = "Submit";
                return;
            }
        }
        else {
            customPopup("what", "bro ok", okButton, secondButton);
            loadingText.textContent = "Submit";
            return;
        }
    }
    else {
        
        customPopup("Select a post type", "Then try submitting again", okButton, secondButton);
        loadingText.textContent = "Submit";
        return;

    }
    if (preview_size){
    }else{
        loadingText.textContent = "Submit";
        customPopup("Select a preview size", "Then try submitting again", okButton, secondButton);
        return;
    }

    const post_boxesArray = Array.from(document.querySelectorAll(".modgrid_item"));
    console.log("array loading - post type:");
    const post_boxes = [];

    console.log(post_type);

    console.log("boxes");
    console.log(post_boxes);
    console.log("boxesarray");
    console.log(post_boxesArray);
    let imgcount = 0;
    let textcount = 0;
    let block_num = 0;
    for (const block of post_boxesArray) {
        const block_type = block.dataset.boxtype;
        console.log("BLOCKTYPE");
        console.log(block_type);
        const block_size = block.dataset.boxsize;
        let block_text = null;
        let image = null;
        let image_src = null;
        console.log("hey");
        let image_caption = null;

        if ((block_type == 'text' || block_type == 'maincontent' || block_type == 'title') && block.getElementsByClassName('post_textinput')[textcount]) {
            console.log("image box loading");
            block_text = block.getElementsByClassName('post_textinput')[textcount];
            textcount++;
        }

        if (block_type == 'image' && block.getElementsByClassName('post-image_input')[imgcount].files[0]) {
            console.log("image box loading");
            let imgNum = imgcount + 1;
            let newImgName = `sembilpost_${post_id}_img${imgNum}`;
            console.log(imgcount);
            image = block.getElementsByClassName('post-image_input')[imgcount].files[0];
            image_caption = block.getElementsByClassName('image-caption')[imgcount].value;
            const renamedFile = renameFile(image, newImgName);

            const formData1 = new FormData();
            formData1.append("file", renamedFile);
            formData1.append("upload_preset", "sembil_post_mainimage");
            const image_upload_response = await fetch("https://api.cloudinary.com/v1_1/rqgsug4o/image/upload", {
                method: "POST",
                body: formData1
            });
            const image_json = await image_upload_response.json();
            image_src = image_json.secure_url;
            imgcount++;

        }
        if (block_type == 'mainimage' && block.getElementsByClassName('post-image_input')[imgcount].files[0]) {
            console.log("image box loading");
            let imgNum = imgcount + 1;
            let newImgName = `sembilpost_${post_id}_img${imgNum}`;
            console.log(imgcount);
            image = block.getElementsByClassName('post-image_input')[imgcount].files[0];
            image_caption = block.getElementsByClassName('image-caption')[imgcount].value;
            const renamedFile = renameFile(image, newImgName);

            const formData1 = new FormData();
            formData1.append("file", renamedFile);
            formData1.append("upload_preset", "sembil_post_mainimage");
            const image_upload_response = await fetch("https://api.cloudinary.com/v1_1/rqgsug4o/image/upload", {
                method: "POST",
                body: formData1
            });
            const image_json = await image_upload_response.json();
            image_src = image_json.secure_url;
            post_main_image_TOBESET = image_json.secure_url;
            imgcount++;

        }
        const json = JSON.stringify({
            "block_type": block_type,
            "block_size": block_size,
            "block_text": block_text,
            "block_num": block_num,
            "image_src": image_src,
            "image_caption": image_caption
        });
        post_boxes.push(json);
        console.log("boxes");
        console.log(post_boxes);
        console.log("type");
        console.log(block_type);
        console.log("boxesarray");
        console.log(post_boxesArray);
        block_num++;
    };

    console.log("boxes");
    console.log(post_boxes);
    console.log("type");
    console.log(post_type);
    console.log("boxesarray");
    console.log(post_boxesArray);

    function renameFile(file, newName) {
        return new File([file], newName, { type: file.type, lastModified: file.lastModified });
    }

    const post_main_image_url = post_main_image_TOBESET;
    console.log(post_type);
    const submit_result = await fetch('/api/posts/createpost', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            postid: post_id,
            uid: post_authorUID,
            author_username: post_author,
            author_display_name: author_display_name,
            post_type: post_type,
            post_date: post_date,
            post_title: post_title,
            post_content: post_content,
            post_main_image: post_main_image_url,
            preview_size: preview_size,
            post_boxes: post_boxes,
            post_tags: post_tags,
            post_desc: post_desc,
            post_details: post_details
        })
    });
    const submit_result_json = await submit_result.json();
    const newPost_postid = submit_result_json.postid;
    
    loadingText.textContent = "Submit";
    if(submit_result.status === 200){
    window.location.replace(
    `postview.html?postid=${newPost_postid}`,
    );}


}

const mainimg_fileInput = document.getElementById('post-mainimg_input');
let mainimg_preview_url = null;
const mainimg_filePreview = document.getElementById('post-mainimg-preview_image');
mainimg_fileInput.onchange = () => {
    if (!mainimg_preview_url) {
        mainimg_preview_url = URL.revokeObjectURL(mainimg_preview_url);
    }
    mainimg_preview_url = URL.createObjectURL(mainimg_fileInput.files[0]);
    mainimg_filePreview.setAttribute("src", mainimg_preview_url);
}

document.getElementById('post-title-tags_button').addEventListener('click', popupTagAdder);
function popupTagAdder() {

    customPopup("Add tags", null, "Save", "Cancel", true);
    const popup = document.getElementById('generic-popup_wrapper');
    popup.classList.add('popup_large');
    const tagList = document.getElementById('generic-popup-tagadder_taglist');
    const tagListWrapper = document.getElementById('generic-popup-actions_tagadder');
    tagListWrapper.classList.remove('inactive');
    let input = null;
    document.getElementById("generic-popup-tagadder_input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
            console.log(e.key);
            e.preventDefault();
            input = document.getElementById('generic-popup-tagadder_input').value;
            addTag(input, tagList);
        }
    })
    document.getElementById("generic-popup-tagadder_button").addEventListener('click', () => addTag(input = document.getElementById('generic-popup-tagadder_input').value, tagList));
    document.getElementById('generic-popup-options-ok_button').addEventListener('click', () => saveTagAdder(tagList));
}
function addTag(tagText, tagList) {

    if (!document.getElementById(`tagvalue_${tagText}`)) {

        const tagWrapper = document.createElement('div');
        const tagRemoveButton = document.createElement('button');
        tagRemoveButton.setAttribute('type', 'button');
        tagRemoveButton.classList.add('tagadder-remove_button');
        tagRemoveButton.textContent = 'x';
        tagRemoveButton.addEventListener('click', () => removeTag(tagText, tagList));

        tagWrapper.classList.add('tagadder-tags_item');
        tagWrapper.setAttribute('id', `tagvalue_${tagText}`);
        const tag = document.createElement('p');
        tag.classList.add('tagadder-tags-item_text');
        tag.textContent = tagText;

        tagWrapper.appendChild(tagRemoveButton);
        tagWrapper.appendChild(tag);
        tagList.appendChild(tagWrapper);
    }
}

function removeTag(tagText, tagList) {
    const tagForRemoval = tagList.querySelector(`#tagvalue_${tagText}`);
    tagForRemoval.remove();
}

function saveTagAdder(tagList) {
    const tags = Array.from(tagList.children);
    const tagPreviewWrapper = document.getElementById('post-title-tags_wrapper');
    const oldTags = Array.from(tagPreviewWrapper.children);
    for (let oldTag of oldTags) {
        oldTag.remove();
    }
    let counter = 0;
    for (let tag of tags) {
        let newTag = tag.cloneNode(true);
        newTag.classList.remove('tagadder-tags_item');
        newTag.classList.add('tags_item');
        newTag.querySelector('p').classList.remove('tagadder-tags-item_text');
        newTag.querySelector('p').classList.add('tags-item_text');
        let button = newTag.getElementsByClassName('tagadder-remove_button')[0];
        button.remove();
        tagPreviewWrapper.appendChild(newTag);
        counter++;
    }
}

const buttons = document.getElementsByClassName('previewsize_button');
for (let button of buttons) {
    button.addEventListener('click', () => changePreviewSize(button.getAttribute('data-sizeclass')))
};
let current_previewSize = "box-1x2";
document.getElementById('postmake-settings-previewsize_button').addEventListener('click', popupPreviewSize);
function popupPreviewSize() {
    customPopup("Select preview size", "This is what your post will look like on the feed", "Save", "Cancel", true);
    const popup = document.getElementById('generic-popup_wrapper');
    popup.classList.add('popup_xlarge');
    const previewSizeWrapper = document.getElementById('generic-popup-actions_previewsize');
    previewSizeWrapper.classList.remove('inactive');
    document.getElementById('generic-popup-options-ok_button').addEventListener('click', savePreviewSize);
}
function changePreviewSize(newSizeClass) {
    const block = document.getElementById("previewsize-preview_box");
    block.setAttribute('class', `${newSizeClass} modgrid_EX wireframe-element`);
    current_previewSize = newSizeClass;
}
function savePreviewSize() {
    preview_size = current_previewSize;
}


// ----------------------------------------Custom blocks, no limit

function createBlock_post_text(blockattrs) {
    const box = document.createElement('div');
    box.classList.add(blockattrs.block_size);
    box.classList.add('post-text_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');



    const content_wrapper = document.createElement('div');
    content_wrapper.classList.add('post-text_wrapper');
    const content = DOMPurify.sanitize(md.render(blockattrs.block_text));
    content_wrapper.innerHTML = content;

    box.appendChild(content_wrapper);

    modgrid.appendChild(box);
}
function createBlock_post_image(blockattrs) {
    const box = document.createElement('div');
    box.classList.add(blockattrs.block_size);
    box.classList.add('post-img_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');

    const img_container = document.createElement('div');
    img_container.classList.add('post-img_container');
    const img_src = blockattrs.image_src;
    const img = document.createElement('img');
    const img_caption = document.createElement('p');
    img_caption.textContent = blockattrs.image_caption;
    img.classList.add('post-img');
    img.setAttribute('src', img_src);
    img_container.appendChild(img);
    box.appendChild(img_container);

    // const fileInput = document.getElementById('signup-popup-profilepicture_input');
    // let preview_url = null;
    // const filePreview = document.getElementById('signup-popup-profilepicture-preview_image');
    // fileInput.onchange = () => {
    //     if (!preview_url) {
    //         preview_url = URL.revokeObjectURL(preview_url);
    //     }
    //     preview_url = URL.createObjectURL(fileInput.files[0]);
    //     filePreview.setAttribute("src", preview_url);
    // }

    modgrid.appendChild(box);
}

// -------------------------------------------Spacer blocks, needed for users to customise layout

function createBlock_spacer(blockattrs) {
    const box = document.createElement('div');
    box.classList.add(blockattrs.block_size);
    box.classList.add('post-spacer_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');


    modgrid.appendChild(box);
}
