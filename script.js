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

    // Color picker for block fill color
    colorPicker.addEventListener("input", function () {
        let selectedColor = this.value;

        // Apply the color only to newly added blocks
        document.querySelectorAll(".media-box .block path, .media-box .block circle").forEach((block) => {
            block.setAttribute("fill", selectedColor);
        });
    });

    function addBlock(type) {
        let selectedColor = colorPicker.value || "#000"; // Default to black if no color is selected

        let newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSvg.setAttribute("width", "50");
        newSvg.setAttribute("height", "50");
        newSvg.setAttribute("viewBox", "0 0 100 100");
        newSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        newSvg.classList.add("block");

        let shape;
        
        if (type === "olive_branch") {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            shape.setAttribute("cx", "50");
            shape.setAttribute("cy", "50");
            shape.setAttribute("r", "40");
        } else if (type === "pomegranate") {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", "M50 10 L65 40 L95 50 L65 60 L50 90 L35 60 L5 50 L35 40 Z");
        } else if (type === "bird") {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", "M10 60 Q50 10, 90 60 T170 60");



            
        } else {
            console.warn("Invalid type: " + type);
            return;
        }

        // Apply the selected color to the shape
        shape.setAttribute("fill", selectedColor);
        shape.setAttribute("stroke", "black");
        shape.setAttribute("stroke-width", "3");

        newSvg.appendChild(shape);
        mediaBox.appendChild(newSvg);
    }

    // Expose addBlock function globally
    window.addBlock = addBlock;
});
