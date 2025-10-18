import { vi } from "vitest";

export class WebsocketMock extends EventTarget {
    constructor(url) {
        super()
        this.url = url
        this.send = vi.fn();
        this.close = vi.fn().mockImplementation(() => {
            this.readyState = WebSocket.CLOSED
            this.dispatchEvent(new Event('close'))
        });
        this.readyState = WebSocket.CONNECTING

        this.addEventListener = vi.fn(super.addEventListener);

        setTimeout(() => {
            if (this.readyState === WebSocket.CONNECTING) {
                this.readyState = WebSocket.OPEN
                this.dispatchEvent(new Event('open'))
            }
        }, 0)
    }

    simulateOpen() {
        this.readyState = WebSocket.OPEN
        this.dispatchEvent(new Event('open'))
    }

    simulateClose() {
        this.readyState = WebSocket.CLOSED
        this.dispatchEvent(new Event('close'))
    }

    simulateError() {
        this.dispatchEvent(new Event('error'))
    }
}

// Constantes WebSocket standard
WebsocketMock.CONNECTING = 0
WebsocketMock.OPEN = 1
WebsocketMock.CLOSING = 2
WebsocketMock.CLOSED = 3
