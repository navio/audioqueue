interface IAudioParams {
  [key: string]: any;
  src?: String;
  srcObject?: MediaStream | MediaSource | Blob;
}

class AudioQueueClass {
  private engine;
  private queue = [];
  private current: IAudioParams;
  public autoplay;
  public SETTERS = ["src","srcObject"];

  constructor(
    init: IAudioParams[] = [],
    config: { audioObject?: HTMLElement; autoplay?: Boolean } = {}
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

  set src(value:String){
    if(this.current){
      this.current.currentTime = this.engine.currentTime;
      this.addNext(this.current);
    }
    this.engine.src = value; 
  }

  set srcObject(value:String){
    if(this.current){
      this.current.currentTime = this.engine.currentTime;
      this.addNext(this.current);
    }
    this.engine.srcObject = value; 
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
      this.engine.src = null;
      this.engine.srcObject = null;
      return;
    }
    
    this.current = this.queue.shift();

    if (this.current) {
      const { src, srcObject, currentTime = 0 } = this.current;

      if(!src && !srcObject) {
        const event = new Event("NoSource");
        this.engine.dispatchEvent(event);
        return this.next();
      }

      if (src) this.engine.src = src;
      if (srcObject) this.engine.srcObject = srcObject
      this.engine.currentTime = currentTime;
      this.engine.play();

    }
  }

  public addLast(audio: IAudioParams) {
    return this.queue.push(audio);
  }

  public addNext(audio: IAudioParams) {
    return this.queue.unshift(audio);
  }

  public restart() {
    return this.engine.currentTime = 0;
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
          const prop = this.AudioObject[property];
          return ( typeof prop  === 'function') ?
            prop.bind(this.AudioObject):
            prop;
        }
      },
      set: (target, property, value) => {
        if(target.SETTERS.includes(property)){
          return target[property] = value;
        }
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
