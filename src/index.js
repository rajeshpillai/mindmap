// Author: Rajesh Pillai
// Company:  Algorisys Technologies

window.utils = {};

/**
 * Keeps track of the current mouse position, relative to an element.
 * @param {HTMLElement} element
 * @return {object} Contains properties: x, y, event
 */
window.utils.captureMouse = function (element) {
  var mouse = {x: 0, y: 0, event: null},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop;
  
  element.addEventListener('mousemove', function (event) {
    var x, y;
    
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.clientX + body_scrollLeft + element_scrollLeft;
      y = event.clientY + body_scrollTop + element_scrollTop;
    }
    x -= offsetLeft;
    y -= offsetTop;
    
    mouse.x = x;
    mouse.y = y;
    mouse.event = event;
  }, false);
  
  return mouse;
};

/**
 * Keeps track of the current (first) touch position, relative to an element.
 * @param {HTMLElement} element
 * @return {object} Contains properties: x, y, isPressed, event
 */
window.utils.captureTouch = function (element) {
  var touch = {x: null, y: null, isPressed: false, event: null},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop;

  element.addEventListener('touchstart', function (event) {
    touch.isPressed = true;
    var x, y,
        touch_event = event.touches[0]; //first touch
    
    if (touch_event.pageX || touch_event.pageY) {
      x = touch_event.pageX;
      y = touch_event.pageY;
    } else {
      x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
      y = touch_event.clientY + body_scrollTop + element_scrollTop;
    }
    x -= offsetLeft;
    y -= offsetTop;
    
    touch.x = x;
    touch.y = y;
    
    touch.event = event;
  }, false);

  element.addEventListener('touchend', function (event) {
    touch.isPressed = false;
    touch.x = null;
    touch.y = null;
    touch.event = event;
  }, false);
  
  element.addEventListener('touchmove', function (event) {
    var x, y,
        touch_event = event.touches[0]; //first touch
    
    if (touch_event.pageX || touch_event.pageY) {
      x = touch_event.pageX;
      y = touch_event.pageY;
    } else {
      x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
      y = touch_event.clientY + body_scrollTop + element_scrollTop;
    }
    x -= offsetLeft;
    y -= offsetTop;
    
    touch.x = x;
    touch.y = y;
    touch.event = event;
  }, false);
  
  return touch;
};

// Prevent scrolling when touching the canvas
// document.body.addEventListener("touchstart", function (e) {
//   if (e.target == canvas) {
//     e.preventDefault();
//   }
// }, false);
// document.body.addEventListener("touchend", function (e) {
//   if (e.target == canvas) {
//     e.preventDefault();
//   }
// }, false);
// document.body.addEventListener("touchmove", function (e) {
//   if (e.target == canvas) {
//     e.preventDefault();
//   }
// }, false);




let dragoffx, dragoffy;  // Actual position of click
let scrollLeft = 0, scrollTop = 0;
let scrollLeftBody = 0, scrollTopBody = 0;
let canvasWrapper = document.getElementById("canvasWrapper");

canvasWrapper.addEventListener("scroll",
   function(event) {
      onScroll(event)
});

function onScroll(event) {
  let bRect = canvas.getBoundingClientRect();
  
  scrollLeft = event.target.scrollLeft;
  scrollTop = event.target.scrollTop;
  if (!parent) return;
  textInput.style.left = parent.x + bRect.left   + 'px';
  textInput.style.top = parent.y  + bRect.top + 'px';
}

window.addEventListener("scroll", function(event) {
   scrollTopBody = this.scrollY,
   scrollLeftBody =this.scrollX;
 
});

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
 //fixes a problem where double clicking causes text to get selected on the canvas
canvas.addEventListener('selectstart', 
  function(e) { 
    e.preventDefault(); 
    return false; 
  } 
  , false);

let mouse = utils.captureMouse(canvas);
let touch = utils.captureTouch(canvas);

//ctx.strokeStyle="#fff";
//ctx.strokeRect(50,50,100,100);

let width = canvas.width;
let height = canvas.height;

let parent = null;

class Board {
  constructor() {
    this.data = [];
  }
  
  add(item, parent) {
    item.parent = parent;
    this.data.push(item);
  }
  
  contains(m) {
    let bRect = canvas.getBoundingClientRect();
    let found = this.data.find((d) => {
      if (m.x >= d.x-scrollLeft && m.x < (d.x-scrollLeft + d.w) &&
          m.y >= d.y-scrollTop && m.y < (d.y + d.h)-scrollTop) {
        return true;
      }
    });
    
    return found;
  }
  
  connect(parent, child) {
    ctx.save();
    ctx.strokeStyle="yellow";
    ctx.beginPath();
    ctx.moveTo(parent.cx,parent.cy);
    ctx.lineTo(child.cx,child.cy);
    
    ctx.stroke();
    ctx.restore();
  }
  
  paint() {
    this._paint(this.data);
  }
  
  _paint(data) {
    for(let i = 0; i< data.length; i++) {
      let item = this.data[i]; 
      if (item.parent) {
        this.connect(item.parent, item);
      } 
      item.render(ctx);
      
    }
  }
}

let board = new Board();


function createElement(type,pos) {
  var el = document.createElement(type);
  el.style.position = "absolute";
  el.style.width = '15px';
  el.style.height = '15px';
  el.style.left = pos.x  + 'px';
  el.style.top = pos.y + 'px';
  //el.classList.add("");
  return el;
}

