// Delete photo based on UUID
function deletePhoto(uuid, redirect) {
    if (!confirm("Are you sure you want to delete the photo?")) {
        return;
    }

    // Create the request
    const request = new XMLHttpRequest();

    request.addEventListener("load", function (event) {
        window.location.href = redirect;
        return true;
    });

    request.addEventListener("timeout", function (event) {
        return false;
    });

    request.addEventListener("error", function (event) {
        return false;
    });

    request.addEventListener("abort", function (event) {
        return false;
    });

    // Send the request
    request.open("DELETE", `/api/photos/${uuid}`);
    request.send();
}

// Download photo based on UUID from Nodture
function downloadPhoto(uuid) {
    // Redirect as if the user clicked a link
    window.location.href = `/api/photos/${uuid}`;
}

// Upload photo(s) to Nodture
function uploadPhotos(formId) {
    // Create the request
    const request = new XMLHttpRequest();

    // Create FormData from formId
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    //console.log(formData.getAll("photos"));

    request.addEventListener("load", function (event) {
        if (vue) {
            vue.reloadPhotos();
        }
    });

    request.addEventListener("timeout", function (event) {
        return false;
    });

    request.addEventListener("error", function (event) {
        return false;
    });

    request.addEventListener("abort", function (event) {
        return false;
    });

    // Send the request
    request.open("POST", "/api/photos");
    request.send(formData);
}