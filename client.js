const playBtn = document.getElementById("play");
const stopBtn = document.getElementById("stop");
const pauseBtn = document.getElementById("pause");
const nextBtn = document.getElementById("next");
const wireBtn = document.getElementById("wires");
const ticksTxt = document.getElementById("ticks");
const componentNav = document.querySelector("nav");
const mainGrid = document.querySelector("main");
const wireDisplay = document.getElementById("wireDisplay");

let wireMode = false;
let running = false;
let paused = false;
let next = false;
let timePerTick = 250;
let ticks = 0;

const gridSize = 40;
let activeComponents = [];

const existingColors = [];

function generateRandomColor() {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
    if (existingColors.includes(randomColor)) {
        return generateRandomColor();
    }
    existingColors.push(randomColor);
    return randomColor;
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function tick() {
    for (const component of activeComponents) {
        if (!component.functionality) continue;
        const inputs = [];
        for (const input of component.inputs) {
            if (!input.isConnected) continue;
            if (input.dataset.trigger) {
                inputs.push(input.dataset.trigger);
                continue;
            }
            if (input.querySelector("input") && input.querySelector("input").type == "text") {
                inputs.push(input.dataset.cachedValue);
                continue;
            }
            inputs.push(Number(input.dataset.cachedValue));
        }
        component.functionality(component.element, inputs);
    }
    for (const component of activeComponents) {
        component.element.dataset.cachedValue = component.element.dataset.value;
    }
}

async function run() {
    running = true;
    while (running) {
        await sleep(timePerTick);
        tick();
        ticks++;
        ticksTxt.innerText = `${ticks} Ticks`;
        if (paused) {
            while (!next && paused) {
                await sleep(10);
            }
            next = false;
        }
    }
    next = true;
    playBtn.classList.remove("disabled");
    stopBtn.classList.add("disabled");
    for (const component of activeComponents) {
        component.element.dataset.cachedValue = 0;
        component.element.dataset.value = 0;
        component.element.classList.remove("on");
    }
    ticks = 0;
    ticksTxt.innerText = `${ticks} Ticks`;
}
playBtn.addEventListener("click", () => {
    if (running || wireMode) return;
    next = false;
    playBtn.classList.add("disabled");
    stopBtn.classList.remove("disabled");
    run();
});
stopBtn.addEventListener("click", () => {
    if (!running) return;
    running = false;
});
pauseBtn.addEventListener("click", () => {
    paused = !paused;
    if (paused) {
        pauseBtn.classList.add("toggled");
        nextBtn.classList.remove("disabled");
    } else {
        pauseBtn.classList.remove("toggled");
        nextBtn.classList.add("disabled");
    }
});
nextBtn.addEventListener("click", () => {
    next = true;
});

let selectedNode;
function clickNode(e) {
    if (selectedNode) {
        if (selectedNode === e.target.parentElement) {
            selectedNode
                .querySelector(".wireNode")
                .classList.remove("selected");
            selectedNode = null;
            renderWires();
            return;
        }
        for (const component of activeComponents) {
            if (component.element === e.target.parentElement) {
                let found = false;
                component.inputs.forEach((input) => {
                    if (input === selectedNode) {
                        found = true;
                        component.inputs.splice(
                            component.inputs.indexOf(input),
                            1
                        );
                    }
                });
                for (const component2 of activeComponents) {
                    if (component2 === component) continue;
                    if (component2.element !== selectedNode) continue;
                    component2.inputs.forEach((input) => {
                        if (input === e.target.parentElement) {
                            found = true;
                            component2.inputs.splice(
                                component2.inputs.indexOf(input),
                                1
                            );
                        }
                    });
                }
                if (!found) {
                    component.inputs.push(selectedNode);
                }
                break;
            }
        }
        selectedNode.querySelector(".wireNode").classList.remove("selected");
        selectedNode = null;
    } else {
        selectedNode = e.target.parentElement;
        selectedNode.querySelector(".wireNode").classList.add("selected");
    }
    renderWires();
}

function renderWires() {
    wireDisplay.innerHTML = "";

    for (const component of activeComponents) {
        for (const inputNode of component.inputs) {
            const componentNode = component.element;
            if (!inputNode || !inputNode.parentElement || !componentNode || !componentNode.parentElement) continue;

            const wire = document.createElement("div");

            const x1 = inputNode.offsetLeft + inputNode.offsetWidth / 2;
            const y1 = inputNode.offsetTop + inputNode.offsetHeight / 2;
            const x2 = componentNode.offsetLeft + componentNode.offsetWidth / 2;
            const y2 = componentNode.offsetTop + componentNode.offsetHeight / 2;

            const width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

            wire.style.position = "absolute";
            wire.style.left = `${(x1 + x2) / 2}px`;
            wire.style.top = `${(y1 + y2) / 2}px`;
            wire.style.width = `${width}px`;
            wire.style.height = "5px";

            const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
            wire.style.transformOrigin = "0 0";
            wire.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;

            wire.style.backgroundColor =
                inputNode.querySelector(".wireNode").style.backgroundColor;

            wireDisplay.appendChild(wire);
        }
    }
}

function handleWireMode() {
    document.querySelectorAll(".wireNode").forEach((node) => {
        node.classList.add("visible");
        node.addEventListener("click", clickNode);
    });
}

wireBtn.addEventListener("click", () => {
    if (running) return;
    wireMode = !wireMode;
    if (wireMode) {
        wireBtn.classList.add("toggled");
        renderWires();
        handleWireMode();
    } else {
        wireDisplay.innerHTML = "";
        wireBtn.classList.remove("toggled");
        document.querySelectorAll(".wireNode").forEach((node) => {
            node.classList.remove("visible");
            node.removeEventListener("click", clickNode);
        });
    }
});

function placementHandler(inputElement, cloneMe, componentData) {
    inputElement.addEventListener("mousedown", (e) => {
        if (wireMode) return;
        const element = cloneMe ? cloneMe.cloneNode(true) : inputElement;
        element.dataset.value = 0;
        element.dataset.cachedValue = 0;
        element.querySelector(".wireNode").style.backgroundColor =
            generateRandomColor();
        document.body.appendChild(element);
        element.style.position = "absolute";
        element.style.left = e.clientX + "px";
        element.style.top = e.clientY + "px";
        element.style.zIndex = 1000;

        const move = (e) => {
            element.style.left = e.clientX + "px";
            element.style.top = e.clientY + "px";
        };
        document.addEventListener("mousemove", move);

        let placed = false;
        element.addEventListener("mouseup", (e) => {
            if (placed) return;
            placed = true;
            document.body.removeChild(element);
            const gridX = Math.floor(
                (e.clientX - mainGrid.offsetLeft + 20) / gridSize
            );
            const gridY = Math.floor(
                (e.clientY - mainGrid.offsetTop + 20) / gridSize
            );
            if (gridX < 1 || gridY < 1) {
                element.remove();
                return;
            }
            for (const component of activeComponents) {
                if (
                    component.position.x === gridX &&
                    component.position.y === gridY
                ) {
                    element.remove();
                    return;
                }
            }
            const component = {
                element: element,
                position: { x: gridX, y: gridY },
                inputs: [],
                functionality: componentData.functionality,
            };
            activeComponents.push(component);
            element.style.left = `${gridX * gridSize - 20}px`;
            element.style.top = `${gridY * gridSize - 20}px`;

            if (componentData.onClick) {
                element.style.cursor = "pointer";
                element.addEventListener("click", (e) => {
                    if (e.target.classList.contains("wireNode")) return;
                    componentData.onClick(element);
                });
            }
            element.addEventListener("contextmenu", (e) => {
                if (wireMode || running) return;
                e.preventDefault();
                for (const component of activeComponents) {
                    const index = component.inputs.indexOf(element);
                    if (index === -1) continue;
                    component.inputs.splice(index, 1);
                }
                activeComponents.splice(activeComponents.indexOf(component), 1);
                element.remove();
            });

            mainGrid.appendChild(element);
            document.removeEventListener("mousemove", move);
        });
    });
}

for (const [title, components] of Object.entries(AllComponents)) {
    const newDiv = document.createElement("div");
    const newTitle = document.createElement("h5");
    const newSection = document.createElement("section");

    newTitle.innerText = title;

    for (const [name, component] of Object.entries(components)) {
        const newComponent = document.createElement("div");
        const newComponent2 = document.createElement("div");
        const wireNode = document.createElement("div");
        const newName = document.createElement("h6");
        newName.innerText = name;
        wireNode.classList.add("wireNode");
        newComponent.classList.add("component");
        newComponent.innerHTML = component.element;
        newComponent2.classList.add("component");
        newComponent2.innerHTML = component.element;
        newComponent2.appendChild(wireNode);
        newComponent.appendChild(newName);
        newSection.appendChild(newComponent);
        placementHandler(newComponent, newComponent2, component);
    }

    newDiv.appendChild(newTitle);
    newDiv.appendChild(newSection);
    componentNav.appendChild(newDiv);
}
