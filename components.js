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
            if (!running) return;
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
        }
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
                    title: "OR",
                    description:
                        "Outputs 1 if any of the inputs are 1, 0 otherwise.",
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
                        component.nextValues.bit =
                            component.values.bit > 0 ? 0 : 1;

                        component.element.style.backgroundColor =
                            component.nextValues.bit > 0
                                ? "#3385ff"
                                : "transparent";
                    },
                },
            },
        ],
    },
];
