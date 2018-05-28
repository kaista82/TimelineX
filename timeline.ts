type ResizeCallback = (s: number, e: number) => any;

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
        
        var _segmentTitleElement = document.createElement("span");
        _segmentTitleElement.setAttribute("class", "segment-details");
        _segmentTitleElement.innerHTML = _self.title;
        _segmentElement.appendChild(_segmentTitleElement);

        _self.hostElement = _segmentElement

        _self.hostElement.style.backgroundColor = this.getRandomColor();
        _self.container.appendChild(_self.hostElement);

        var _dragging : boolean = false;
        var _lastX : number;
        var _initialX : number;

        _segmentElement.onmousedown = (ev) => {
            _dragging = true;
            _lastX = ev.clientX;

            var _allSegments = document.getElementsByClassName("segment");
            for(var i=0;i<_allSegments.length;i++)
            {
                (<HTMLElement>_allSegments[i]).style.zIndex = (10000 - i).toString();
                //_allSegments[i].classList.remove("topmost");
            }

            _segmentElement.style.zIndex = "10000";
        }; 

        _self.container.addEventListener("mousemove", function(ev) {
            if (_dragging)
            {
                _segmentElement.style.left =  (_segmentElement.offsetLeft - (_lastX - ev.clientX)).toString() + "px";
                _lastX = ev.clientX;
            } 
        });

        _self.container.addEventListener("mouseup", function (ev) {
            _dragging = false;
        });

        _segmentElement.addEventListener("mouseup", function (ev) {
            _dragging = false;
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