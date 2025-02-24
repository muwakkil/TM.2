document.getElementById("colorPicker").addEventListener("input", function () {
    let selectedColor = this.value;
    
    // Apply the color to all blocks in the media box
    document.querySelectorAll(".media-box svg path, .media-box svg circle").forEach((block) => {
        block.setAttribute("fill", selectedColor);
    });
});

function addBlock(type) {
    let mediaBox = document.getElementById("mediaBox");
    let selectedColor = document.getElementById("colorPicker").value;

    let newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("width", "50");
    newSvg.setAttribute("height", "50");
    newSvg.setAttribute("viewBox", "0 0 100 100");
    newSvg.classList.add("block");

    let shape;
    
    if (type === "olive") {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        shape.setAttribute("cx", "50");
        shape.setAttribute("cy", "50");
        shape.setAttribute("r", "40");
    } else if (type === "flower") {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttribute("d", "M50 10 L65 40 L95 50 L65 60 L50 90 L35 60 L5 50 L35 40 Z");
    } else if (type === "bird") {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttribute("d", "M10 80 Q50 10, 90 80 T170 80");
    }

    // Apply the selected color to the shape
    shape.setAttribute("fill", selectedColor);
    shape.setAttribute("stroke", "black");
    shape.setAttribute("stroke-width", "3");

    newSvg.appendChild(shape);
    mediaBox.appendChild(newSvg);
}
