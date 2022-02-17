import "@testing-library/jest-dom/extend-expect";
import { Crypto } from "@peculiar/webcrypto";

const BroadcastChannelMock = class {
    constructor(name) {
        this.name = name;
        this.messageQueue = [];
    }
    postMessage(message) {
        this.messageQueue.push(message);
    }
};

global.crypto = new Crypto();
if (!window.BroadcastChannel) window.BroadcastChannel = BroadcastChannelMock;
