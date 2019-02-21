function getContentFromClipboard() {
    var clipboardText = '';
    var t = document.createElement("input");
    
    document.body.appendChild(t);
    t.focus();
    document.execCommand("paste");
    
    var clipboardText = t.value; 
    document.body.removeChild(t);

    return clipboardText
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'toggleReverse') {
        document.execCommand('copy');
        chrome.runtime.sendMessage({"action": "reverse"}, function() { document.execCommand('paste'); });
    }
})