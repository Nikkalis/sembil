
// import { Sequelize } from "sequelize";
window.addEventListener("load", populateFeed);
let modgrid = null;
async function populateFeed() {
    modgrid = document.getElementById('modgrid_wrapper');
    console.log("populateFeed begin");

    // const sequelize = new Sequelize('postgres://postgres:localhost:5432/sembildb');
    // const postsNum = await fetch("/api/posts/totalposts");
    const loadAmount = 20;

    for (let current_post = 1; current_post <= loadAmount; current_post++) {
        console.log(`attempting load of post ${current_post} out of ${loadAmount}...`);
        const params = new URLSearchParams();
        params.append("postnum", current_post);
        console.log(`getting post with params: ${params}`);
        const postAttr = await fetch(`/api/posts/loadpost?${params}`);
        console.log(`post get status: ${postAttr.status}`);
        const postAttr_json = await postAttr.json();
        console.log(`found postid: ${postAttr_json.postid}`);
        if (postAttr_json.postid) {
            console.log(`post found with id: ${postAttr_json.postid}`);
            // Make post
            loadPost(postAttr_json);
        }
        else {
            console.log("WHERES THE POST");
            break;
        }
    }
}

async function loadPost(postAttrs) {
    const postid = postAttrs.postid;
    const box = document.createElement('div');
    box.classList.add('feed-post_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(postAttrs.preview_size);

    const link = document.createElement('a');
    link.classList.add('feed-post_link');
    link.setAttribute('href', `postview.html?postid=${postid}`);

    const post_infowrapper = document.createElement('div');
    post_infowrapper.classList.add('feed-post-info_wrapper');

    const post_contentwrapper = document.createElement('div');
    post_contentwrapper.classList.add('feed-post-content_wrapper');

    const title = document.createElement('h1');
    title.classList.add('feed-post-title_text');
    title.textContent = postAttrs.post_title;

    const date = document.createElement('p');
    date.classList.add('feed-post-title_date');
    date.textContent = postAttrs.post_date;

    const author = document.createElement('p');
    author.classList.add('feed-post-title_author');
    author.textContent = `Created by: ${postAttrs.author_display_name}`;

    const desc = document.createElement('p');
    desc.classList.add('post-title_desc');
    desc.textContent = postAttrs.post_desc;

    const tags = document.createElement('div');
    tags.classList.add('feed-post-tags_wrapper');
    let tagsleft = true;
    let num_tags = 0;
    while (tagsleft) {
        const tag = document.createElement('div');
        tag.classList.add('feed-post-tags_item');
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

    link.appendChild(title);
    post_infowrapper.appendChild(author);
    post_infowrapper.appendChild(date);

    post_contentwrapper.appendChild(desc);

    if (postAttrs.post_main_image) {
        const img_container = document.createElement('div');
        img_container.classList.add('feed-post-img_container');
        const img_src = postAttrs.post_main_image;
        const img = document.createElement('img');
        img.classList.add('post-img');
        img.setAttribute('src', img_src);
        img_container.appendChild(img);
        post_contentwrapper.appendChild(img_container);
    }

    // append everything, adding to dom


    link.appendChild(post_infowrapper);
    link.appendChild(post_contentwrapper);
    link.appendChild(tags);
    link.addEventListener('click', () => set_post_clicked(postAttrs.postid));

    box.appendChild(link);

    modgrid.appendChild(box);
}

function set_post_clicked(postid) {
    const clicked_res = fetch(`/api/posts/setclickedpost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            post_clicked: postid
        })
    })
    console.log(clicked_res.status);
}