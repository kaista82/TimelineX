"use strict";
var Timeline = /** @class */ (function () {
    function Timeline(containerId) {
        this.Segments = new Array();
        this.containerId = containerId;
    }
    Timeline.prototype.createSegment = function (title, start, end, updateCallback) {
        var segment = new Segment(title, start, end, this.containerId, updateCallback);
        this.Segments.push(segment);
        return segment;
    };
    Timeline.prototype.multiline = function () {
        //let c = 0;
        // $(".segment").each(function(i: number, x: any){
        //     $(x).animate({ top: (c) * $(x).height() + "px"}, 1000);
        //     c++;
        // });
    };
    Timeline.prototype.singleline = function () {
        // $(".segment").each(function(i: number, x: any){
        //     $(x).animate({ top: "0px" }, 1000);
        // });
        // $(".segment").css("top", "0px");
    };
    return Timeline;
}());
var Segment = /** @class */ (function () {
    function Segment(title, start, end, containerId, updateCallback) {
        this.title = "";
        this.start = 0;
        this.end = 0;
        var _self = this;
        _self.title = title;
        _self.start = start;
        _self.end = end;
        _self.container = document.getElementById(containerId);
        var _segmentElement = document.createElement("div");
        _segmentElement.setAttribute("class", "segment");
        var _segmentTitleElement = document.createElement("span");
        _segmentTitleElement.setAttribute("class", "segment-details");
        _segmentTitleElement.innerHTML = _self.title;
        _segmentElement.appendChild(_segmentTitleElement);
        _self.hostElement = _segmentElement;
        _self.hostElement.style.backgroundColor = this.getRandomColor();
        _self.container.appendChild(_self.hostElement);
        var _dragging = false;
        var _lastX;
        var _initialX;
        _segmentElement.onmousedown = function (ev) {
            _dragging = true;
            _lastX = ev.clientX;
            _segmentElement.classList.add("topmost");
        };
        _self.container.addEventListener("mousemove", function (ev) {
            if (_dragging) {
                _segmentElement.style.left = (_segmentElement.offsetLeft - (_lastX - ev.clientX)).toString() + "px";
                _lastX = ev.clientX;
            }
        });
        _self.container.addEventListener("mouseup", function (ev) {
            _dragging = false;
            _segmentElement.classList.remove("topmost");
        });
        _segmentElement.addEventListener("mouseup", function (ev) {
            _dragging = false;
            _segmentElement.classList.remove("topmost");
        });
        if (updateCallback != undefined && updateCallback != null)
            this.updateCallback = updateCallback;
        else
            this.updateCallback = function (s, e) { console.log("start: " + s + ", end:" + e); };
        this.init();
        _self.updateInfo();
    }
    Object.defineProperty(Segment.prototype, "length", {
        get: function () {
            return Math.abs(this.end - this.start);
        },
        enumerable: true,
        configurable: true
    });
    Segment.prototype.init = function () {
        this.hostElement.style.width = this.length;
        this.hostElement.style.left = this.start;
    };
    Segment.prototype.updateInfo = function () {
        if (this.updateCallback)
            this.updateCallback(this.start, this.end);
    };
    Segment.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    return Segment;
}());
var _t = new Timeline("timeline-inner-container");
document.addEventListener("DOMContentLoaded", function (event) {
    var _segment = _t.createSegment("Number 1", 100, 500, function (s, e) {
        console.log("element1 " + s + " " + e);
    });
    var _segment2 = _t.createSegment("Number 2", 50, 150, function (s, e) {
        console.log("element2 " + s + " " + e);
    });
    var _segment3 = _t.createSegment("Number 3", 500, 550, function (s, e) {
        console.log("element3 " + s + " " + e);
    });
    var _segment4 = _t.createSegment("Number 4", 550, 4000, function (s, e) {
        console.log("element4 " + s + " " + e);
    });
});
