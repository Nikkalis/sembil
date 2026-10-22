import TurndownService from "turndown";
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { nanoid } from 'nanoid';
import { error } from "three";
import customPopup from "./scripts.js";
import { gsap } from "gsap";
import * as fs from 'node:fs/promises';


import { Draggable } from "gsap/Draggable";



gsap.registerPlugin(Draggable);
let preview_size = null;

window.addEventListener('load', loadAuthorInfo);
async function loadAuthorInfo() {
    const author_info = await fetch('/api/accounts/myprofile');
    const author_info_json = await author_info.json();

    const date = new Date();
    const date_el = document.getElementById("post-title_date");

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const post_date = `${year}/${month}/${day}`;
    date_el.textContent = post_date;

    const author = author_info_json.display_name;

    const author_el = document.getElementById("post-title_author");
    author_el.textContent = author;
}

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
    if (preview_size) {
    } else {
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
    const stickers = [];
    const sticker_elements = document.querySelectorAll('.cm-sticker_wrapper');
    
    for (let element of sticker_elements) {
        stickers.push({
        src: element.querySelector('.sticker_img').getAttribute('src'),
        style: element.getAttribute('style')
    });
    }
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
        const CM_elements = block.querySelectorAll('.cm-item_wrapper');
        const CM_map = {};
        for (let element of CM_elements) {
            if (element.classList.contains('cm-sticker_wrapper')) { continue; }
            const element_style = element.getAttribute('style');
            const element_id = element.getAttribute('id');
            CM_map[element_id] = element_style;
            console.log(CM_map);
        }
        const json = JSON.stringify({
            "block_type": block_type,
            "block_size": block_size,
            "block_text": block_text,
            "block_num": block_num,
            "image_src": image_src,
            "image_caption": image_caption,
            "block_cm": CM_map
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
            post_details: post_details,
            stickers: stickers
        })
    });
    const submit_result_json = await submit_result.json();
    const newPost_postid = submit_result_json.postid;

    loadingText.textContent = "Submit";
    if (submit_result.status === 200) {
        window.location.replace(
            `postview.html?postid=${newPost_postid}`,
        );
    }


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
const settingsWrapper = document.getElementById('generic-popup-actions_settings');
async function popupPreviewSize() {
    const popup = document.getElementById('generic-popup_wrapper');
    popup.classList.add('popup_xlarge');
    const previewSizeWrapper = document.getElementById('generic-popup-actions_previewsize');
    previewSizeWrapper.classList.remove('inactive');
    document.getElementById('generic-popup-options-ok_button').addEventListener('click', savePreviewSize);
    await customPopup("Select preview size", "Choose a shape for your post's preview!", "Save", "Cancel", true, null, settingsWrapper);
    popupSettings();
}
function changePreviewSize(newSizeClass) {
    const block = document.getElementById("previewsize-preview_box");
    block.setAttribute('class', `${newSizeClass} modgrid_EX wireframe-element render render--box`);
    current_previewSize = newSizeClass;
}
function savePreviewSize() {
    preview_size = current_previewSize;
}
document.getElementById('postmake-settings_button').addEventListener('click', popupSettings);
window.addEventListener('load', popupSettings);
function popupSettings() {
    customPopup(null, null, "Save", null, true, null);
    const popup = document.getElementById('generic-popup_wrapper');
    popup.classList.add('popup_xlarge');

    settingsWrapper.classList.remove('inactive');
}

// ----------------------------------------CSM MODE

const CMbutton_tags = document.getElementById('post-title-tags_button');
const CMbutton_toggleMode = document.getElementById('postmake-cm-toggle_button');
const CMbutton_reset = document.getElementById('postmake-cm-reset_button');

function selectElementCM(e) {
    e.preventDefault();
    console.log(`clicked element: ${e.target}`);
    if (e.target.classList.contains('cm--editable')) {
        const selectedElements = document.querySelectorAll('.cm--selected');
        console.log(selectedElements.length);
        if (selectedElements.length > 0) {
            console.log('clicked off');
            for (const element of selectedElements) {
                element.classList.remove('cm--selected');
                console.log('element DEselected');
            }
        } else {
            e.target.classList.add('cm--selected');
            console.log('element selected');
        }

    } else {

        const selectedElements = document.querySelectorAll('.cm--selected');
        console.log(selectedElements.length);
        if (selectedElements.length > 0) {
            console.log('clicked off');
            for (const element of selectedElements) {
                element.classList.remove('cm--selected');
                console.log('element DEselected');
            }
        }
    }
}

