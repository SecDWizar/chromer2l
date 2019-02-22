/*function getContentFromClipboard() {
    var clipboardText = '';
    var t = document.getElementById("sandbox");
    
    t.value = '';
    t.select();
    if (document.execCommand('paste')) {
        clipboardText = t.value;
        console.log ("got clipboardText: " + clipboardText);
    }
    t.value = '';
    
    return clipboardText
}

function setContentToClipboard(text) {
    var t = document.getElementById("sandbox");
    
    t.textContent = text;
    t.select();
    document.execCommand('copy');
    t.value = '';
    //return document.execCommand('copy');
}*/

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

//function reverseHebrewText (text) {
function reverseHebrewText (text, callback) {
    //original from Feb. 21 2019
    //return text.split("").reverse().join("");
    
    //from Feb. 22 2019, initial POC using IBM dbidi
    require.config({
        baseUrl: "inc/dbidi"
    });

    require([
        "TextLayoutEngine"
    ], function (TextLayoutEngine) {
        var bdEngine = new TextLayoutEngine();
        var newText;

        //bdEngine.inputFornat = "VLYNN";
        /* 
        bdEngine.outputFormat = "VLNNN";:
            orig text: םולש english ייב
            new text: שלום english ביי
        bdEngine.outputFormat = "VRNNN";:
            orig text: שלום english ביי
            new text: ביי hsilgne שלום
        bdEngine.outputFormat = "VCNNN";:
            orig text: שלום english ביי
            new text: ביי hsilgne שלום
        bdEngine.outputFormat = "VDNNN";:
            orig text: שלום english ביי
            new text: ביי hsilgne שלום
        */
        /*      
        //var newText1 = bdEngine.bidiTransform(text,"ILNNN","VLNNN");
        bdEngine.outputFormat = "ICNNN";
        bdEngine.outputFormat = "IDNNN";
        var newText1 = bdEngine.bidiTransform(text);
        console.log ("newText1 text: " + newText1);

        //var newText2 = bdEngine.bidiTransform(newText1,"VRNNN","VDNNN");
        bdEngine.inputFornat = "ICNNN";
        bdEngine.outputFormat = "VLNNN";
        var newText2 = bdEngine.bidiTransform(newText1);
        console.log ("newText2 text: " + newText2);

        //bdEngine.outputFormat = "VLNNN";
        //var newText3 = bdEngine.bidiTransform(newText2);
        //console.log ("newText3 text: " + newText3);
        
        //newText = newText2;
        */
        
        //console.log ("orig text: " + text);
        newText = bdEngine.bidiTransform(bdEngine.bidiTransform(text,"ICNNN","IDNNN"),"ICNNN","VLNNN");
        //console.log ("new text: " + newText);

        //return newText;
        callback(newText);
    });
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == "reverse") {
        //console.log ('onMessage reverse');
        var clipboardText = getContentFromClipboard();
        
        //reversedText = reverseHebrewText(clipboardText)
        //setContentToClipboard(reversedText);
        //sendResponse();

        reverseHebrewText(clipboardText, function(newText) {
            console.log ("in callback reverseHebrewText: " + newText);
            setContentToClipboard(newText);
            sendResponse();
        });
    }
});
    
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'r2l') {
        chrome.tabs.executeScript({
            // this is just a POC workaround for too quick paste, TODO fix (eventhough everthing is correctly callbacked stacked... so why is the paste before the copy?!)
            //code: 'document.execCommand("copy"); chrome.runtime.sendMessage({"action": "reverse"}, function() { document.execCommand("paste"); });'
            //code: 'document.execCommand("copy"); chrome.runtime.sendMessage({"action": "reverse"}, function() { alert ("pause"); document.execCommand("paste"); });'
            code: 'document.execCommand("copy"); chrome.runtime.sendMessage({"action": "reverse"}, function() { setTimeout (function() { document.execCommand("paste"); }, 100); });'
        });
    }
});