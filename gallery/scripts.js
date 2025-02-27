document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.getElementById("galleryContainer");
    const savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];

    if (savedImages.length === 0) {
        galleryContainer.innerHTML = "<p>No images saved yet.</p>";
    } else {
        savedImages.forEach(imageData => {
            let img = document.createElement("img");
            img.src = imageData;
            galleryContainer.appendChild(img);
        });
    }

    
});


// please work