CMbutton_toggleMode.addEventListener('click', activateCM);
const CMdraggables = [];
function activateCM() {
    document.addEventListener('click', selectElementCM);
    document.getElementById('stickers_wrapper').classList.remove('inactive');
    document.getElementById('stickers_disableMessage').classList.add('inactive');


    const CMelements = document.querySelectorAll('.cm-item_wrapper');
    for (const element of CMelements) {
        let rotateStart = { dist: 1, scale: 1 };
        const cm_container = element.parentElement;
        const cm_container_height = cm_container.getBoundingClientRect().height;
        const cm_container_width = cm_container.getBoundingClientRect().width;
        const cm_contents = Array.from(element.children);
        for (const child of cm_contents) {
            if (child.classList.contains('cm_gui')) { continue; }
            child.classList.add('cm--disabled');
        }
        const cm_gui_rotator = element.querySelector('.cm--editable_gui_rotate');



        console.log(cm_container.getBoundingClientRect());
        console.log(cm_container);
        console.log(cm_container_height);
        console.log(cm_container_width);
        element.classList.add('cm--active');
        element.classList.add('cm--editable');
        element.setAttribute('disabled', 'disabled');

        let elementRotate = new Draggable(element, {
            cursor: 'grab',
            activeCursor: 'grabbing',
            type: 'rotation',
            onPress: function (e) {

                const pointerCoords = { x: this.pointerX, y: this.pointerY };
                setDraggable.call(this, e);
                rotateStart.dist = Math.max(getDistToCenter.call(element, pointerCoords), 1); // avoid divide by 0
                console.log("stuff starting noew..");

                rotateStart.scale = gsap.getProperty(element, 'scale');
            },

            onDrag: function () {

                const pointerCoords = { x: this.pointerX, y: this.pointerY };
                const dist = getDistToCenter.call(element, pointerCoords);
                const newScale = rotateStart.scale * (dist / rotateStart.dist);
                console.log('THE NEW SCALE IS.....');
                console.log(`${rotateStart.scale} * (${dist} / ${rotateStart.dist} = ${dist / rotateStart.dist}) = ${newScale}`);
                gsap.set(element, { scale: newScale });
            }

        }).disable();

        let elementDrag = new Draggable(element, {
            onPress: function (e) {
                setDraggable.call(this, e);

                const container = cm_container.getBoundingClientRect();
                const item = element.getBoundingClientRect();
                this.applyBounds({ top: -(item.height / 2), left: -(item.width / 2), width: container.width + (item.width), height: container.height + (item.height) });

            },
            dragClickables: false,
            type: 'x,y',
            edgeResistance: 0.9,
            cursor: 'move',
            clickableTest: () => {
                if (element.classList.contains('cm--editable')) {
                    console.log('no clicking right now');
                    return false;
                }
                else {
                    console.log('clicking enabled hoe');
                    return true;
                }
            }
        });


        function setDraggable(event) {
            let isRotation = this.vars.type === "rotation";
            let isGuiR = event.target.classList.contains('cm--editable_gui_rotate');

            if (isGuiR) {

                if (!isRotation) {
                    elementDrag.disable();
                    elementRotate.enable().startDrag(event);
                }
            } else if (isRotation) {

                elementRotate.disable();
                elementDrag.enable().startDrag(event);
            }
        }

        // scaling stufff

        function getCenter(element) {
            const parent = element.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const rect = element.getBoundingClientRect();
            console.log('box rect isssss');
            const elementX = rect.x - parentRect.left;
            const elementY = rect.y - parentRect.top;

            console.log({ x: elementX + (rect.width / 2), y: elementY + (rect.height / 2) });
            return { x: elementX + window.scrollX + (rect.width / 2), y: elementY + window.scrollY + (rect.height / 2) }
        }

        function getDistToCenter(e) {
            const parent = this.parentElement;
            const parentRect = parent.getBoundingClientRect();
            console.log(parent);
            const posX = e.x - parentRect.left;
            const posY = e.y - parentRect.top;
            const center = getCenter(this);
            console.log(`WOWWWWW HYPOTENUSE ${Math.hypot(center.x - posX, center.y - posY)}`)
            console.log(center.x);
            console.log(center.y);

            return Math.hypot(center.x - posX, center.y - posY);
        }



        CMdraggables.push(elementDrag, elementRotate);
    }
    CMbutton_toggleMode.textContent = "Save";
    CMbutton_reset.classList.remove('inactive');
    CMbutton_toggleMode.removeEventListener('click', activateCM);
    CMbutton_toggleMode.addEventListener('click', deactivateCM_wrapper);
    CMbutton_reset.addEventListener('click', resetCM_wrapper);

}
function deactivateCM_wrapper() {
    deactivateCM(CMdraggables);
}
function resetCM_wrapper() {
    resetCM(CMdraggables);
}
function deactivateCM(CMdraggables) {
    document.getElementById('stickers_wrapper').classList.add('inactive');
    document.getElementById('stickers_disableMessage').classList.remove('inactive');
    document.removeEventListener('click', selectElementCM);
    const CMelements = document.querySelectorAll('.cm-item_wrapper');
    for (const element of CMelements) {

        const cm_contents = Array.from(element.children);
        for (const child of cm_contents) {
            child.classList.remove('cm--disabled');
        }
        element.classList.remove('cm--editable');
        element.removeAttribute('disabled');
    }

    for (const draggable of CMdraggables) {
        draggable.kill();
    }

    const selectedElements = document.querySelectorAll('.cm--selected');
    console.log(selectedElements.length);
    if (selectedElements.length > 0) {
        console.log('clicked off');
        for (const element of selectedElements) {
            element.classList.remove('cm--selected');
            console.log('element DEselected');
        }
    }

    CMbutton_toggleMode.textContent = "Custom Mode";
    CMbutton_reset.classList.add('inactive');
    CMbutton_toggleMode.addEventListener('click', activateCM);
    CMbutton_toggleMode.removeEventListener('click', deactivateCM_wrapper);
}
function resetCM(CMdraggables) {
    document.removeEventListener('click', selectElementCM);
    document.getElementById('stickers_wrapper').classList.add('inactive');
    document.getElementById('stickers_disableMessage').classList.remove('inactive');
    const CMstickers = document.querySelectorAll('.cm-sticker_wrapper');
    const CMstickers_array = Array.from(CMstickers);
    const CMelements = document.querySelectorAll('.cm-item_wrapper');
    for (const element of CMelements) {
        const cm_contents = Array.from(element.children);
        for (const child of cm_contents) {
            child.classList.remove('cm--disabled');
        }
        element.classList.remove('cm--active');
        element.classList.remove('cm--editable');
        element.removeAttribute('disabled');
        if (CMstickers_array.includes(element)) {
            element.remove();
        }

        gsap.set(element, { clearProps: "all" });
    }

    for (const draggable of CMdraggables) {
        draggable.kill();
    }

    const selectedElements = document.querySelectorAll('.cm--selected');
    console.log(selectedElements.length);
    if (selectedElements.length > 0) {
        console.log('clicked off');
        for (const element of selectedElements) {
            element.classList.remove('cm--selected');
            console.log('element DEselected');
        }
    }

    CMbutton_toggleMode.textContent = "Custom Mode";
    CMbutton_reset.classList.add('inactive');
    CMbutton_toggleMode.addEventListener('click', activateCM);
    CMbutton_toggleMode.removeEventListener('click', deactivateCM_wrapper);
}

