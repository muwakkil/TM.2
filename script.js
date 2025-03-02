document.addEventListener("DOMContentLoaded", function () {
    const bgToggle = document.getElementById("bgToggle");
    const bgImageToggle = document.getElementById("bgImageToggle");
    const mediaBox = document.getElementById("mediaBox");
    const colorPicker = document.getElementById("colorPicker");

    if (!mediaBox || !bgToggle || !bgImageToggle || !colorPicker) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    const bgColors = ["#ddd", "#F2D8C2", "#DB8076", "#BF2121", "#D94A4A", "#47B3DB", "#A47ED9", "#70671A", "#BDBF6F", "#F2D8C2", "#592202"];
    let colorIndex = 0;

    const bgImages = ["bgi1.png", "bgi2.png", "bgi3.png", "bgi4.png", "bgi5.png", "bgi6.png", "bgi7.png", "bgi8.png", "bgi9.png", "bgi10.png"];
    let imageIndex = 0;

    bgToggle.addEventListener("click", function () {
        colorIndex = (colorIndex + 1) % bgColors.length;
        mediaBox.style.background = bgColors[colorIndex];
    });

    bgImageToggle.addEventListener("click", function () {
        imageIndex = (imageIndex + 1) % bgImages.length;
        mediaBox.style.backgroundImage = `url('bgimages/${bgImages[imageIndex]}')`;
        mediaBox.style.backgroundSize = "100% 100%";
        mediaBox.style.backgroundPosition = "center";
        mediaBox.style.backgroundRepeat = "no-repeat";
    });

    document.getElementById("reloadButton").addEventListener("click", function () {
        location.reload(true);
    });

    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("ImageStoreDB", 1);

            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("images")) {
                    db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
                }
            };

            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                reject("IndexedDB error: " + event.target.error);
            };
        });
    }

    async function saveImageToDB(imageData) {
        try {
            const db = await initDB();
            const transaction = db.transaction("images", "readwrite");
            const store = transaction.objectStore("images");
            store.add({ image: imageData });
        } catch (error) {
            console.error("Database save failed:", error);
        }
    }

    async function loadImages() {
        try {
            const db = await initDB();
            const transaction = db.transaction("images", "readonly");
            const store = transaction.objectStore("images");
            const request = store.getAll();

            request.onsuccess = function () {
                request.result.forEach(imageData => {
                    addImageToGallery(imageData.image);
                });
            };
        } catch (error) {
            console.error("Database load failed:", error);
        }
    }

    function addImageToGallery(imageSrc) {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.style.width = "200px";
        img.style.margin = "5px";
    }

    loadImages();

    colorPicker.addEventListener("input", function () {
        let selectedColor = this.value;
        let lastBlock = document.querySelector(".media-box .block:last-child svg");
        if (lastBlock) {
            lastBlock.querySelectorAll("path, *").forEach((element) => {
                element.setAttribute("fill", selectedColor);
            });
        }
    });

    function addBlock(type) {
        let selectedColor = colorPicker.value || "#000";
        let svgPath = `blockimages/${type}.svg`;

        fetch(svgPath, { mode: "cors" })
            .then(response => response.text())
            .then(svgContent => {
                let wrapper = document.createElement("div");
                wrapper.classList.add("block");
                let parser = new DOMParser();
                let svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
                let svgElement = svgDoc.querySelector("svg");

                svgElement.setAttribute("height", "200px");
                svgElement.removeAttribute("width");
                svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

                svgElement.querySelectorAll("path, circle").forEach((shape) => {
                    shape.setAttribute("fill", selectedColor);
                    shape.setAttribute("stroke", "black");
                    shape.setAttribute("stroke-width", "2");
                });

                wrapper.appendChild(svgElement);
                mediaBox.appendChild(wrapper);
            })
            .catch(error => console.error(error));
    }

    document.getElementById("saveButton").addEventListener("click", function () {
        if (!mediaBox) {
            console.error("Media box not found.");
            return;
        }

        html2canvas(mediaBox, { backgroundColor: null, scale: 0.5 }).then(canvas => {
            canvas.toBlob(blob => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    let savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
                    savedImages.push(reader.result);
                    localStorage.setItem("galleryImages", JSON.stringify(savedImages));
                    saveImageToDB(reader.result);
                    window.location.href = "gallery/index.html";
                };
            }, "image/jpeg", 0.7);
        });
    });

    window.addBlock = addBlock;
});
