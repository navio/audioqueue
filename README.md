# audioqueue
AudioQueue is a library that wraps around an Audio/Video object and provides functionality to queue tracks.
Because the input for a track is a URL object it can receive cached, blob or any source for media.
The idea is to provide only queue functionality and let the media engine interact normally with the context.

```javascript
import AudioQueue from "audioqueue";

const player = new AudioQueue([{ title: "Audio", src: new URL(mp3)},{ title: "Audio1", src: new URL(mp31)}]);

player.play() // would play the next track in queue, or the paused track currently loaded.
player.next() // will unload the current track and load the next track in the queue.
player.pause() // would pass the pause action to the media object.
player.addNext() // would add the track next in the queue
player.addLast() // would add the track at the end of the queue.
player.currentTrack() // returns all the information for the curren track.
player.list // returns the entire queue currently loaded.
player.native // returns the native element reproducing the track.
```
> IF the queue is empty when attempting to play anothe track, the object will emmit an EmptyQueue event.

Because this implementation is a wrapper around the HTMLMediaElement, you can use any property or feature of the MediaElement provided. For instace, by default the class creates Audio object if nothing else is provided.

```javascript

const player = new AudioQueue([{ title: "Audio", src: new URL(mp3)},{ title: "Audio1", src: new URL(mp31)}]);

//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
player.loop() 

// or attach events 
player.addEventListener("ended", (ev) => console.log(ev));


```