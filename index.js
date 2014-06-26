// 
'use strict';
var Canvas = require('drawille');
var Transform = require('stream').Transform;
var _ = require('lodash');
require('colors');

var width = process.stdout.getWindowSize()[0] * 2;
var height = process.stdout.getWindowSize()[1] * 4;
var canvas = new Canvas(width, height);


Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

// re-used from baudio
function mergeArgs (opts, args) {
    Object.keys(opts || {}).forEach(function (key) {
        args[key] = opts[key];
    });
    
    return Object.keys(args).reduce(function (acc, key) {
        var dash = key.length === 1 ? '-' : '--';
        return acc.concat(dash + key, args[key]);
    }, []);
}


var oscillate = module.exports =  function(b, options) {
    
    options  = _.defaults(options || {}, {
        framesPerSecond: 20,
        windowSize: 1000
    });

    // 
    // pipe from baudio -> boscillate -> sox
    //
    //

    var ts = new Transform();
    var v = 0;
    var windowSize = options.windowSize;
    var points = Array.apply(null, new Array(windowSize)).map(Number.prototype.valueOf,0);
    ts._transform = function (chunk, encoding, done) {
        setTimeout(function() {
            for (var i = 0; i < chunk.length; i += 2) {
                v++;
                var n = chunk.readInt16LE(i);
                points[v % windowSize] = n;
            }    
        }, 1)
        this.push(chunk);
        done();
    };
    
    function draw() {
        canvas.clear();
        var offset = v % windowSize;
        for(var i=0; i<points.length; i++) {
            var point = points[i];
            var index = (i - offset).mod(windowSize);
            canvas.set(width - width * (index / windowSize), height / 2 + point / 1000);
        }
        console.log(canvas.frame().green);
    }

    b.play = function (opts) {
        var ps = this._spawn('play', mergeArgs(opts, {
            'c': 1,
            'r': this.rate,
            't': 's16'
        }).concat('-', '-q'));
        this.pipe(ts).pipe(ps.stdin);
        // draw in the interval to avoid mucking
        // up the pipes
        setInterval(draw, 1 / options.framesPerSecond * 1000);
        return ps;
    };

    return b;
};



