document.addEventListener("DOMContentLoaded", function () {
    const bgToggle = document.getElementById("bgToggle");
    const mediaBox = document.getElementById("mediaBox");
    const colorPicker = document.getElementById("colorPicker");

    if (!mediaBox || !colorPicker || !bgToggle) {
        console.error("One or more elements are missing. Check your HTML IDs.");
        return;
    }

    // Array of background colors to cycle through
    const bgColors = ["#ddd", "#DDBC9D", "#C9523C", "#417D7B", "#70671A", "#EEAD35", "#A31D1D", "#0A3A48"];
    let colorIndex = 0;

    // Background color toggle for media box
    bgToggle.addEventListener("click", function () {
        colorIndex = (colorIndex + 1) % bgColors.length;
        mediaBox.style.background = bgColors[colorIndex];
    });

    // Color picker for the most recently added block
    colorPicker.addEventListener("input", function () {
        let selectedColor = this.value;
        let lastBlock = mediaBox.lastElementChild;

        if (lastBlock && lastBlock.classList.contains("block")) {
            lastBlock.querySelectorAll("svg path, svg circle").forEach((shape) => {
                shape.setAttribute("fill", selectedColor);
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

                // Set height and maintain aspect ratio
                svgElement.setAttribute("height", "150");
                svgElement.removeAttribute("width");
                svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

                // Apply the selected color to the newly created block only
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

    // Tooltip logic
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

    // Expose addBlock function globally
    window.addBlock = addBlock;
});
