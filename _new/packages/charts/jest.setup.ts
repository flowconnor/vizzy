import '@testing-library/jest-dom';

class ResizeObserverMock {
	private callback: ResizeObserverCallback;

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}

	observe() {
		const entry: ResizeObserverEntry = {
			contentRect: new DOMRectReadOnly(0, 0, 600, 400),
			target: {} as Element,
			borderBoxSize: [],
			contentBoxSize: [],
			devicePixelContentBoxSize: [],
		};
		this.callback([entry], this as unknown as ResizeObserver);
	}

	unobserve() {
		// noop
	}

	disconnect() {
		// noop
	}
}

(globalThis as any).ResizeObserver = ResizeObserverMock;

