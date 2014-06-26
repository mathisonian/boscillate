boscillate
==========

Sound wave graph for [baudio](https://github.com/substack/baudio) in your terminal

![example1](http://i.imgur.com/iURwnlB.png)
![example2](http://i.imgur.com/TCPE5wr.png)
![example3](http://i.imgur.com/Svi8HiJ.png)
![example4](http://i.imgur.com/2jt3rgq.png)

## usage

`npm install boscillate`

```js 
var baudio = require('baudio');
var oscillate = require('boscillate');

var n = 0;
var b = baudio(function (t, i) {
    return Math.sin(t * 400 * Math.PI * 2) + Math.sin(t * 500) * (t % 2 > 1);
});


b = oscillate(b);
b.play();
```

This will pretty much take over your terminal

## options


```js
b = oscillate(b, {
    framesPerSecond: 20, // how often does this try to refresh the screen
                         // higher -> faster & more intensive
                         // find a value that works for your terminal size
    
    windowSize: 1000     // window size: 
                         // the graphs are composed of a sliding window of 
                         // time series values.
                         // e.g. if we have values 1, 2, 3, 4, 5, 6, 7
                         //      then with a window of size two, the graph
                         //      would display the following two points at
                         //      each refresh:
                         //      [1, 2], 3, 4, 5, 6, 7
                         //      1, [2, 3], 4, 5, 6, 7
                         //      1, 2, [3, 4], 5, 6, 7
                         //      1, [2, 3, [4, 5], 6, 7
                         //      1, 2, 3, 4, [5, 6], 7
                         //      1, 2, 3, 4, 5, [6, 7]
                         //      etc
                         //
                         // so a bigger window size means you can see further into
                         // the past on the audio wave

})
```

## license

MIT
