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
    config: { audioObject?: AudioContext; autoplay?: boolean } = {}
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

  get audio() {
    return this.engine;
  }

  get selected(): IAudioParams {
    return this.current;
  }

  public play(): Boolean {
    if (this.current) {
      this.engine.play();
      return true;
    } else {
      return this.next();
    }
  }

  public next(): Boolean {
    if (!this.queue.length) {
      return false;
    }
    this.current = this.queue.shift();
    if (this.current) {
      this.engine.src = this.current.src;
    }
    this.engine.play();

    return true;
  }

  public pause(): Boolean {
    this.engine.pause();
    return true;
  }

  public addLast(audio: IAudioParams) {
    return this.queue.push(audio);
  }

  public addNext(audio: IAudioParams) {
    return this.queue.unshift(audio);
  }
}

export class AudioQueue {
  private QueueClass;
  private AudioObject;

  constructor(
    init: IAudioParams[] = [],
    config: { audioObject?: AudioContext; autoplay?: boolean } = {}
  ) {
    this.QueueClass = new AudioQueueClass(init, config);
    this.AudioObject = this.QueueClass.audio;

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
