
import TurndownService from "turndown";
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

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

    const title = document.createElement('h1');
    title.classList.add('post-title_text');
    title.textContent = postAttrs.post_title;

    const date = document.createElement('p');
    date.classList.add('post-title_date');
    date.textContent = postAttrs.post_date;

    const author = document.createElement('p');
    author.classList.add('post-title_author');
    author.textContent = `Created by: ${postAttrs.author_display_name}`;

    const tags = document.createElement('div');
    tags.classList.add('tags_wrapper');
    let tagsleft = true;
    let num_tags = 0;
    while (tagsleft) {
        const tag = document.createElement('div');
        tag.classList.add('tags_item');
        const tag_text = document.createElement('p');
        tag_text.textContent = postAttrs.post_tags[num_tags];
        tag.appendChild(tag_text);
        tags.appendChild(tag);
        num_tags++;
        console.log(`loading tag ${num_tags}`)
        if (!postAttrs.post_tags[num_tags]) {
            break;
        }
    }
    box.appendChild(title);
    box.appendChild(author);
    box.appendChild(date);
    box.appendChild(tags);

    modgrid.appendChild(box);

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

    const content_wrapper = document.createElement('div');
    content_wrapper.setAttribute('id', 'post-content_wrapper');
    const content = DOMPurify.sanitize(md.render(postAttrs.post_content));

    content_wrapper.innerHTML = content;

    box.appendChild(content_wrapper);
    modgrid.appendChild(box);

    post_maincontent_created = true;
}
function createBlock_post_mainimage(blockAttrs, postAttrs) {
    if (post_mainimg_created) {
        return;
    }
    const box = document.createElement('div');
    box.setAttribute('id', 'post-mainimg_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    const caption = document.createElement('div');

    const img_container = document.createElement('div');
    img_container.setAttribute('id', 'post-mainimg_container');
    const img_src = postAttrs.post_main_image;
    const img = document.createElement('img');
    const img_caption = document.createElement('p');
    img_caption.setAttribute('id', 'mainimg_caption');
    img_caption.classList.add('img_caption');
    img_caption.textContent = blockAttrs.image_caption;
    img.setAttribute('id', 'post-mainimg');
    img.setAttribute('src', img_src);
    img_container.appendChild(img);

    box.appendChild(img_container);
    box.appendChild(img_caption);
    modgrid.appendChild(box);

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

    const details_title = document.createElement('h2');
    details_title.textContent = "Details";

    const details_wrapper = document.createElement('div');
    details_wrapper.setAttribute('id', 'post-details_wrapper');

    const details_list = document.createElement('ul');
    details_list.setAttribute('id', 'post-details_list');

    const details_date = document.createElement('li');
    const details_location = document.createElement('li');
    const details_time = document.createElement('li');

    details_date.textContent = postAttrs.post_details.details_date;
    details_location.textContent = postAttrs.post_details.details_location;
    details_time.textContent = postAttrs.post_details.details_time;

    const details_info = document.createElement('div');
    details_info.setAttribute('id', 'post-details_info');

    const details_info_content = DOMPurify.sanitize(md.render(postAttrs.post_details.details_info));
    details_info.innerHTML = details_info_content;

    details_list.appendChild(details_date);
    details_list.appendChild(details_location);
    details_list.appendChild(details_time);

    details_wrapper.appendChild(details_list);
    details_wrapper.appendChild(details_info);

    box.appendChild(details_title);
    box.appendChild(details_wrapper);
    modgrid.appendChild(box);

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
}

// -------------------------------------------Spacer blocks, needed for users to customise layout

function createBlock_spacer(blockAttrs, postAttrs) {
    const box = document.createElement('div');
    box.classList.add('post-spacer_box')
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(blockAttrs.block_size);

    modgrid.appendChild(box);
}

// --------------------------------------------Build post

async function populatePost() {



    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postid');
    const postAttr = await fetch(`/api/posts/loadpost?postid=${encodeURIComponent(postId)}`);
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
            blockbuilder(blockInfo_json, postAttr_json);
        }



    }
}