function setPos(el, pos) {
  let bRect = canvas.getBoundingClientRect();
  el.style.left = pos.x + bRect.left + scrollLeftBody   + 'px';
  el.style.top = pos.y + bRect.top + scrollTopBody + 'px';
}

function hideEl(el) {
  el.style.display='none';
}

function showEl(el) {
  el.style.display='block';
}


class Rectangle {
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text=`idea ${x}`;
    this.cx = x+w/2;
    this.cy = y+h/2;
    this.setup();
  }
  
  setup() {
    var addBtn = document.createElement("div");
    addBtn.style.position = "absolute";
    addBtn.style.width = '15px';
    addBtn.style.height = '15px';
    addBtn.style.left = this.x   + 'px';
    addBtn.style.top = this.y  + 'px';
    addBtn.classList.add("btn-add");
    
    addBtn.addEventListener("click", (e)=> {
      var rect = canvas.getBoundingClientRect();
      let m = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      m.x = m.x +  150;
      createShape(m,this);
    });
    
    addBtn.addEventListener("mouseup", (e)=> {
      if (parent) parent.dragging = false;
    });
    
    this.addBtn = addBtn;
    document.body.append(addBtn);
  }
  
  
  add(item) {
    this.children.push(item);
  }
  
  render(ctx) {
    let bRect = canvas.getBoundingClientRect();
    ctx.save();
    ctx.strokeStyle="#fff";
    ctx.fillStyle="red";
    ctx.fillRect(this.x,this.y,this.w,this.h);
    
    ctx.font = "15px Arial";
    if (this.text) {
      ctx.fillStyle="yellow";
      ctx.fillText(this.text, this.x + this.w/2, 
                     this.y + this.h/2);
    }
    ctx.restore();
    
    this.addBtn.style.left = this.x + bRect.left + scrollLeftBody  + 'px';
    this.addBtn.style.top = this.y + bRect.top + scrollTopBody  + 'px';
    
  }
  
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.w,
      height: this.h
    }
  }
}


// touchstart,touchend, touchmove
//canvas.addEventListener('click', onClick);
canvas.addEventListener('mousedown', (e)=>{onMouseDown(e,mouse)});
canvas.addEventListener('touchstart',(e)=>{onTouchStart(e,touch)});

canvas.addEventListener('mouseup', (e)=>{onMouseUp(e,mouse)});
canvas.addEventListener('touchend',(e)=>{onTouchEnd(e,touch)});

canvas.addEventListener('mousemove',(e)=>{onMouseMove(e,mouse)});
canvas.addEventListener('touchmove',(e)=>{onTouchMove(e,touch)});

canvas.addEventListener('dblclick',onDblClick);
document.addEventListener('keyup',onKeyUp);

let textInput = createElement('input', mouse);
textInput.style.width = '50px';
textInput.addEventListener('keyup', onInputKeyDown)
document.body.append(textInput);    
textInput.style.display="none";

function onTouchStart(e,t) {
  e.preventDefault();
  onMouseDown(e,t);
}

function onTouchEnd(e,t) {
  e.preventDefault();
  onMouseUp(e,t);
}

function onTouchMove(e,t) {
  e.preventDefault();
  onMouseMove(e,t);
}

function onDblClick(e) {
  //parent = board.contains(mouse);
  if (!parent) return;
  showEl(textInput);
  textInput.value = parent.text;
  setPos(textInput, parent);
}

function onInputKeyDown(e) {
  console.log(e.which);
  if (e.which === 13) {
    if (parent) {
      parent.text = e.target.value;
      hideEl(textInput);
    }
  } else if (e.which === 27) {
     // Don't save: ESC pressed
    hideEl(textInput);
  }
}

function onKeyUp(e) {
  if (e.which === 27) {
    // ESC
    if (parent) parent.dragging=false; 
  }
}


function onMouseDown(e, m) {
  parent = board.contains(m);
  console.log(parent, m);
  
  if (!parent) return;
  
  dragoffx = m.x - parent.x;
  dragoffy = m.y - parent.y;
  
  parent.dragging = true;
}


function onMouseMove(e,m) {
    if (parent && parent.dragging) {
      hideEl(textInput); // hide the text input
      parent.x = m.x-dragoffx;
      parent.y = m.y-dragoffy;
      parent.cx = parent.x + parent.w/2;
      parent.cy = parent.y + parent.h/2;
    }
}

function onMouseUp(e,m) {
  if (parent && parent.dragging) {
    parent.dragging = false;
  }
}
      

function onClick (e) {
  var rect = canvas.getBoundingClientRect();
  let m = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
  };
  
  if (parent && parent.dragging) return;
  
  let found =  board.contains(m);
  if (found) {
    parent = found;
    return;
  }
  if (!parent) {
    createShape(m) 
  } else {
    createShape(m,parent);
  }
}

board.add(new Rectangle(50,50,50,50));

function createShape(m, group) {
  let r = new Rectangle(m.x,m.y,50,50);
  r.render(ctx);
  if (group) {
    board.add(r,group);
    board.connect(group, r);
  } else {
    board.add(r);
  }
}

function loop () {
  ctx.clearRect(0,0,width,height);
  board.paint();
  window.requestAnimationFrame(loop);
}

loop();


