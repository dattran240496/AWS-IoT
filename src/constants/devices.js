export const GATEWAY_FENCE_ON = 1;
export const GATEWAY_LED_ON = 5;
export const GARAGE_DOOR_ON = 9;
export const GARAGE_LED_ON = 11;
export const LIVING_ROOM_DOOR_ON = 13;
export const LIVING_ROOM_LED_ON = 15;
export const KITCHEN_WINDOW_ON = 17;
export const KITCHEN_LED_ON = 19;
export const WC_LED_ON = 23;
export const YARD_DRYING_RACK_ON = 27;
export const BED_ROOM_LED_ON = 29;
export const BED_ROM_FAN_ON = 31;

export const allRoom = {
    switch: {
        id: "switch",
        name: "Switch",
    },
    gateway: {
        id: 'gateway',
        name: 'Gateway'
    },
    garage: {
        id: 'garage',
        name: 'Garage'
    },
    living_room: {
        id: 'living_room',
        name: "Living Room"
    },
    kitchen: {
        id: 'kitchen',
        name: 'Kitchen'
    },
    wc: {
        id: 'wc',
        name: 'WC'
    },
    yard: {
        id: 'yard',
        name: 'Yard'
    },
    bed_room: {
        id: 'bed_room',
        name: 'Bed Room'
    }

};

export const deviceStatusDefault = {
    switch: 0,
    gateway_fence: GATEWAY_FENCE_ON + 1,
    gateway_led: GATEWAY_LED_ON + 1,
    garage_door: GARAGE_DOOR_ON + 1,
    garage_led: GARAGE_LED_ON + 1,
    living_room_door: LIVING_ROOM_DOOR_ON + 1,
    living_room_led: LIVING_ROOM_LED_ON + 1,
    kitchen_window: KITCHEN_WINDOW_ON + 1,
    kitchen_led: KITCHEN_LED_ON + 1,
    wc_led: WC_LED_ON + 1,
    yard_drying_rack: YARD_DRYING_RACK_ON + 1,
    bed_room_led: BED_ROOM_LED_ON + 1,
    bed_room_fan: BED_ROM_FAN_ON + 1
};

export const deviceElements = {
    switch: [
        {
            id: "switch",
            name: "Switch",
            image: require("assets/images/board-socket.jpg")
        }
    ],
    gateway: [
        {
            id: 'gateway_fence',
            name: "Fence",
            image: require("assets/images/default.png")
        },
        {
            id: "gateway_led",
            name: "Light",
            image: require("assets/images/default.png")
        }
    ],
    garage: [
        {
            id: 'garage_door',
            name: "Door",
            image: require("assets/images/default.png")
        },
        {
            id: "garage_led",
            name: "Light",
            image: require("assets/images/default.png")
        }
    ],
    living_room: [
        {
            id: "living_room_door",
            name: "Door",
            image: require("assets/images/default.png")
        },
        {
            id: "living_room_led",
            name: "Light",
            image: require("assets/images/default.png")
        }
    ],
    kitchen: [
        {
            id: "kitchen_window",
            name: "Window",
            image: require("assets/images/default.png")
        },
        {
            id: "kitchen_led",
            name: "Light",
            image: require("assets/images/default.png")
        }
    ],
    wc: [
        {
            id: 'wc_led',
            name: 'Light',
            image: require("assets/images/default.png")
        }
    ],
    yard: [
        {
            id: 'yard_drying_rack',
            name: 'Drying Rack',
            image: require("assets/images/default.png")
        }
    ],
    bed_room: [
        {
            id: 'bed_room_led',
            name: 'Light',
            image: require("assets/images/default.png")
        },
        {
            id: 'bed_room_fan',
            name: 'Fan',
            image: require("assets/images/default.png")
        }
    ]

}

export const allDevicesStatusOn = [
    GATEWAY_FENCE_ON,
    GATEWAY_LED_ON,
    GARAGE_DOOR_ON,
    GARAGE_LED_ON,
    LIVING_ROOM_DOOR_ON,
    LIVING_ROOM_LED_ON,
    KITCHEN_WINDOW_ON,
    KITCHEN_LED_ON,
    WC_LED_ON,
    YARD_DRYING_RACK_ON,
    BED_ROOM_LED_ON,
    BED_ROM_FAN_ON
];

export const allDevicesStatusOff = [
    GATEWAY_FENCE_ON + 1,
    GATEWAY_LED_ON + 1,
    GARAGE_DOOR_ON + 1,
    GARAGE_LED_ON + 1,
    LIVING_ROOM_DOOR_ON + 1,
    LIVING_ROOM_LED_ON + 1,
    KITCHEN_WINDOW_ON + 1,
    KITCHEN_LED_ON + 1,
    WC_LED_ON + 1,
    YARD_DRYING_RACK_ON + 1,
    BED_ROOM_LED_ON + 1,
    BED_ROM_FAN_ON + 1
]
