window.addEventListener("paste", function(e){

    // Handle the event
    retrieveImageFromClipboardAsBase64(e, function(imageDataBase64){
        // If there's an image, open it in the browser as a new window :)
        if(imageDataBase64){
            // data:image/png;base64,iVBORw0KGgoAAAAN......
            // $("textarea").val(imageDataBase64)
            $.ajax({
                type: 'post',
                url: '/api/upload/img',
                data: JSON.stringify({base64: imageDataBase64}),
                contentType: "application/json",
                dataType: 'json',
                timeout: 20e3,
                success: function (res) {
                    console.log(res)
                    $("textarea").val(res.url)
                }
            });
        }
    });
}, false);

function retrieveImageFromClipboardAsBase64(pasteEvent, callback, imageFormat){
    if(pasteEvent.clipboardData == false){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };

    // retrive elements from clipboard
    var items = pasteEvent.clipboardData.items;

    if(items == undefined){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };
    // loop the elements
    for (var i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();

        // Create an abstract canvas and get context
        var mycanvas = document.createElement("canvas");
        var ctx = mycanvas.getContext('2d');

        // Create an image
        var img = new Image();

        // Once the image loads, render the img on the canvas
        img.onload = function(){
            // Update dimensions of the canvas with the dimensions of the image
            mycanvas.width = this.width;
            mycanvas.height = this.height;

            // Draw the image
            ctx.drawImage(img, 0, 0);

            // Execute callback with the base64 URI of the image
            if(typeof(callback) == "function"){
                callback(mycanvas.toDataURL(
                    (imageFormat || "image/png")
                ));
            }
        };

        // Crossbrowser support for URL
        var URLObj = window.URL || window.webkitURL;

        // Creates a DOMString containing a URL representing the object given in the parameter
        // namely the original Blob
        img.src = URLObj.createObjectURL(blob);
    }
}
