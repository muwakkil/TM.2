document.addEventListener("DOMContentLoaded", async function () {
    const galleryContainer = document.getElementById("galleryContainer");

    // Initialize IndexedDB
    async function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("ImageStoreDB", 1);

            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                reject("IndexedDB error: " + event.target.error);
            };
        });
    }

    // Function to load images from IndexedDB
    async function loadImagesFromDB() {
        const db = await initDB();
        if (!db) {
            galleryContainer.innerHTML = "<p>Error loading gallery.</p>";
            return;
        }

        const transaction = db.transaction("images", "readonly");
        const store = transaction.objectStore("images");
        const request = store.getAll();

        request.onsuccess = function () {
            if (request.result.length === 0) {
                galleryContainer.innerHTML = "<p>No images saved yet.</p>";
            } else {
                request.result.forEach(imageData => {
                    let img = document.createElement("img");
                    img.src = imageData.image;
                    img.style.width = "100px"; // Adjust size as needed
                    img.style.margin = "5px";
                    galleryContainer.appendChild(img);
                });
            }
        };

        request.onerror = function () {
            galleryContainer.innerHTML = "<p>Failed to load images.</p>";
        };
    }

    // Load images when page loads
    await loadImagesFromDB();

    // Clear Gallery Button
    document.getElementById("clearGallery").addEventListener("click", async function () {
        const secretCode = prompt("Enter the secret code to clear the gallery:");

        if (secretCode === "Leya2003") { // Change this to your own secret code
            const db = await initDB();
            if (!db) {
                alert("Error accessing the database.");
                return;
            }

            const transaction = db.transaction("images", "readwrite");
            const store = transaction.objectStore("images");
            store.clear();

            transaction.oncomplete = function () {
                alert("Gallery cleared!");
                location.reload();
            };

            transaction.onerror = function () {
                alert("Failed to clear gallery.");
            };
        } else {
            alert("Incorrect code. You are not authorized to clear the gallery.");
        }
    });
});

