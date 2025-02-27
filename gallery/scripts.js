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

    document.getElementById("clearGallery").addEventListener("click", function () {
        const secretCode = prompt("Enter the secret code to clear the gallery:");
    
        if (secretCode === "Leya2003") {  // Change this to your own secret code
            localStorage.removeItem("galleryImages");
            alert("Gallery cleared!");
            location.reload();
        } else {
            alert("Incorrect code. You are not authorized to clear the gallery.");
        }
    });
    
});


// please work
