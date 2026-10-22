
import TurndownService from "turndown";
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { renderBox } from "./scripts";

let post_title_created = false;
let post_maincontent_created = false;
let post_mainimg_created = false;
let post_details_created = false;

const md = new MarkdownIt();
const turndownService = new TurndownService();

const blockBuilders = {
    title: createBlock_post_title,
    maincontent: createBlock_post_maincontent,
    mainimage: createBlock_post_mainimage,
    details: createBlock_post_details,
    text: createBlock_post_text,
    image: createBlock_post_image,
    spacer: createBlock_spacer,
};

window.addEventListener("load", populatePost);
let modgrid = null;

//-------------------- Main blocks, one each. (image optional, details only required for event post types)

function createBlock_post_title(blockAttrs, postAttrs) {
    if (post_title_created) {
        return;
    }

    const box = document.createElement('div');
    box.setAttribute('id', 'post-title_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    const title = document.createElement('div');
    title.setAttribute('id', 'post-title_text-cm');
    const titleText = document.createElement('h1');
    titleText.classList.add('post-title_text');
    titleText.textContent = postAttrs.post_title;

    const date = document.createElement('div');
    date.setAttribute('id', 'post-title_date-cm');
    const dateText = document.createElement('p');
    dateText.classList.add('post-title_date');
    dateText.textContent = postAttrs.post_date;

    const author = document.createElement('div');
    author.setAttribute('id', 'post-title_author-cm');
    const authorText = document.createElement('p');
    authorText.classList.add('post-title_author');
    authorText.textContent = `${postAttrs.author_display_name}`;

    const tags = document.createElement('div');
    tags.setAttribute('id', 'post-title-tags_wrapper-cm');
    const tagsText = document.createElement('div');
    tagsText.classList.add('tags_wrapper');
    let tagsleft = true;
    let num_tags = 0;
    while (tagsleft) {
        const tag = document.createElement('div');
        tag.classList.add('tags_item');
        const tag_text = document.createElement('p');
        tag_text.textContent = postAttrs.post_tags[num_tags];
        tag.appendChild(tag_text);
        tagsText.appendChild(tag);
        num_tags++;
        console.log(`loading tag ${num_tags}`)
        if (!postAttrs.post_tags[num_tags]) {
            break;
        }
    }
    title.appendChild(titleText);
    date.appendChild(dateText);
    author.appendChild(authorText);
    tags.appendChild(tagsText);

    title.setAttribute('style', blockAttrs.block_cm['post-title_text-cm']);
    date.setAttribute('style', blockAttrs.block_cm['post-title_date-cm']);
    author.setAttribute('style', blockAttrs.block_cm['post-title_author-cm']);
    tags.setAttribute('style', blockAttrs.block_cm['post-title-tags_wrapper-cm']);

    box.appendChild(title);
    box.appendChild(author);
    box.appendChild(date);
    box.appendChild(tags);

    modgrid.appendChild(box);
    renderBox(box);

    post_title_created = true;
}
function createBlock_post_maincontent(blockAttrs, postAttrs) {
    if (post_maincontent_created) {
        return;
    }

    const box = document.createElement('div');
    box.setAttribute('id', 'post-content_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    const content_scroll = document.createElement('div');
    content_scroll.classList.add('post-content-scroll_wrapper');

    const content_wrapper = document.createElement('div');
    content_wrapper.setAttribute('id', 'post-content_text-cm');
    const content = DOMPurify.sanitize(md.render(postAttrs.post_content));

    content_wrapper.innerHTML = content;
    content_wrapper.setAttribute('style', blockAttrs.block_cm['post-content_text-cm']);
    content_scroll.appendChild(content_wrapper);
    box.appendChild(content_scroll);
    modgrid.appendChild(box);
    renderBox(box);

    post_maincontent_created = true;
}
function createBlock_post_mainimage(blockAttrs, postAttrs) {
    if (post_mainimg_created) {
        return;
    }

    const CM_elements = blockAttrs.block_cm;
    console.log("CM MODE LOADING");
    console.log(CM_elements);

    const box = document.createElement('div');
    box.setAttribute('id', 'post-mainimg_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    const img_container = document.createElement('div');
    img_container.setAttribute('id', 'post-mainimg_container-cm');
    const img_container_contents = document.createElement('div');
    img_container_contents.setAttribute('id', 'post-mainimg_container');
    const img_src = postAttrs.post_main_image;
    const img = document.createElement('img');

    const img_caption = document.createElement('div');
    img_caption.setAttribute('id', 'mainimg_caption-cm');
    const img_captionText = document.createElement('p');
    img_captionText.setAttribute('id', 'mainimg_caption');
    img_captionText.classList.add('img_caption');
    img_captionText.textContent = blockAttrs.image_caption;
    img.setAttribute('id', 'post-mainimg');
    img.setAttribute('src', img_src);
    img_container_contents.appendChild(img);

    img_container.setAttribute('style', blockAttrs.block_cm['post-mainimg_container-cm']);
    img_caption.setAttribute('style', blockAttrs.block_cm['post-mainimg-inputs_row']);

    img_container.appendChild(img_container_contents);
    img_caption.appendChild(img_captionText);
    box.appendChild(img_container);
    box.appendChild(img_caption);
    modgrid.appendChild(box);
    renderBox(box);

    post_mainimg_created = true;
}
function createBlock_post_details(blockAttrs, postAttrs) {
    if (post_details_created) {
        return;
    }
    const box = document.createElement('div');
    box.setAttribute('id', 'post-details_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    const details_wrapper_title = document.createElement('div');
    details_wrapper_title.setAttribute('id', 'post-details-title_text-cm');
    const details_title = document.createElement('h2');
    details_title.textContent = "Details";

    const details_wrapper_date = document.createElement('div');
    details_wrapper_date.classList.add('post-details_wrapper');
    details_wrapper_date.setAttribute('id', 'post-details-date_text-cm');

    const details_wrapper_location = document.createElement('div');
    details_wrapper_location.classList.add('post-details_wrapper');
    details_wrapper_location.setAttribute('id', 'post-details-location_text-cm');

    const details_wrapper_time = document.createElement('div');
    details_wrapper_time.classList.add('post-details_wrapper');
    details_wrapper_time.setAttribute('id', 'post-details-time_text-cm');

    const details_wrapper_info = document.createElement('div');
    details_wrapper_info.classList.add('post-details_wrapper');
    details_wrapper_info.setAttribute('id', 'post-details-info_text-cm');

    const details_date = document.createElement('p');
    const details_location = document.createElement('p');
    const details_time = document.createElement('p');

    details_date.textContent = postAttrs.post_details.details_date;
    details_location.textContent = postAttrs.post_details.details_location;
    details_time.textContent = postAttrs.post_details.details_time;

    const details_info = document.createElement('div');
    details_info.setAttribute('id', 'post-details_info');

    const details_info_content = DOMPurify.sanitize(md.render(postAttrs.post_details.details_info));
    details_info.innerHTML = details_info_content;

    details_wrapper_title.appendChild(details_title);
    details_wrapper_date.appendChild(details_date);
    details_wrapper_location.appendChild(details_location);
    details_wrapper_time.appendChild(details_time);
    details_wrapper_info.appendChild(details_info);

    details_wrapper_title.setAttribute('style', blockAttrs.block_cm['post-details-title_text-cm']);
    details_wrapper_date.setAttribute('style', blockAttrs.block_cm['post-details-date_text-cm']);
    details_wrapper_location.setAttribute('style', blockAttrs.block_cm['post-details-location_text-cm']);
    details_wrapper_time.setAttribute('style', blockAttrs.block_cm['post-details-time_text-cm']);
    details_wrapper_info.setAttribute('style', blockAttrs.block_cm['post-details-info_text-cm']);

    box.appendChild(details_wrapper_title);
    box.appendChild(details_wrapper_date);
    box.appendChild(details_wrapper_location);
    box.appendChild(details_wrapper_time);
    box.appendChild(details_wrapper_info);
    modgrid.appendChild(box);
    renderBox(box);

    post_details_created = true;
}

// ----------------------------------------Custom blocks, no limit

function createBlock_post_text(blockAttrs) {
    const box = document.createElement('div');
    box.classList.add('post-text_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);


    const content_wrapper = document.createElement('div');
    content_wrapper.classList.add('post-text_wrapper');
    const content = DOMPurify.sanitize(md.render(blockAttrs.block_text));
    content_wrapper.innerHTML = content;

    box.appendChild(content_wrapper);

    modgrid.appendChild(box);
    renderBox(box);
}
function createBlock_post_image(blockAttrs) {
    const box = document.createElement('div');
    box.classList.add('post-img_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    const img_container = document.createElement('div');
    img_container.classList.add('post-img_container');
    const img_src = blockAttrs.image_src;
    const img = document.createElement('img');
    const img_caption = document.createElement('p');
    img_caption.textContent = blockAttrs.image_caption;
    img.classList.add('post-img');
    img.setAttribute('src', img_src);
    img_container.appendChild(img);
    box.appendChild(img_container);
    box.appendChild(img_caption);

    modgrid.appendChild(box);
    renderBox(box);
}

// -------------------------------------------Spacer blocks, needed for users to customise layout

function createBlock_spacer(blockAttrs, postAttrs) {
    const box = document.createElement('div');
    box.classList.add('post-spacer_box')
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    modgrid.appendChild(box);
    renderBox(box);
}

// --------------------------------------------Build post

async function populatePost() {



    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postid');
    const postAttr = await fetch(`/api/posts/loadpost?postid=${encodeURIComponent(postId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    const postAttr_json = await postAttr.json();
    const post_author = postAttr_json.author_username;
    const post_authorUID = postAttr_json.uid;
    const post_title = postAttr_json.post_title;
    console.log(post_title);
    const post_date = postAttr_json.post_date;
    const post_content = postAttr_json.post_content;
    const post_main_image = postAttr_json.post_main_image;
    const post_tags = postAttr_json.post_tags;
    const post_boxesArray = postAttr_json.post_boxes;
    const post_details = postAttr_json.post_details;
    const stickers = postAttr_json.stickers;

    modgrid = document.getElementById('modgrid_wrapper');

    for (const blockInfo in post_boxesArray) {

        const blockInfo_json = post_boxesArray[blockInfo];

        const block_type = blockInfo_json.block_type;

        if (block_type == 'details' && !post_details.details_date) {
            console.log(`skipped ${block_type} block`);
        } else if ((block_type == 'image' && !blockInfo_json.image_src) || (block_type == 'mainimage' && !post_main_image)) {
            console.log(`skipped ${block_type} block`);
        } else if ((block_type == 'text' && !blockInfo_json.block_text) || (block_type == 'maincontent' && !post_content)) {
            console.log(`skipped ${block_type} block`);
        } else {
            const blockbuilder = blockBuilders[block_type];
            if(blockInfo_json.block_cm === undefined) {
                blockInfo_json.block_cm = [];
                console.log(`${block_type} block has no CM styling`);
            }
            blockbuilder(blockInfo_json, postAttr_json);
        }
    }
    const stickers_dest = document.getElementById('stickers_overlay');
    for (const sticker of stickers){
        console.log('sticker loading');
        console.log(sticker);
        const sticker_wrapper = document.createElement('div');
        sticker_wrapper.classList.add('sticker_wrapper');
        const sticker_img = document.createElement('img')
        sticker_img.classList.add('sticker_img');

        sticker_img.setAttribute('src', sticker.src);
        sticker_wrapper.setAttribute('style', sticker.style);

        sticker_wrapper.appendChild(sticker_img);
        stickers_dest.appendChild(sticker_wrapper);
    }
}