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
        name: "Outlet Power",
        image: require("assets/icons/switch.png"),
    },
    gateway: {
        id: 'gateway',
        name: 'Gateway',
        image: require("assets/icons/gateway.png"),
    },
    garage: {
        id: 'garage',
        name: 'Garage',
        image: require("assets/icons/garage.png"),
    },
    living_room: {
        id: 'living_room',
        name: "Living Room",
        image: require("assets/icons/livingroom.png"),
    },
    kitchen: {
        id: 'kitchen',
        name: 'Kitchen',
        image: require("assets/icons/kitchen.png"),
    },
    wc: {
        id: 'wc',
        name: 'WC',
        image: require("assets/icons/toilet.png"),
    },
    yard: {
        id: 'yard',
        name: 'Yard',
        image: require("assets/icons/yard.png"),
    },
    bed_room: {
        id: 'bed_room',
        name: 'Bed Room',
        image: require("assets/icons/bedroom.png"),
    }

};

export const allDevices = {
    switch: {
        id: "switch",
        name: "Switch",
        detailName: "Switch",
        image: require("assets/icons/outlet-power.png"),
        isMode: false,
        roomId: 'switch'
    },
    gateway_fence: {
        id: 'gateway_fence',
        name: "Fence",
        detailName: "Fence",
        image: require("assets/icons/gateway.png"),
        isMode: false,
        detailImageOn: require("assets/icons/lighting-on.png"),
        detailImageOff: require("assets/icons/lighting-off.png"),
        roomId: 'gateway'
    },
    gateway_led: {
        id: "gateway_led",
        name: "Lamp",
        image: require("assets/icons/lamps.png"),
        isMode: true,
        detailImageOn: require("assets/icons/lighting-on.png"),
        detailImageOff: require("assets/icons/lighting-off.png"),
        roomId: 'gateway',
        mode: ['sensor', 'button']
    },
    garage_door: {
        id: 'garage_door',
        name: "Door",
        detailName: "Door",
        image: require("assets/icons/door.jpeg"),
        isMode: true,
        roomId: 'garage',
        mode: ['sensor', 'button']
    },
    garage_led: {
        id: "garage_led",
        name: "Lamp",
        image: require("assets/icons/lamps.png"),
        isMode: false,
        detailImageOn: require("assets/icons/lighting-on.png"),
        detailImageOff: require("assets/icons/lighting-off.png"),
        roomId: 'garage'
    },
    living_room_door: {
        id: "living_room_door",
        name: "Door",
        detailName: "Door",
        image: require("assets/icons/door.jpeg"),
        isMode: false,
        roomId: 'living_room'
    },
    living_room_led: {
        id: "living_room_led",
        name: "Lamp",
        image: require("assets/icons/lamps.png"),
        isMode: false,
        detailImageOn: require("assets/icons/lighting-on.png"),
        detailImageOff: require("assets/icons/lighting-off.png"),
        roomId: 'living_room'
    },
    kitchen_window: {
        id: "kitchen_window",
        name: "Window",
        detailName: "Window",
        image: require("assets/icons/window.png"),
        isMode: false,
        roomId: 'kitchen'
    },
    kitchen_led: {
        id: "kitchen_led",
        name: "Lamp",
        image: require("assets/icons/lamps.png"),
        isMode: false,
        detailImageOn: require("assets/icons/lighting-on.png"),
        detailImageOff: require("assets/icons/lighting-off.png"),
        roomId: 'kitchen'
    },
    wc_led: {
        id: 'wc_led',
        name: 'Lamp',
        image: require("assets/icons/lamps.png"),
        isMode: true,
        detailImageOn: require("assets/icons/lighting-on.png"),
        detailImageOff: require("assets/icons/lighting-off.png"),
        roomId: 'wc',
        mode: ['sensor', 'button']
    },
    yard_drying_rack: {
        id: 'yard_drying_rack',
        name: 'Drying Rack',
        detailName: 'Drying Rack',
        image: require("assets/icons/drying-rack.png"),
        isMode: true,
        roomId: 'yard',
        mode: ['sensor', 'button']
    },
    bed_room_led: {
        id: 'bed_room_led',
        name: 'Lamp',
        image: require("assets/icons/lamps.png"),
        isMode: false,
        detailImageOn: require("assets/icons/lighting-on.png"),
        detailImageOff: require("assets/icons/lighting-off.png"),
        roomId: 'bed_room'
    },
    bed_room_fan: {
        id: 'bed_room_fan',
        name: 'Fan',
        detailName: 'Fan',
        image: require("assets/icons/fan.png"),
        isMode: false,
        roomId: 'bed_room'
    }
};

export const modeConst = {
    sensor: {
        id: 'sensor',
        name: 'Sensor'
    },
    button: {
        id: 'button',
        name: 'Button & Voice'
    }
}

export const deviceStatusDefault = {
    switch: -1,
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
        }
    ],
    gateway: [
        {
            id: 'gateway_fence',
        },
        {
            id: "gateway_led",
        }
    ],
    garage: [
        {
            id: 'garage_door',
        },
        {
            id: "garage_led",
        }
    ],
    living_room: [
        {
            id: "living_room_door",
        },
        {
            id: "living_room_led",
        }
    ],
    kitchen: [
        {
            id: "kitchen_window",
        },
        {
            id: "kitchen_led",
        }
    ],
    wc: [
        {
            id: 'wc_led',
        }
    ],
    yard: [
        {
            id: 'yard_drying_rack',
        }
    ],
    bed_room: [
        {
            id: 'bed_room_led',
        },
        {
            id: 'bed_room_fan'
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
];

export const devicesMode = {
    gateway_led: 4,
    garage_door: 7,
    wc_led: 21,
    yard_drying_rack: 25,
};

export const deviceModeSensor = [3, 7, 21, 25];
export const deviceModeButton = [4, 8, 22, 26];
