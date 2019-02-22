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

function reverseHebrewText (text, callback) {
    require.config({
        baseUrl: "inc/dbidi"
    });

    require([
        "TextLayoutEngine"
    ], function (TextLayoutEngine) {
        var bdEngine = new TextLayoutEngine();
        var newText;
        
        //console.log ("orig text: " + text);
        newText = bdEngine.bidiTransform(bdEngine.bidiTransform(text,"ICNNN","IDNNN"),"ICNNN","VLNNN");
        //console.log ("new text: " + newText);

        callback(newText);
    });
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == "reverse") {
        var clipboardText = getContentFromClipboard();

        reverseHebrewText(clipboardText, function(newText) {
            setContentToClipboard(newText);
            sendResponse();
        });
    }
});
    
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'r2l') {
        chrome.tabs.executeScript({
            // this is just a POC workaround for too quick paste, TODO fix (eventhough everthing is correctly callbacked stacked... so why is the paste before the copy?!)
            code: 'document.execCommand("copy"); chrome.runtime.sendMessage({"action": "reverse"}, function() { setTimeout (function() { document.execCommand("paste"); }, 100); });'
        });
    }
});