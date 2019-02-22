function getContentFromClipboard() {
    var clipboardText = '';
    var t = document.createElement("input");
    
    document.body.appendChild(t);
    
    t.focus();
    document.execCommand("paste");
    clipboardText = t.value; 
    
    document.body.removeChild(t);

    return clipboardText
}

function setContentToClipboard(text) {
    var t = document.createElement("textarea");
    
    t.textContent = text;
    document.body.appendChild(t);
    t.select()
    document.execCommand('copy');

    document.body.removeChild(t);
}

function reverseHebrewText (text) {
    return text.split("").reverse().join("");
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == "reverse") {
        //console.log ('onMessage reverse');
        var clipboardText = getContentFromClipboard();
        
        reversedText = reverseHebrewText(clipboardText)
        setContentToClipboard(reversedText);
        sendResponse();
    }
});
    
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'r2l') {
        chrome.tabs.executeScript({
            code: 'document.execCommand("copy"); chrome.runtime.sendMessage({"action": "reverse"}, function() { document.execCommand("paste"); });'
        });
    }
});