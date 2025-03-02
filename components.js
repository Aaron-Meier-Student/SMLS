const AllComponents = {
    "Basic Components": {
        AND: {
            description: "Outputs 1 if all inputs are 1, 0 otherwise.",
            element: `
                <div>
                    <img src="./icons/and-gate.png">
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length < 1) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] < 1) {
                        element.classList.remove("on");
                        element.dataset.value = 0;
                        return;
                    }
                }
                element.dataset.value = 1;
                element.classList.add("on");
            },
        },
        OR: {
            description: "Outputs 1 if any of the inputs are 1, 0 otherwise.",
            element: `
                <div>
                    <img src="./icons/or-gate.png">
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == []) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] > 0) {
                        element.classList.add("on");
                        element.dataset.value = 1;
                        return;
                    }
                }
                element.dataset.value = 0;
                element.classList.remove("on");
            },
        },
        XOR: {
            description:
                "Outputs 1 if the number of 1 inputs is odd, 0 otherwise.",
            element: `
                <div>
                    <img src="./icons/xor-gate.png">
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == []) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                let total = 0;
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] > 0) {
                        total++;
                    }
                }
                if (total % 2 == 0) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                } else {
                    element.classList.add("on");
                    element.dataset.value = 1;
                }
            },
        },
        NOT: {
            description:
                "Outputs 1 if the input is 0, and 0 if the input is 1, 0 otherwise.",
            element: `
                <div>
                    <img src="./icons/not-gate.png">
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == []) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] < 1) {
                        element.classList.add("on");
                        element.dataset.value = 1;
                        return;
                    }
                }
                element.dataset.value = 0;
                element.classList.remove("on");
            },
        },
        Bit: {
            description:
                "(OR without Icon) Outputs 1 if any of the inputs are 1, 0 otherwise. Can take color input from a string,",
            element: `
                <div>
                    
                </div>
            `,
            functionality: (element, inputs = []) => {
                if (inputs == []) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                let enabled = false;
                for (let i = 0; i < inputs.length; i++) {
                    if (typeof inputs[i] == "string") {
                        element.style.backgroundColor = inputs[i];
                        continue;
                    }
                    if (inputs[i] > 0) {
                        element.classList.add("on");
                        element.dataset.value = 1;
                        enabled = true;
                    }
                }
                if (enabled) return;
                element.dataset.value = 0;
                element.style.backgroundColor = "transparent";
                element.classList.remove("on");
            },
        },
        Switch: {
            description:
                "Outputs 1 if the switch is on, 0 if the switch is off. Click it toggle the switch.",
            element: `
                <div>
                    <i class="fi fi-sr-toggle-on"></i>
                    <i class="fi fi-sr-toggle-off"></i>
                </div>
            `,
            onClick: (element) => {
                const currentValue = Number(element.dataset.value);
                element.dataset.value = currentValue == 0 ? 1 : 0;
                element.classList.toggle("on");
            },
        },
        Button: {
            description: "Outputs 1 for 1 tick when clicked.",
            element: `
                <div>
                    <i class="fi fi-sr-rec"></i>
                </div>
            `,
            onClick: (element) => {
                element.dataset.value = 1;
            },
            functionality: (element) => {
                if (element.dataset.value == 1) {
                    element.classList.add("on");
                    setTimeout(() => {
                        element.dataset.value = 0;
                    }, timePerTick);
                    return;
                }
                element.classList.remove("on");
            },
        },
    },
    "Math Components": {
        Add: {
            description: "Outputs the sum of all the inputs.",
            element: `
                <div>
                    <i class="fi fi-sr-plus"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length < 2) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                element.classList.add("on");
                let total = 0;
                for (let i = 0; i < inputs.length; i++) {
                    total += Number(inputs[i]);
                }
                element.dataset.value = total;
            },
        },
        Subtract: {
            description: "Outputs the difference of all the inputs.",
            element: `
                <div>
                    <i class="fi fi-sr-minus"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length < 2) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                element.classList.add("on");
                let total = 0;
                for (let i = 0; i < inputs.length; i++) {
                    total -= Number(inputs[i]);
                }
                element.dataset.value = total;
            },
        },
        Multiply: {
            description: "Outputs the product of all the inputs.",
            element: `
                <div>
                    <i class="fi fi-sr-x"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length < 2) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                element.classList.add("on");
                let total = 1;
                for (let i = 0; i < inputs.length; i++) {
                    total *= Number(inputs[i]);
                }
                element.dataset.value = total;
            },
        },
        Reciprocal: {
            description:
                "Outputs the reciprocal of the input. Meant to be used for division. (1/x)*5 = 5/x",
            element: `
                <div>
                    <i class="fi fi-sr-reflect"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length != 1) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                element.classList.add("on");
                element.dataset.value = 1 / inputs[0];
            },
        },
        Number: {
            description:
                "Outputs the number typed into the input, or the number being inputed, 0 otherwise.",
            element: `
                <div>
                    <input type="number" placeholder="#">
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length < 1) {
                    element.classList.remove("on");
                    element.dataset.value =
                        element.querySelector("input").value;
                    return;
                }
                element.classList.add("on");
                element.dataset.value = inputs[0];
                element.querySelector("input").value = inputs[0];
            },
        },
        Equal: {
            description: "Outputs 1 if all the inputs are equal, 0 otherwise.",
            element: `
                <div>
                    <i class="fi fi-sr-equals"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length < 2) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                let allEqual = true;
                const first = inputs[0];
                for (let i = 1; i < inputs.length; i++) {
                    if (inputs[i] != first) {
                        allEqual = false;
                        break;
                    }
                }
                element.classList[allEqual ? "add" : "remove"]("on");
                element.dataset.value = allEqual ? 1 : 0;
            },
        },
    },
    "Display Components": {
        Hover: {
            description:
                "Displays value of the input, can be a number, string, or boolean. Hover over to view the display.",
            element: `
                <div>
                    <div class="display hover"></div>
                    <i class="fi fi-sr-mouse"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length != 1) {
                    element.classList.remove("on");
                    element.dataset.value = "";
                    return;
                }
                element.classList.add("on");
                element.querySelector(".display").innerHTML = inputs[0];
                element.dataset.value = inputs[0];
            },
        },
        Toggle: {
            description:
                "Displays value of the input, can be a number, string, or boolean. Click to toggle the display.",
            element: `
                <div>
                    <div class="display hidden"></div>
                    <i class="fi fi-sr-text"></i>
                </div>
            `,
            onClick: (element) => {
                element.querySelector(".display").classList.toggle("shown");
            },
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length != 1) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                element.classList.add("on");
                element.querySelector(".display").innerHTML = inputs[0];
                element.dataset.value = inputs[0];
            },
        },
    },
    "Misc Components": {
        String: {
            description:
                "Outputs the string typed into the input, or the string being inputed, '' otherwise.",
            element: `
                <div>
                    <input type="text" placeholder="T">
                </div>
            `,
            functionality: (element, inputs) => {
                element.dataset.value = element.querySelector("input").value;
            },
        },
        Ticks: {
            description:
                "Outputs the number of ticks since the simulation started.",
            element: `
                <div>
                    <i class="fi fi-sr-clock"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                element.dataset.value = ticks + 1;
            },
        },
        Tick: {
            description:
                "Only outputs for a single tick once it receives any 1 input.",
            element: `
                <div>
                    <i class="fi fi-br-circle-1"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (!element.dataset.value2) {
                    element.dataset.value2 = 0;
                }
                if (
                    inputs == [] ||
                    inputs.length < 1 ||
                    (element.dataset.value2 == 1 && element.dataset.value == 1)
                ) {
                    element.classList.remove("on");
                    element.dataset.value = 0;
                    return;
                }
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] > 0) {
                        if (element.dataset.value2 == 0) {
                            element.classList.add("on");
                            element.dataset.value = 1;
                        }
                        element.dataset.value2 = 1;
                        return;
                    }
                }
                element.dataset.value2 = 0;
                element.dataset.value = 0;
            },
        },
        Memory: {
            description:
                "Holds a saved value, can be set by inputting a number or string. Only outputs the saved value. To save a new value, connect a trigger input, this will tell the memory to save the new value being inputed.",
            element: `
                <div>
                    <i class="fi fi-sr-memory"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length != 2) {
                    element.classList.remove("on");
                    element.dataset.value = element.dataset.value;
                    return;
                }
                let value, trigger;
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] === "true" || inputs[i] === "false") {
                        trigger = inputs[i] === "true" ? true : false;
                    } else {
                        value = inputs[i];
                    }
                }
                if (!value || !trigger) {
                    element.classList.remove("on");
                    element.dataset.value = element.dataset.value;
                    return;
                }
                element.classList.add("on");
                element.dataset.value = value;
            },
        },
        Trigger: {
            description:
                "Outputs a boolean, true or false, depending on if any input is greater than 0.",
            element: `
                <div>
                    <i class="fi fi-sr-flame"></i>
                </div>
            `,
            functionality: (element, inputs) => {
                if (inputs == [] || inputs.length < 1) {
                    element.classList.remove("on");
                    element.dataset.trigger = false;
                    return;
                }
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] > 0) {
                        element.classList.add("on");
                        element.dataset.trigger = true;
                        return;
                    }
                }
                element.classList.remove("on");
                element.dataset.trigger = false;
            },
        },
    },
};
