
// import { Sequelize } from "sequelize";

import { likePost } from "./scripts";
window.addEventListener("load", populateFeed);
let modgrid = null;
let areposts = false;
const search_status = document.getElementById("search_status");
async function populateFeed(isFailedSearch) {
    
    modgrid = document.getElementById('modgrid_wrapper');

    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    
    if(search && !isFailedSearch){
        
        console.log(search);
        let reload = false;
        areposts = await searchPosts(search, reload);
        console.log(areposts);
        if(areposts == true){
        return;
        }
    }

    console.log("populateFeed begin");


    const loadAmount = 2000;

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

document.getElementById('search_input').addEventListener("keypress", function (e) {
    if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
        console.log("search request sent...");
        e.preventDefault();
        let reload = true;
        searchPosts(document.getElementById('search_input').value, reload);
    }})
async function searchPosts(searchQuery, reload) {
    if(reload){
        const params = new URLSearchParams({search: searchQuery});
        history.pushState({}, "", `index.html?${params}#feed_section`);
    }
    console.log(`Searching for: ${searchQuery}`);
    const searchRes = await fetch(`/api/posts/search?search=${searchQuery}`);
    const searchRes_json = await searchRes.json();
    console.log(`Search status: ${searchRes.status}`);
    document.getElementById('search_results').scrollIntoView();
    if (searchRes_json[0]) {
        if (searchRes_json.length > 1) {search_status.textContent = `Found ${searchRes_json.length} posts!`;}
        else {search_status.textContent = `Found ${searchRes_json.length} post!`;}
        search_status.classList.remove('inactive'); 
        document.getElementById('modgrid_wrapper').innerHTML = null;
        for (let resultItem of searchRes_json) {
            console.log(`post found with id: ${resultItem.postid}`);
            console.log(`found ${searchRes_json.length} posts`);
            

            const params = new URLSearchParams();
            params.append("postid", resultItem.postid);
            console.log(`getting post with params: ${params}`);
            const postAttr = await fetch(`/api/posts/loadpost?${params}`);
            console.log(`post get status: ${postAttr.status}`);
            const postAttr_json = await postAttr.json();
            if (resultItem.postid) {
                console.log(`post found with id: ${resultItem.postid}`);
                // Make post
                loadPost(postAttr_json);
                
            }
            else {
                console.log("WHERES THE POST");
                
            }
        }
    }
    else {
        console.log("Search failed");
        
        populateFeed(true);
        search_status.textContent = "No results found... So here's everything instead";
        search_status.classList.remove('inactive');  
        

    }
}

async function loadPost(postAttrs) {
    const postid = postAttrs.postid;
    const box = document.createElement('div');
    box.classList.add('feed-post_box');
    box.classList.add('modgrid_item');
    box.classList.add('wireframe-element');
    box.classList.add(postAttrs.preview_size);
    box.setAttribute('data-postid', postid);

    const likeIcon = document.createElement('button');
    likeIcon.classList.add('icons_like');
    likeIcon.addEventListener('click', () => likePost(likeIcon));

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
    author.textContent = `${postAttrs.author_display_name}`;

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
    try {
        const isLiked = await fetch(`/api/posts/checkstatus?postid=${postid}`);
        const isLiked_json = await isLiked.json();

        if (isLiked_json.liked_postids) {
            likeIcon.classList.add('state-liked');
        }
    } catch {

    }


    link.appendChild(post_infowrapper);
    link.appendChild(post_contentwrapper);
    link.appendChild(tags);
    // link.addEventListener('click', () => set_post_clicked(postAttrs.postid));

    box.appendChild(link);
    box.appendChild(likeIcon);

    modgrid.appendChild(box);
}

// function set_post_clicked(postid) {
//     const clicked_res = fetch(`/api/posts/setclickedpost`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             post_clicked: postid
//         })
//     })
//     console.log(clicked_res.status);
// }