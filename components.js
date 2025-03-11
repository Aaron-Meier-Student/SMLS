class Component {
    constructor({ element, values, functions, position }) {
        this.element = element;
        this.values = { ...values };
        this.nextValues = { ...values };
        this.position = position;
        this.inputs = [];
        this.onTick = () => {
            if (!running) return;
            if (functions.onTick) functions.onTick(this);
        };
        this.onClick = () => {
            if (functions.onClick) functions.onClick(this);
        };
        this.onHover = (state) => {
            if (!running) return;
            if (functions.onHover) functions.onHover(this, state);
        };
        this.beforeTick = () => {
            if (!running) return;
            this.values = { ...this.nextValues };
            if (functions.beforeTick) functions.beforeTick(this);
        };
        this.onEnd = () => {
            this.values = { ...values };
            this.nextValues = { ...values };
            this.element.style.backgroundColor = "transparent";
        };
    }
    addInput(input) {
        this.inputs.push(input);
    }
    removeInput(input) {
        this.inputs.splice(this.inputs.indexOf(input), 1);
    }
}

const data_components = [
    {
        title: "Basic Components",
        components: [
            {
                display: {
                    title: "AND",
                    description:
                        "Outputs 1 if all of the inputs are 1, 0 otherwise.",
                    element: `
                        <div>
                            <img src="./icons/and-gate.png">
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        let and = true;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            if (input.values.bit < 1) {
                                and = false;
                                break;
                            }
                        }
                        if (and && component.inputs.length > 0) {
                            component.element.style.backgroundColor = "#3385ff";
                            component.nextValues.bit = 1;
                            return;
                        }
                        component.element.style.backgroundColor = "transparent";
                        component.nextValues.bit = 0;
                    },
                },
            },
            {
                display: {
                    title: "OR",
                    description:
                        "Outputs 1 if any of the inputs are 1, 0 otherwise.",
                    element: `
                        <div>
                            <img src="./icons/or-gate.png">
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "bit") continue;
                                if (value < 1) continue;
                                component.element.style.backgroundColor =
                                    "#3385ff";
                                component.nextValues.bit = 1;
                                return;
                            }
                        }
                        component.element.style.backgroundColor = "transparent";
                        component.nextValues.bit = 0;
                    },
                },
            },
            {
                display: {
                    title: "XOR",
                    description:
                        "Outputs 1 if the number of inputs that are 1 is odd, 0 otherwise.",
                    element: `
                        <div>
                            <img src="./icons/xor-gate.png">
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        let count = 0;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "bit") continue;
                                if (value < 1) continue;
                                count++;
                            }
                        }
                        if (count % 2 == 1) {
                            component.element.style.backgroundColor = "#3385ff";
                            component.nextValues.bit = 1;
                            return;
                        }
                        component.element.style.backgroundColor = "transparent";
                        component.nextValues.bit = 0;
                    },
                },
            },
            {
                display: {
                    title: "NOT",
                    description:
                        "Outputs 1 if the input is 0, and 0 if the input is 1, 0 otherwise.",
                    element: `
                        <div>
                            <img src="./icons/not-gate.png">
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "bit") continue;
                                if (value < 1) continue;
                                component.element.style.backgroundColor =
                                    "transparent";
                                component.nextValues.bit = 0;
                                return;
                            }
                        }
                        if (component.inputs.length == 0) {
                            component.element.style.backgroundColor =
                                "transparent";
                            component.nextValues.bit = 0;
                            return;
                        }
                        component.element.style.backgroundColor = "#3385ff";
                        component.nextValues.bit = 1;
                    },
                },
            },
            {
                display: {
                    title: "Bit",
                    description:
                        "(OR without icon) Outputs 1 if any of the inputs are 1, 0 otherwise.",
                    element: `
                        <div></div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "bit") continue;
                                if (value < 1) continue;
                                component.element.style.backgroundColor =
                                    "#3385ff";
                                component.nextValues.bit = 1;
                                return;
                            }
                        }
                        component.element.style.backgroundColor = "transparent";
                        component.nextValues.bit = 0;
                    },
                },
            },
            {
                display: {
                    title: "Switch",
                    description: "Can be toggled, outputs 1 or 0.",
                    element: `
                        <div>
                            <i class="fi fi-sr-toggle-on"></i>
                            <i class="fi fi-sr-toggle-off"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onClick: (component) => {
                        if (!running) return;
                        component.nextValues.bit =
                            component.values.bit > 0 ? 0 : 1;

                        component.element.style.backgroundColor =
                            component.nextValues.bit > 0
                                ? "#3385ff"
                                : "transparent";
                    },
                },
            },
            {
                display: {
                    title: "Button",
                    description: "Outputs 1 when clicked for a single tick.",
                    element: `
                        <div>
                            <i class="fi fi-ss-circle"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onClick: (component) => {
                        if (!running) return;
                        component.nextValues.bit = component.values.bit = 1;
                        component.element.style.backgroundColor = "#3385ff";
                    },
                    onTick: (component) => {
                        if (component.values.bit > 0) {
                            component.nextValues.bit = 0;
                            component.element.style.backgroundColor =
                                "transparent";
                        }
                    },
                },
            },
        ],
    },
    {
        title: "Math Components",
        components: [
            {
                display: {
                    title: "Add",
                    description: "Outputs the sum of the inputs.",
                    element: `
                        <div>
                            <i class="fi fi-br-plus"></i>
                        </div>
                    `,
                },
                values: {
                    value: 0,
                },
                functions: {
                    onTick: (component) => {
                        let sum;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "value") continue;
                                sum = sum ? sum + value : value;
                            }
                        }
                        component.element.style.backgroundColor = sum
                            ? "#3385ff"
                            : "transparent";
                        component.nextValues.value = sum ? sum : 0;
                    },
                },
            },
            {
                display: {
                    title: "Subtract",
                    description: "Outputs the difference of 2 inputs.",
                    element: `
                        <div>
                            <i class="fi fi-br-minus"></i>
                        </div>
                    `,
                },
                values: {
                    value: 0,
                },
                functions: {
                    onTick: (component) => {
                        let difference;
                        let value1;
                        let value2;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key == "value") {
                                    value1 = value;
                                } else if (key == "value2") {
                                    value2 = value;
                                }
                            }
                        }
                        if (value1 && value2) difference = value1 - value2;
                        component.element.style.backgroundColor = difference
                            ? "#3385ff"
                            : "transparent";
                        component.nextValues.value = difference
                            ? difference
                            : 0;
                    },
                },
            },
            {
                display: {
                    title: "Multiply",
                    description: "Outputs the product of the inputs.",
                    element: `
                        <div>
                            <i class="fi fi-br-x"></i>
                        </div>
                    `,
                },
                values: {
                    value: 0,
                },
                functions: {
                    onTick: (component) => {
                        let product;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "value") continue;
                                product = product ? product * value : value;
                            }
                        }
                        component.element.style.backgroundColor = product
                            ? "#3385ff"
                            : "transparent";
                        component.nextValues.value = product ? product : 0;
                    },
                },
            },
            {
                display: {
                    title: "Divide",
                    description: "Outputs the quotient of the 2 inputs.",
                    element: `
                        <div>
                            <i class="fi fi-br-divide"></i>
                        </div>
                    `,
                },
                values: {
                    value: 0,
                },
                functions: {
                    onTick: (component) => {
                        let quotient;
                        let value1;
                        let value2;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key == "value") {
                                    value1 = value;
                                } else if (key == "value2") {
                                    value2 = value;
                                }
                            }
                        }
                        if (value1 && value2) quotient = value1 / value2;
                        component.element.style.backgroundColor = quotient
                            ? "#3385ff"
                            : "transparent";
                        component.nextValues.value = quotient ? quotient : 0;
                    },
                },
            },
            {
                display: {
                    title: "Equal",
                    description: "Outputs 1 if all the inputs are equal.",
                    element: `
                        <div>
                            <i class="fi fi-br-equals"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        let first;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "value") continue;
                                if (!first && first !== 0) {
                                    first = value;
                                    continue;
                                }
                                if (first != value) {
                                    component.element.style.backgroundColor =
                                        "transparent";
                                    component.nextValues.bit = 0;
                                    return;
                                }
                            }
                        }
                        if (component.inputs.length == 0) return;
                        component.element.style.backgroundColor = "#3385ff";
                        component.nextValues.bit = 1;
                    },
                },
            },
            {
                display: {
                    title: "Mod",
                    description: "Outputs the remainder of the 2 inputs.",
                    element: `
                        <div>
                            <i class="fi fi-br-percentage"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        let remainder;
                        let value1;
                        let value2;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key == "value") {
                                    value1 = value;
                                } else if (key == "value2") {
                                    value2 = value;
                                }
                            }
                        }
                        if (value1 && value2) remainder = value1 % value2;
                        component.element.style.backgroundColor = remainder
                            ? "transparent"
                            : component.inputs.length < 2
                            ? "transparent"
                            : "#3385ff";
                        component.nextValues.value = remainder ? remainder : 0;
                    },
                },
            },
            {
                display: {
                    title: "Greater",
                    description: "Outputs 1 if the input is greater than the alt, 0 otherwise.",
                    element: `
                        <div>
                            <i class="fi fi-br-greater-than"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        let value1 = 0;
                        let value2 = 0;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key == "value") {
                                    value1 = value;
                                } else if (key == "value2") {
                                    value2 = value;
                                }
                            }
                        }
                        if (value1 <= value2) {
                            component.element.style.backgroundColor = "transparent";
                            component.nextValues.bit = 0;
                            return;
                        };
                        component.element.style.backgroundColor = "#3385ff";
                        component.nextValues.bit = 1;
                    },
                },
            },
            {
                display: {
                    title: "Less",
                    description: "Outputs 1 if the input is less than the alt, 0 otherwise.",
                    element: `
                        <div>
                            <i class="fi fi-br-less-than"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                },
                functions: {
                    onTick: (component) => {
                        let value1 = 0;
                        let value2 = 0;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key == "value") {
                                    value1 = value;
                                } else if (key == "value2") {
                                    value2 = value;
                                }
                            }
                        }
                        if (value1 >= value2) {
                            component.element.style.backgroundColor = "transparent";
                            component.nextValues.bit = 0;
                            return;
                        };
                        component.element.style.backgroundColor = "#3385ff";
                        component.nextValues.bit = 1;
                    },
                },
            },
            {
                display: {
                    title: "Alt",
                    description:
                        "Outputs the same value as the input on a secondary channel. Used for things like subtraction, division, modulo, etc.",
                    element: `
                        <div>
                            <i class="fi fi-br-copy"></i>
                        </div>
                    `,
                },
                values: {
                    value2: 0,
                },
                functions: {
                    onTick: (component) => {
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "value") continue;
                                component.nextValues.value2 = value;
                                component.element.style.backgroundColor =
                                    "#3385ff";
                                return;
                            }
                        }
                        component.element.style.backgroundColor = "transparent";
                    },
                },
            },
            {
                display: {
                    title: "Number",
                    description:
                        "Outputs the number inside the input, or the value of the input from another component, 0 otherwise.",
                    element: `
                        <div>
                            <input type="number" placeholder="#">
                        </div>
                    `,
                },
                values: {
                    value: 0,
                },
                functions: {
                    onTick: (component) => {
                        component.nextValues.value = Number(
                            component.element.querySelector("input").value
                        );
                        component.nextValues.value =
                            component.nextValues.value == ""
                                ? 0
                                : component.nextValues.value;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "value") continue;
                                component.nextValues.value = value;
                                component.element.querySelector("input").value =
                                    value;
                                component.element.style.backgroundColor =
                                    "#3385ff";
                                return;
                            }
                        }
                        component.element.style.backgroundColor = "transparent";
                    },
                },
            },
        ],
    },
    {
        title: "Display Components",
        components: [
            {
                display: {
                    title: "Hover",
                    description:
                        "Displays value of the input, can be a number, string, or boolean. Hover over to view the display.",
                    element: `
                        <div>
                            <div class="display hover"></div>
                            <i class="fi fi-sr-mouse"></i>
                        </div>
                    `,
                },
                values: {},
                functions: {
                    onTick: (component) => {
                        if (component.inputs.length == 0) {
                            component.element.style.backgroundColor =
                                "transparent";
                            return;
                        }
                        let bit, value, text;
                        for (const input of component.inputs) {
                            if (typeof input.values.bit !== "undefined") {
                                bit = input.values.bit;
                            }
                            if (typeof input.values.value !== "undefined") {
                                value = input.values.value;
                            }
                            if (typeof input.values.text !== "undefined") {
                                text = input.values.text;
                            }
                        }

                        if (typeof text !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = text;
                            return;
                        }

                        if (typeof value !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = value;
                            return;
                        }
                        if (typeof bit !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = bit;
                            return;
                        }
                        component.element.querySelector(".display").innerHTML =
                            "";
                        component.element.style.backgroundColor = "transparent";
                        return;
                    },
                },
            },
            {
                display: {
                    title: "Toggle",
                    description:
                        "Displays value of the input, can be a number, string, or boolean. Click to toggle the display.",
                    element: `
                        <div>
                            <div class="display"></div>
                            <i class="fi fi-sr-text"></i>
                        </div>
                    `,
                },
                values: {},
                functions: {
                    onClick: (component) => {
                        component.element
                            .querySelector(".display")
                            .classList.toggle("shown");
                    },
                    onTick: (component) => {
                        if (component.inputs.length == 0) {
                            component.element.style.backgroundColor =
                                "transparent";
                            return;
                        }
                        let bit, value, text;
                        for (const input of component.inputs) {
                            if (typeof input.values.bit !== "undefined") {
                                bit = input.values.bit;
                            }
                            if (typeof input.values.value !== "undefined") {
                                value = input.values.value;
                            }
                            if (typeof input.values.text !== "undefined") {
                                text = input.values.text;
                            }
                        }

                        if (typeof text !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = text;
                            return;
                        }

                        if (typeof value !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = value;
                            return;
                        }
                        if (typeof bit !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = bit;
                            return;
                        }
                        component.element.querySelector(".display").innerHTML =
                            "";
                        component.element.style.backgroundColor = "transparent";
                        return;
                    },
                },
            },
            {
                display: {
                    title: "Running",
                    description:
                        "Displays value of the input, can be a number, string, or boolean. Will automatically toggle on every tick. Can be toggled off with click.",
                    element: `
                        <div>
                            <div class="display"></div>
                            <i class="fi fi-sr-text"></i>
                        </div>
                    `,
                },
                values: {},
                functions: {
                    onClick: (component) => {
                        component.element
                            .querySelector(".display")
                            .classList.toggle("shown");
                    },
                    onTick: (component) => {
                        component.element
                            .querySelector(".display")
                            .classList.add("shown");
                        if (component.inputs.length == 0) {
                            component.element.style.backgroundColor =
                                "transparent";
                            return;
                        }
                        let bit, value, text;
                        for (const input of component.inputs) {
                            if (typeof input.values.bit !== "undefined") {
                                bit = input.values.bit;
                            }
                            if (typeof input.values.value !== "undefined") {
                                value = input.values.value;
                            }
                            if (typeof input.values.text !== "undefined") {
                                text = input.values.text;
                            }
                        }

                        if (typeof text !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = text;
                            return;
                        }

                        if (typeof value !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = value;
                            return;
                        }
                        if (typeof bit !== "undefined") {
                            component.element.style.backgroundColor = "#3385ff";
                            component.element.querySelector(
                                ".display"
                            ).innerHTML = bit;
                            return;
                        }
                        component.element.querySelector(".display").innerHTML =
                            "";
                        component.element.style.backgroundColor = "transparent";
                        return;
                    },
                },
            },
        ],
    },
    {
        title: "Misc Components",
        components: [
            {
                display: {
                    title: "String",
                    description: "Outputs the string inside the input.",
                    element: `
                        <div>
                            <input type="text" placeholder="T">
                        </div>
                    `,
                },
                values: {
                    text: 0,
                },
                functions: {
                    onTick: (component) => {
                        component.nextValues.text =
                            component.element.querySelector("input").value;
                        component.nextValues.text =
                            component.nextValues.text == ""
                                ? ""
                                : component.nextValues.text;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "text") continue;
                                component.nextValues.text = value;
                                component.element.querySelector("input").value =
                                    value;
                                component.element.style.backgroundColor =
                                    "#3385ff";
                                return;
                            }
                        }
                        component.element.style.backgroundColor = "transparent";
                    },
                },
            },
            {
                display: {
                    title: "Ticks",
                    description:
                        "Outputs the number of ticks since the simulation started.",
                    element: `
                        <div>
                            <i class="fi fi-sr-clock"></i>
                        </div>
                    `,
                },
                values: {
                    value: 0,
                },
                functions: {
                    onTick: (component) => {
                        component.nextValues.value = ticks + 1;
                        component.element.style.backgroundColor = "#3385ff";
                    },
                },
            },
            {
                display: {
                    title: "Tick",
                    description:
                        "Only outputs for a single tick once it receives any 1 input.",
                    element: `
                        <div>
                            <i class="fi fi-br-circle-1"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                    bit2: 0,
                },
                functions: {
                    onTick: (component) => {
                        if (
                            component.inputs.length < 1 ||
                            (component.values.bit == 1 &&
                                component.values.bit2 == 1)
                        ) {
                            component.element.style.backgroundColor =
                                "transparent";
                            component.nextValues.bit = 0;
                            return;
                        }
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "bit") continue;
                                if (value < 1) continue;
                                if (component.values.bit2 == 0) {
                                    component.element.style.backgroundColor =
                                        "#3385ff";
                                    component.nextValues.bit = 1;
                                }
                                component.nextValues.bit2 = 1;
                                return;
                            }
                        }
                        component.nextValues.bit = 0;
                        component.nextValues.bit2 = 0;
                    },
                },
            },
            {
                display: {
                    title: "Memory",
                    description:
                        "Holds a saved value, can be set by inputting a number or string. Only outputs the saved value. To save a new value, connect a bool input, this will tell the memory to save the new value being inputed.",
                    element: `
                        <div>
                            <i class="fi fi-sr-memory"></i>
                        </div>
                    `,
                },
                values: {
                    value: 0,
                },
                functions: {
                    onTick: (component) => {
                        if (component.inputs.length != 2) {
                            component.element.style.backgroundColor =
                                "transparent";
                            component.nextValues.value = component.values.value;
                            return;
                        }
                        let value2, trigger;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "value" && key != "bool") continue;
                                if (key == "value") {
                                    value2 = value;
                                }
                                if (key == "bool") {
                                    trigger = value;
                                }
                            }
                        }

                        if ((!value2 && value2 !== 0) || !trigger) {
                            component.element.style.backgroundColor =
                                "transparent";
                            component.nextValues.value = component.values.value;
                            return;
                        }
                        component.element.style.backgroundColor = "#3385ff";
                        component.nextValues.value = value2;
                    },
                },
            },
            {
                display: {
                    title: "Relay",
                    description:
                        "Holds a bit, value, and text. Will output to display or numbers only if the bit is 1. Wont output anything if the bit is 0.",
                    element: `
                        <div>
                            <i class="fi fi-sr-clone"></i>
                        </div>
                    `,
                },
                values: {
                    bit: 0,
                    value: 0,
                    text: "",
                },
                functions: {
                    onTick: (component) => {
                        if (component.inputs.length == 0) {
                            component.element.style.backgroundColor =
                                "transparent";
                            component.nextValues.value = component.values.value;
                            return;
                        }
                        let value2,
                            text,
                            bit = 0;
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key == "value") {
                                    value2 = value;
                                }
                                if (key == "text") {
                                    text = value;
                                }
                                if (key == "bit") {
                                    bit = value;
                                }
                            }
                        }
                        if (bit == 0) {
                            component.element.style.backgroundColor =
                                "transparent";
                            
                        component.nextValues.bit = 0;
                        component.nextValues.value = undefined;
                        component.nextValues.text = undefined;
                            return;
                        }
                        component.element.style.backgroundColor = "#3385ff";
                        component.nextValues.bit = 1;
                        component.nextValues.value = value2;
                        component.nextValues.text = text;
                    },
                },
            },
            {
                display: {
                    title: "Boolean",
                    description:
                        "Outputs true if input is 1, false if input is 0.",
                    element: `
                        <div>
                            <i class="fi fi-br-checkbox"></i>
                        </div>
                    `,
                },
                values: {
                    bool: false,
                },
                functions: {
                    onTick: (component) => {
                        for (const input of component.inputs) {
                            if (!input.element.isConnected) continue;
                            for (const [key, value] of Object.entries(
                                input.values
                            )) {
                                if (key != "bit") continue;
                                if (value < 1) continue;
                                component.element.style.backgroundColor =
                                    "#3385ff";
                                component.nextValues.bool = true;
                                return;
                            }
                        }
                        component.element.style.backgroundColor = "transparent";
                        component.nextValues.bool = false;
                    },
                },
            },
        ],
    },
];
