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

async function tick() {
    for (const component of activeComponents) {
        component.beforeTick();
    }
    for (const component of activeComponents) {
        component.onTick();
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
        component.onEnd();
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
                    if (input.element === selectedNode) {
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
                        if (input.element === e.target.parentElement) {
                            found = true;
                            component2.inputs.splice(
                                component2.inputs.indexOf(input),
                                1
                            );
                        }
                    });
                }
                if (!found) {
                    let selectedComponent;
                    for (const component2 of activeComponents) {
                        if (component2.element === selectedNode) {
                            selectedComponent = component2;
                            break;
                        }
                    }
                    if (selectedComponent)
                        component.inputs.push(selectedComponent);
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
        for (const input of component.inputs) {
            const inputNode = input.element;
            const componentNode = component.element;
            if (
                !inputNode ||
                !inputNode.parentElement ||
                !componentNode ||
                !componentNode.parentElement
            )
                continue;

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
            wire.style.borderRadius = "15px"

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
        if (wireMode || running) return;
        const element = cloneMe ? cloneMe.cloneNode(true) : inputElement;
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
            const component = new Component({
                element,
                values: componentData.values,
                functions: componentData.functions,
                position: { x: gridX, y: gridY },
            });
            activeComponents.push(component);
            element.style.left = `${gridX * gridSize - 20}px`;
            element.style.top = `${gridY * gridSize - 20}px`;

            if (componentData.functions.onClick) {
                element.style.cursor = "pointer";
                element.addEventListener("click", (e) => {
                    if (e.target.classList.contains("wireNode")) return;
                    component.onClick();
                });
            }
            element.addEventListener("mouseover", (e) => {
                component.onHover(true);
            });
            element.addEventListener("mouseout", (e) => {
                component.onHover(false);
            });
            element.addEventListener("contextmenu", (e) => {
                if (wireMode || running) return;
                e.preventDefault();
                for (const component2 of activeComponents) {
                    const index = component2.inputs.indexOf(component);
                    if (index === -1) continue;
                    component2.inputs.splice(index, 1);
                }
                activeComponents.splice(activeComponents.indexOf(component), 1);
                element.remove();
            });

            mainGrid.appendChild(element);
            document.removeEventListener("mousemove", move);
        });
    });
}

for (const components of data_components) {
    const groupContianer = document.createElement("div");
    const groupTitle = document.createElement("h5");
    const groupSection = document.createElement("section");

    groupTitle.innerText = components.title;

    for (const component of components.components) {
        const navigationNode = document.createElement("div");
        const cloneableNode = document.createElement("div");
        const wireNode = document.createElement("div");
        const navigationTitle = document.createElement("h6");

        navigationTitle.innerText = component.display.title;
        wireNode.classList.add("wireNode");
        navigationNode.classList.add("component");
        navigationNode.innerHTML = component.display.element;
        cloneableNode.classList.add("component");
        cloneableNode.innerHTML = component.display.element;
        cloneableNode.appendChild(wireNode);
        navigationNode.appendChild(navigationTitle);
        groupSection.appendChild(navigationNode);
        navigationNode.addEventListener("mouseover", () => {
            document.querySelector("#details").classList.add("shown");
            document.querySelector("#details h5").innerText =
                component.display.title;
            document.querySelector("#details p").innerText =
                component.display.description;
        });
        navigationNode.addEventListener("mouseout", () => {
            document.querySelector("#details").classList.remove("shown");
        });
        placementHandler(navigationNode, cloneableNode, component);
    }

    groupContianer.appendChild(groupTitle);
    groupContianer.appendChild(groupSection);
    componentNav.appendChild(groupContianer);
}
