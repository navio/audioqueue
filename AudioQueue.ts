export interface IAudioParams {
  image?: URL;
  author?: String;
  title: String;
  src: URL;
}

class AudioQueueClass {
  private engine;
  private queue = [];
  private current: IAudioParams;
  public autoplay;

  constructor(
    init: IAudioParams[] = [],
    config: { audioObject?: HTMLElement; autoplay?: boolean } = {}
  ) {
    this.queue = [...init];
    this.engine = config.audioObject || new Audio();
    this.autoplay = config.autoplay || true;
    this.current = null;
    this.engine.addEventListener("ended", () => {
      if (this.autoplay) {
        this.next();
      }
    });
  }

  get list(): IAudioParams[] {
    return this.queue;
  }

  get selected(): IAudioParams {
    return this.current;
  }

  public play() {
    if (this.current) {
      return this.engine.play();
    } else {
      return this.next();
    }
  }

  public next() {
    if (!this.queue.length) {
      const event = new Event("EmptyQueue");
      this.engine.dispatchEvent(event);
      this.current = null;
      this.engine.pause();
      this.engine.src = this.current.src;
      return;
    }
    this.current = this.queue.shift();
    if (this.current) {
      this.engine.src = this.current.src;
    }
    this.engine.play();
  }

  public addLast(audio: IAudioParams) {
    return this.queue.push(audio);
  }

  public addNext(audio: IAudioParams) {
    return this.queue.unshift(audio);
  }

  public restart() {
    return this.engine.current;
  }
}

export default class AudioQueue {
  private QueueClass;
  private AudioObject;

  constructor(
    init: IAudioParams[] = [],
    config: { audioObject?: HTMLElement; autoplay?: boolean } = {}
  ) {
    const { audioObject = new Audio() } = config;
    this.QueueClass = new AudioQueueClass(init, { audioObject, ...config });
    this.AudioObject = audioObject;

    return new Proxy(this.QueueClass, {
      get: (target, property) => {
        if (property in target) {
          return target[property];
        }
        if (property in this.AudioObject) {
          // Audio Object requires context variables that are lost in the Proxy.
          return this.AudioObject[property].bind(this.AudioObject);
        }
      },
      set: (target, property, value) => {
        if (property in this.AudioObject) {
          this.AudioObject[property] = value;
        }
        if (property in target) {
          target[property] = value;
        }
        return true;
      }
    });
  }
}
