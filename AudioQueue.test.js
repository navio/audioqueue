'use strict';

const AudioEngine = require("./dist/index.js");

const list = [{ title: "Audio", src: new URL("https://url.com")},{ title: "Audio1", src: new URL("https://url1.com")}]

const mockPlayer = {
    play: () => true,
    pause: () => true,
    addEventListener: () => true,
}

describe("AudioEngine should", () => {
    it("should initialize with a playlist", () => {
        const engine = new AudioEngine(list);
        expect(engine.list.length === 2).toBe(true);
    });
    it("should reduce the playlist on next call", () => {
        const engine = new AudioEngine(list, {audioObject: mockPlayer});
        engine.next();
        expect(engine.list.length === 1).toBe(true);
    });
    it("should chage autoplay", () => {
        const engine = new AudioEngine(list, {audioObject: mockPlayer});
        engine.autoplay = false;
        expect(engine.autoplay).toBe(false);
    });
    it("should add new audio at the end of the queue", () => {
        const engine = new AudioEngine(list, {audioObject: mockPlayer});
        const newElement = { title: "newAudio", src: new URL("https://url.com/newaudio")};
        engine.addLast(newElement);
        expect(engine.list.length === 3).toBe(true);
        expect( JSON.stringify(engine.list[engine.list.length -1])).toBe(JSON.stringify(newElement))
    });
    it("should add new audio at the begining of the queue", () => {
        const engine = new AudioEngine(list, {audioObject: mockPlayer});
        const newElement = { title: "newAudio", src: new URL("https://url.com/newaudio")};
        engine.play();
        engine.addNext(newElement);
        expect(engine.list.length === 2).toBe(true);
        expect( JSON.stringify(engine.list[0])).toBe(JSON.stringify(newElement))
        engine.next();
        expect(engine.list.length === 1).toBe(true);
    });
});