// ----------------------------------------Stickers mode
window.addEventListener('load', loadStickerOptions);

const stickers_wrapper = document.getElementById('stickers_wrapper');
async function loadStickerOptions() {
    const stickers = await fetch('/api/accounts/stickers');
    const stickers_json = await stickers.json();
    const stickers_dest = document.getElementById('stickers_overlay');
    const stickerDraggables = [];
    for (const sticker of stickers_json) {
        console.log('hey guys sticker--------------------------');
        console.log(sticker);
        const sticker_div = document.createElement('div');
        sticker_div.classList.add('sticker_wrapper');
        const sticker_img = document.createElement('img');
        sticker_img.classList.add('sticker_img');
        const sticker_caption = document.createElement('p');
        sticker_caption.classList.add('sticker_caption');

        sticker_img.setAttribute('src', sticker.href);
        sticker_caption.innerText = sticker.caption;
        console.log(sticker_caption.textContent);

        sticker_div.appendChild(sticker_img);
        sticker_div.appendChild(sticker_caption);

        stickers_wrapper.appendChild(sticker_div);

        // gsap stuff
        sticker_img.addEventListener('mousedown', () => stickerDraggable(sticker_img, stickers_dest));
    }
}

function stickerDraggable(og_sticker_img, stickers_dest) {

    console.log('creating draggable');
    let rotateStart = { dist: 1, scale: 1 };
    const container_height = stickers_dest.getBoundingClientRect().height;
    const container_width = stickers_dest.getBoundingClientRect().width;
    const sticker_img = og_sticker_img.cloneNode();
    const newSticker_wrapper = document.createElement('div');
    const sticker_cmgui = document.createElement('div');
    sticker_cmgui.classList.add('cm_gui', 'cm--editable_gui_rotate');
    newSticker_wrapper.classList.add('cm-item_wrapper');
    newSticker_wrapper.classList.add('cm-sticker_wrapper');
    for (const child of newSticker_wrapper.children) {
        if (child.classList.contains('cm_gui')) { continue; }
        child.classList.add('cm--disabled');
    }
    const cm_gui_rotator = sticker_img.querySelector('.cm--editable_gui_rotate');
    sticker_img.classList.add('sticker_clone');
    // const cm_contents = Array.from(sticker_img.children);
    //     for (const child of cm_contents) {
    //         if (child.classList.contains('cm_gui')) { continue; }
    //         child.classList.add('cm--disabled');
    //     }
    newSticker_wrapper.appendChild(sticker_cmgui);
    newSticker_wrapper.appendChild(sticker_img);
    stickers_dest.appendChild(newSticker_wrapper);

    console.log(stickers_dest.getBoundingClientRect());
    console.log(stickers_dest);
    console.log(container_height);
    console.log(container_width);
    newSticker_wrapper.classList.add('cm--active');
    newSticker_wrapper.classList.add('cm--editable');
    newSticker_wrapper.setAttribute('disabled', 'disabled');

    let elementRotate = new Draggable(newSticker_wrapper, {
        cursor: 'grab',
        activeCursor: 'grabbing',
        type: 'rotation',
        onPress: function (e) {

            const pointerCoords = { x: this.pointerX, y: this.pointerY };
            setDraggable.call(this, e);
            rotateStart.dist = Math.max(getDistToCenter.call(newSticker_wrapper, pointerCoords), 1); // avoid divide by 0
            console.log("stuff starting noew..");

            rotateStart.scale = gsap.getProperty(newSticker_wrapper, 'scale');
        },

        onDrag: function () {

            const pointerCoords = { x: this.pointerX, y: this.pointerY };
            const dist = getDistToCenter.call(newSticker_wrapper, pointerCoords);
            const newScale = rotateStart.scale * (dist / rotateStart.dist);
            console.log('THE NEW SCALE IS.....');
            console.log(`${rotateStart.scale} * (${dist} / ${rotateStart.dist} = ${dist / rotateStart.dist}) = ${newScale}`);
            gsap.set(newSticker_wrapper, { scale: newScale });
        }

    }).disable();

    let elementDrag = new Draggable(newSticker_wrapper, {
        onPress: function (e) {
            setDraggable.call(this, e);

            const container = stickers_dest.getBoundingClientRect();
            const item = newSticker_wrapper.getBoundingClientRect();
            this.applyBounds({ top: -(item.height / 2), left: -(item.width / 2), width: container.width + (item.width), height: container.height + (item.height) });

        },
        dragClickables: false,
        type: 'x,y',
        edgeResistance: 0.9,
        cursor: 'move',
        clickableTest: () => {
            if (newSticker_wrapper.classList.contains('cm--editable')) {
                console.log('no clicking right now');
                return false;
            }
            else {
                console.log('clicking enabled hoe');
                return true;
            }
        }
    });


    function setDraggable(event) {
        let isRotation = this.vars.type === "rotation";
        let isGuiR = event.target.classList.contains('cm--editable_gui_rotate');

        if (isGuiR) {

            if (!isRotation) {
                elementDrag.disable();
                elementRotate.enable().startDrag(event);
            }
        } else if (isRotation) {

            elementRotate.disable();
            elementDrag.enable().startDrag(event);
        }
    }

    // scaling stufff

    function getCenter(element) {
        const parent = element.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        console.log('box rect isssss');
        const elementX = rect.x - parentRect.left;
        const elementY = rect.y - parentRect.top;

        console.log({ x: elementX + (rect.width / 2), y: elementY + (rect.height / 2) });
        return { x: elementX + window.scrollX + (rect.width / 2), y: elementY + window.scrollY + (rect.height / 2) }
    }

    function getDistToCenter(e) {
        const parent = this.parentElement;
        const parentRect = parent.getBoundingClientRect();
        console.log(parent);
        const posX = e.x - parentRect.left;
        const posY = e.y - parentRect.top;
        const center = getCenter(this);
        console.log(`WOWWWWW HYPOTENUSE ${Math.hypot(center.x - posX, center.y - posY)}`)
        console.log(center.x);
        console.log(center.y);

        return Math.hypot(center.x - posX, center.y - posY);
    }



    CMdraggables.push(elementDrag, elementRotate);


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
