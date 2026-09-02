
document.getElementById("messaging-input-send_button").addEventListener("click", sendMessage, false);
document.getElementById("messaging-input_field").addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {  //checks whether the pressed key is "Enter"
        console.log("hi");
        e.preventDefault();
        sendMessage();
    }})

const accountPfp = document.createElement("img");
accountPfp.classList.add("profile-header-picture_img");
accountPfp.setAttribute("src", "static/images/test-img.png");
function sendMessage() {
    let anchor = document.getElementById("anchor");
    let messageContent = document.getElementById("messaging-input_field").value;
    if (messageContent) {
        let newMessageWrapper = document.createElement("div");
        let newMessage = document.createElement("div");
        let newPfpWrapper = document.createElement("div");
        let accountPfp = document.createElement("img");
        accountPfp.classList.add("profile-header-picture_img");
        accountPfp.setAttribute("src", "static/images/test-img.png");
        newPfpWrapper.classList.add("messaging-chatview-picture_wrapper");
        newMessageWrapper.classList.add("messaging-chatview-message_wrapper");
        newMessageWrapper.classList.add("outgoing-message");
        newMessage.classList.add("messaging-chatview-message_box");
        newMessage.textContent = messageContent;
        newPfpWrapper.appendChild(accountPfp);
        newMessageWrapper.appendChild(newPfpWrapper);
        newMessageWrapper.appendChild(newMessage);
        let messageChatview = document.getElementById("messaging-chatview_wrapper");
        messageChatview.insertBefore(newMessageWrapper, anchor);
        document.getElementById("messaging-input_field").value = null;
    }
}