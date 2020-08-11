window.addEventListener("load", function () {
    function sendData() {
        const XHR = new XMLHttpRequest();

        // Bind the FormData object and the form element
        const FD = new FormData(form);

        // Define what happens on successful data submission
        XHR.addEventListener("load", function (event) {
            console.log("Upload complete.");
            
            vue.reloadPhotos();
        });

        // Define what happens in case of error
        XHR.addEventListener("error", function (event) {
            console.log("Upload failed.");
        });

        // Set up our request
        XHR.open("POST", "/upload");

        // The data sent is what the user provided in the form
        XHR.send(FD);
    }

    // Access the form element...
    const form = document.getElementById("uploader");

    // ...and take over its submit event.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        sendData();
    });
});

function closePopup() {
    document.getElementById("popup-holder").style.visibility = "hidden";
    document.getElementById("popup-holder").style.opacity = "0";
}

function openPopup() {
    document.getElementById("popup-holder").style.visibility = "visible";
    document.getElementById("popup-holder").style.opacity = "1";
}