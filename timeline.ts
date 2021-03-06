type ResizeCallback = (s: number, e: number) => any;
var _highestZ : number = 100000;

class Timeline { 
    public Segments: Array<Segment> = new Array<Segment>();
    private containerId: string;

    constructor(containerId: string){
        this.containerId = containerId;
   }

    createSegment(title: string, start: number, end: number, updateCallback? : ResizeCallback) : Segment
    {
        var segment = new Segment(title, start, end, this.containerId, updateCallback);
        this.Segments.push(segment);
        return segment;
    }

    public multiline()
    {
        var _allSegments = document.getElementsByClassName("segment");
        for(var i=0;i<_allSegments.length;i++)
        {
           (<HTMLElement>_allSegments[i]).style.top = i * (<HTMLElement>_allSegments[i]).clientHeight + "px";
        }
    }

    public singleline()
    {
        var _allSegments = document.getElementsByClassName("segment");
        for(var i=0;i<_allSegments.length;i++)
        {
           (<HTMLElement>_allSegments[i]).style.top = "0px";
        }
    }
}

class Segment {
    private title: string = "";
    private start: number = 0;
    private end: number = 0;

    private container: HTMLElement;
    private hostElement: any;
    public updateCallback: ResizeCallback;

    get length(): number {
        return Math.abs(this.end-this.start);
    }

    constructor(title: string, start: number, end: number, containerId: string, updateCallback? : ResizeCallback) {
        let _self = this;

        _self.title = title;        
        _self.start = start;
        _self.end = end;
        _self.container = document.getElementById(containerId);

        var _segmentElement = document.createElement("div");
        _segmentElement.setAttribute("class", "segment");
        
        var _leftDragElement = document.createElement("div");
        _leftDragElement.setAttribute("class", "segment-left-handle");

        var _centerDragElement = document.createElement("div");
        _centerDragElement.setAttribute("class", "segment-center-handle");

        var _rightDragElement = document.createElement("div");
        _rightDragElement.setAttribute("class", "segment-right-handle");

        //On purpose... float right..
        _segmentElement.appendChild(_rightDragElement);
        _segmentElement.appendChild(_centerDragElement);
        _segmentElement.appendChild(_leftDragElement);

        var _segmentTitleElement = document.createElement("span");
        _segmentTitleElement.setAttribute("class", "segment-details");
        _segmentTitleElement.innerHTML = _self.title;
        _centerDragElement.appendChild(_segmentTitleElement);

        _self.hostElement = _segmentElement

        _self.hostElement.style.backgroundColor = this.getRandomColor();
        _self.container.appendChild(_self.hostElement);

        var _dragging : boolean = false;
        var _resizingLeft : boolean = false;
        var _resizingRight : boolean = false;

        var _lastX : number;
        var _lastLeftX : number;
        var _lastRightX : number;

        var _initialX : number;

        _segmentElement.onmousedown = (ev) => {
            _dragging = true;
            _lastX = ev.clientX;
            _highestZ += 10;
            _segmentElement.style.zIndex = _highestZ.toString();
        }; 

        _leftDragElement.addEventListener("mousedown", function (ev){
            _resizingLeft = true;
            _lastLeftX = ev.clientX;
            _highestZ += 10;

            ev.stopPropagation();
        });

        _leftDragElement.addEventListener("mouseup", function(ev) {
            _resizingLeft = false;
        });

        _rightDragElement.addEventListener("mousedown", function (ev){
            _resizingRight = true;
            _lastRightX = ev.clientX;
            _highestZ += 10;

            ev.stopPropagation();
        });

        _rightDragElement.addEventListener("mouseup", function(ev) {
            _resizingRight = false;
        });

        _self.container.addEventListener("mousemove", function(ev) {
            if (_dragging)
            {
                _segmentElement.style.left = (_segmentElement.offsetLeft - (_lastX - ev.clientX)).toString() + "px";

                _lastX = ev.clientX;
            } 
            if (_resizingLeft)
            {
                _segmentElement.style.width = (_segmentElement.offsetWidth + (_lastLeftX - ev.clientX)).toString() + "px";
                _segmentElement.style.left = (_segmentElement.offsetLeft - (_lastLeftX - ev.clientX)).toString() + "px";

                _lastLeftX = ev.clientX;
            }
            if (_resizingRight)
            {
                _segmentElement.style.width = (_segmentElement.offsetWidth - (_lastRightX - ev.clientX)).toString() + "px";

                _lastRightX = ev.clientX;
            }
        });

        _self.container.addEventListener("mouseup", function (ev) {
            _dragging = false;
            _resizingLeft = false;
            _resizingRight = false;
        });

        _segmentElement.addEventListener("mouseup", function (ev) {
            _dragging = false;
            _resizingLeft = false;
            _resizingRight = false;
        });

        if (updateCallback != undefined && updateCallback != null)
            this.updateCallback = updateCallback;
        else
            this.updateCallback = (s,e) => { console.log("start: " + s + ", end:" + e ) };

        this.init();

        _self.updateInfo();
    }

    init() {
        this.hostElement.style.width = this.length;
        this.hostElement.style.left = this.start;
    }
 
    updateInfo()
    {
        if (this.updateCallback)
            this.updateCallback(this.start, this.end);
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
}

var _t = new Timeline("timeline-inner-container");

document.addEventListener("DOMContentLoaded", function(event) {

    let _segment = _t.createSegment("Number 1", 100, 500, function(s, e) {
        console.log("element1 " + s + " " + e)
    });

    let _segment2 = _t.createSegment("Number 2", 50, 150, function(s, e) {
        console.log("element2 " + s + " " + e)
    });

    let _segment3 = _t.createSegment("Number 3", 500, 550, function(s, e) {
        console.log("element3 " + s + " " + e)
    });

    let _segment4 = _t.createSegment("Number 4", 550, 4000, function(s, e) {
        console.log("element4 " + s + " " + e)
    });

});