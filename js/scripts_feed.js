
// import { Sequelize } from "sequelize";
import * as THREE from 'three';
import { likePost, renderBox, labelRenderedItems } from "./scripts";
let currentLoad = Promise.resolve();
let loadId = 0;
let searchPageStarts = { 1: 0 };
let searchMode = false;

const modgrid = document.getElementById('modgrid_wrapper');
let areposts = false;
const search_status = document.getElementById("search_status");
window.addEventListener("load", () => runExclusive((isStale) => populateFeed(isStale)));
function wipeModgrid() {
    const allCanvases = document.getElementById('modgrid_wrapper').getElementsByTagName('canvas');
    for (let canvas of allCanvases) {
        const r = canvas.renderer;
        if (!r) continue;
        r.setAnimationLoop(null);
        r.dispose();
        r.forceContextLoss();

        console.log('FUCK YOUR BUM ASS CANVAS');
    }
}

function runExclusive(task) {
    const myId = ++loadId;
    const isStale = () => myId !== loadId;
    currentLoad = currentLoad
        .catch(() => { })
        .then(() => {
            if (isStale()) return;
            wipeModgrid();
            modgrid.innerHTML = '';
            return task(isStale);
        });
    return currentLoad;
}

const pageStarts = { 1: 9999999 };
let loadPrev = false;
const loadAmount = 10;
async function populateFeed(isStale, isFailedSearch) {
    pagination_next.classList.add('invisible');
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');

    if (search && !isFailedSearch) {

        console.log(search);
        let reload = false;
        areposts = await searchPosts(isStale, search, reload);
        console.log(areposts);
        return;

    }

    console.log("populateFeed begin");
    const page = feed_pagenum;
    let current_post = pageStarts[page] ?? 9999999;

    if (isStale()) return;
    console.log(`attempting load of posts starting from ${current_post + 1} out of ${loadAmount}...`);
    const paramsnum = new URLSearchParams();
    console.log('bitch');
    paramsnum.append("postnum", current_post);
    console.log(`getting post with params: ${paramsnum}`);
    const postAttrs = await fetch(`/api/posts/loadpost?${paramsnum}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            
        });
    const postAttrs_json = await postAttrs.json();
    if (isStale()) return;
    for (let i = 0; i < loadAmount; i++) {
        if (isStale()) return;
        const postAttr_json = postAttrs_json[i];
        console.log(postAttr_json)
        if (isStale()) return;

        current_post = postAttr_json?.postnum;
        if(!current_post) {
            break;
        }

        if (isStale()) return;
        console.log(`found postid: ${postAttr_json.postid}`);
        if (postAttr_json.postid) {
            console.log(`post found with id: ${postAttr_json.postid}`);
            // Make post
            await loadPost(isStale, postAttr_json);
        }
        else {
            console.log("WHERES THE POST");
            break;
        }
    }
    pageStarts[page + 1] = current_post;
    if (pageStarts[feed_pagenum + 1]) { 
        pagination_next.classList.remove('invisible');
    }
    labelRenderedItems();


}

const pagination_prev = document.getElementById('pagination-previous_button');
const pagination_next = document.getElementById('pagination-next_button');
const pagination_pagenum = document.getElementById("pagination_pagenum");
let feed_pagenum = 1;
const params = new URLSearchParams(window.location.search);
const pagenum = params.get('pagenum');
if (pagenum) {
    feed_pagenum = Number(pagenum);
} else {
    pagination_prev.classList.add('invisible');
}
pagination_next.addEventListener('click', () => {
    if (pageStarts[feed_pagenum + 1] || (searchMode && searchPageStarts[feed_pagenum+1])) { 
        
     }
    else {
        console.log('was it because of search mode?')
        console.log(searchMode)
        return;}
    feed_pagenum++;
    console.log(`loading page ${feed_pagenum}. . . . . .`);
    pagination_pagenum.textContent = feed_pagenum;
    if (feed_pagenum > 1) {
        pagination_prev.classList.remove('invisible');
    } else {
        pagination_prev.classList.add('invisible');
    }
    runExclusive((isStale) => page_next(isStale))
});
pagination_prev.addEventListener('click', () => {
    if (feed_pagenum === 1) { return; }
    feed_pagenum--;
    console.log(`loading page ${feed_pagenum}. . . . . .`);
    pagination_pagenum.textContent = feed_pagenum;
    if (feed_pagenum > 1) {
        pagination_prev.classList.remove('invisible');
    } else {
        pagination_prev.classList.add('invisible');
    }
    runExclusive((isStale) => page_prev(isStale))
});
async function page_next(isStale) {

    if (isStale()) {
        loadPrev = false;
        return;
    }
    wipeModgrid();
    document.getElementById('modgrid_wrapper').innerHTML = null;
    if (isStale()) {
        loadPrev = false;
        return;
    }
    await populateFeed(isStale);
}
async function page_prev(isStale) {
    if (isStale()) {
        loadPrev = false;
        return;
    }
    loadPrev = true;
    wipeModgrid();
    document.getElementById('modgrid_wrapper').innerHTML = null;
    if (isStale()) {
        loadPrev = false;
        return;
    }
    await populateFeed(isStale);
    loadPrev = false;
}

document.getElementById('search_input').addEventListener("keypress", function (e) {
    if (e.key === "Enter") {  //checks whether the pressed key is "Enter"
        console.log("search request sent...");
        feed_pagenum = 1;
        pagination_pagenum.textContent = feed_pagenum;
        if (feed_pagenum > 1) {
            pagination_prev.classList.remove('invisible');
        } else {
            pagination_prev.classList.add('invisible');
        }
        e.preventDefault();
        let reload = true;

        runExclusive((isStale) => searchPosts(isStale, document.getElementById('search_input').value, reload));
    }
})

async function searchPosts(isStale, searchQuery, reload) {
    searchMode = true;
    if (reload) {
        const params = new URLSearchParams({ search: searchQuery });
        history.pushState({}, "", `index.html?${params}#feed_section`);
    }
    console.log(`Searching for: ${searchQuery}`);
    pagination_next.classList.add('invisible');
    const searchRes = await fetch(`/api/posts/search?search=${searchQuery}`);
    const searchRes_json = await searchRes.json();

    if (isStale()) return;
    console.log(`Search status: ${searchRes.status}`);
    // document.getElementById('search_results').scrollIntoView();
    if (searchRes_json[0]) {
        if (searchRes_json.length > 1) { search_status.textContent = `Found ${searchRes_json.length} posts!`; }
        else { search_status.textContent = `Found ${searchRes_json.length} post!`; }
        search_status.classList.remove('inactive');
        wipeModgrid();
        document.getElementById('modgrid_wrapper').innerHTML = null;
        let i = searchPageStarts[feed_pagenum];
        console.log(i);
        const params = new URLSearchParams();
        params.append("search", true);
        console.log(`getting posts with params: ${params}`);
        const postAttr = await fetch(`/api/posts/loadpost?${params}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postids: searchRes_json
            })
        });
        console.log(`posts get status: ${postAttr.status}`);
        const postAttrs_json = await postAttr.json();
        console.log(postAttrs_json.length);
        let searchLoadAmount = loadAmount+i-1;
        if (searchLoadAmount >= searchRes_json.length) {
            pagination_next.classList.add('invisible');
        }else{
            pagination_next.classList.remove('invisible');
        }
        for (let resultItem of searchRes_json) {
            console.log(`this is the max ${searchLoadAmount}`)
            console.log(`this is the max ${postAttrs_json.length}`)
            if (i > searchLoadAmount || i >= postAttrs_json.length) {
                
                break;
            }

            if (isStale()) {
                if (pageStarts) {
                    loadPrev = false;
                }
                return;
            }

            console.log(`found ${searchRes_json.length} posts`);
            console.log(`actually found ${postAttrs_json.length} posts`);
            console.log(`loading post ${i}`);

            const postAttr_json = postAttrs_json[i];
            console.log(`loading post with attrs ${postAttrs_json[i]}`);
            if (resultItem.postid) {
                console.log(`post found with id: ${resultItem.postid}`);
                // Make post
                await loadPost(isStale, postAttr_json);

            }
            else {
                console.log("WHERES THE POST");

            }
            if (isStale()) return;
            i++;
        }
        searchPageStarts[feed_pagenum+1] = i;

        labelRenderedItems();
        if(i >= searchRes_json.length){
            searchMode = false;
        }
        return true;
    }
    else {
        console.log("Search failed");
        if (isStale()) return;
        wipeModgrid();
        document.getElementById('modgrid_wrapper').innerHTML = null;

        search_status.textContent = "No results found... So here's everything instead";
        searchMode = false;
        search_status.classList.remove('inactive');
        await populateFeed(isStale, true);
        
        return false;
    }
}

async function loadPost(isStale, postAttrs) {
    const postid = postAttrs.postid;
    const box = document.createElement('div');
    box.classList.add('feed-post_box');
    box.classList.add('modgrid_item');
    box.classList.add('render');
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

    if (isStale()) return;
    modgrid.appendChild(box);

    renderBox(box);

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