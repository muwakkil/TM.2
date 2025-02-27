document.addEventListener("DOMContentLoaded", function () {
    const bgToggle = document.getElementById("bgToggle");
    const mediaBox = document.getElementById("mediaBox");
    const colorPicker = document.getElementById("colorPicker");

    if (!mediaBox || !colorPicker || !bgToggle) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    // Array of background colors to cycle through
    const bgColors = ["#ddd","#F2D8C2", "#DB8076", "#BF2121", "#D94A4A", "#47B3DB", "#A47ED9", "#70671A", "#BDBF6F", "#F2D8C2", "#592202"];
    let colorIndex = 0;

    // Background color toggle for media box
    bgToggle.addEventListener("click", function () {
        colorIndex = (colorIndex + 1) % bgColors.length;
        mediaBox.style.background = bgColors[colorIndex];
    });

    colorPicker.addEventListener("input", function () {
        let selectedColor = this.value; // Get the selected color from the color picker
    
        // Select the last added block inside .media-box
        let lastBlock = document.querySelector(".media-box .block:last-child svg");
        
        // If a block exists, apply the new color only to its SVG elements
        if (lastBlock) {
            lastBlock.querySelectorAll("path, *").forEach((element) => {
                element.setAttribute("fill", selectedColor); // Set fill color to the selected color
            });
        }
    });

    function addBlock(type) {
        let selectedColor = colorPicker.value || "#000"; // Default to black if no color is selected
        let svgPath = `blockimages/${type}.svg`;

        fetch(svgPath)
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

                // Adjust SVG size and allow color toggling
               // Set only height, let width scale proportionally
            svgElement.setAttribute("height", "90");
            svgElement.removeAttribute("width"); 
            svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");


                // Apply the selected color
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

document.addEventListener("DOMContentLoaded", function () {
    const icons = document.querySelectorAll(".icon");
    const tooltip = document.getElementById("tooltip");
    let hoverTimeout;

    icons.forEach(icon => {
        icon.addEventListener("mouseenter", function (event) {
            const description = icon.getAttribute("data-description");
            if (description) {
                hoverTimeout = setTimeout(() => {
                    tooltip.textContent = description;
                    tooltip.style.left = `${event.pageX + 10}px`;
                    tooltip.style.top = `${event.pageY + 10}px`;
                    tooltip.style.opacity = "1";
                }, 2000); // 2-second delay
            }
        });

        icon.addEventListener("mousemove", function (event) {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
        });

        icon.addEventListener("mouseleave", function () {
            clearTimeout(hoverTimeout);
            tooltip.style.opacity = "0";
        });
    });
});

document.getElementById("reloadButton").addEventListener("click", function () {
    location.reload();
});


// Save button functionality using html2canvas
document.getElementById("saveButton").addEventListener("click", function () {
    const mediaBox = document.getElementById("mediaBox");

    if (!mediaBox) {
        console.error("Media box not found.");
        return;
    }

    // Use html2canvas to capture mediaBox as an image
    html2canvas(mediaBox, { backgroundColor: null }).then(canvas => {
        const imageData = canvas.toDataURL("image/png");

        // Store image in localStorage
        let savedImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
        savedImages.push(imageData);
        localStorage.setItem("galleryImages", JSON.stringify(savedImages));

        // Redirect to gallery page
        window.location.href = "gallery/index.html";
    });
});


    // Expose addBlock function globally
    window.addBlock = addBlock;
});

