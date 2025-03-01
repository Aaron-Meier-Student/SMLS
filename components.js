const AllComponents = {
    "Basic Components": {
        AND: {
            element: `
                <div>
                    <img src="./icons/and-gate.png">
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
        Switch: {
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
