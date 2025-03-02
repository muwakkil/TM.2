document.addEventListener("DOMContentLoaded", function () {
    const bgToggle = document.getElementById("bgToggle");
    const bgImageToggle = document.getElementById("bgImageToggle");
    const mediaBox = document.getElementById("mediaBox");
    const colorPicker = document.getElementById("colorPicker");

    if (!mediaBox || !bgToggle || !bgImageToggle || !colorPicker) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    // Array of background colors to cycle through
    const bgColors = ["#ddd", "#F2D8C2", "#DB8076", "#BF2121", "#D94A4A", "#47B3DB", "#A47ED9", "#70671A", "#BDBF6F", "#F2D8C2", "#592202"];
    let colorIndex = 0;

    // Background images array (replace with actual image paths)
    const bgImages = ["bgi1.png", "bgi2.png", "bgi3.png", "bgi4.png", "bgi5.png", "bgi6.png", "bgi7.png", "bgi8.png", "bgi9.png", "bgi10.png"];
    let imageIndex = 0;

    // Background color toggle for media box
    bgToggle.addEventListener("click", function () {
        colorIndex = (colorIndex + 1) % bgColors.length;
        mediaBox.style.background = bgColors[colorIndex];
    });

    // Background image toggle for media box
    bgImageToggle.addEventListener("click", function () {
        imageIndex = (imageIndex + 1) % bgImages.length;
        mediaBox.style.backgroundImage = `url('bgimages/${bgImages[imageIndex]}')`;
        mediaBox.style.backgroundSize = "100% 100%"; // Stretch image to fit container
        mediaBox.style.backgroundPosition = "center";
        mediaBox.style.backgroundRepeat = "no-repeat";
    });

    document.getElementById("reloadButton").addEventListener("click", function () {
        location.reload(true);
    });
    


    // Function to initialize IndexedDB
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

    // Function to save image in IndexedDB
    async function saveImageToDB(imageData) {
        const db = await initDB();
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        store.add({ image: imageData });
    }

    // Color picker functionality for SVG elements
    colorPicker.addEventListener("input", function () {
        let selectedColor = this.value;
        let lastBlock = document.querySelector(".media-box .block:last-child svg");
        if (lastBlock) {
            lastBlock.querySelectorAll("path, *").forEach((element) => {
                element.setAttribute("fill", selectedColor);
            });
        }
    });

    // Function to add SVG block dynamically with CORS compliance
    function addBlock(type) {
        let selectedColor = colorPicker.value || "#000";
        let svgPath = `blockimages/${type}.svg`;

        fetch(svgPath, { mode: "cors" }) // Ensure CORS compliance
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load SVG: ${svgPath}`);
                }
                return response.text();
            })
            .then(svgContent => {
                let wrapper = document.createElement("div");
                wrapper.classList.add("block");
                let parser = new DOMParser();
                let svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
                let svgElement = svgDoc.querySelector("svg");

                if (!svgElement) {
                    console.error(`Invalid SVG format for: ${type}`);
                    return;
                }

                svgElement.setAttribute("height", "90");
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
        
        html2canvas(mediaBox, { backgroundColor: null }).then(canvas => {
            const imageData = canvas.toDataURL("image/jpeg", 0.6); // Compressed JPEG format
            saveImageToDB(imageData); // Store in IndexedDB
            window.location.href = "gallery/index.html";
        });
    });

    window.addBlock = addBlock;
});


