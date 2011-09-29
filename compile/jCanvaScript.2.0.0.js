/*!
* jCanvaScript JavaScript Library v 2.0.0
* http://jcscript.com/
*
* Copyright 2011, Alexander Savin
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function (window, undefined)
{
	var canvases = [],
	underMouse = false,
	regHasLetters = /[A-z]+?/,
	FireFox = window.navigator.userAgent.match(/Firefox\/\w+\.\w+/i),
	fps=1000/60,
	requestAnimFrame = (function(){return window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback, element){
				return setTimeout(callback, fps);
              }})(),
	cancelRequestAnimFrame = (function(){return window.cancelAnimationFrame   ||
			window.webkitCancelRequestAnimationFrame    ||
			window.mozCancelRequestAnimationFrame       ||
			window.oCancelRequestAnimationFrame     ||
			window.msCancelRequestAnimationFrame        ||
			clearTimeout})();
	if (FireFox!="" && FireFox!==null)
        var FireFox_lt_7=(parseInt(FireFox[0].split(/[ \/\.]/i)[1])<7);
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    
	function findById(i, j, stroke)
	{
		var objs=canvases[i].layers[j].objs,
		grdntsnptrns=canvases[i].layers[j].grdntsnptrns,
		objsLength=objs.length,
		grdntsnptrnsLength=grdntsnptrns.length;
		stroke=stroke.slice(1);
		for(var k=0;k<objsLength;k++)
			if(objs[k].optns.id==stroke)return objs[k];
		for(k=0;k<grdntsnptrnsLength;k++)
			if(grdntsnptrns[k].optns.id==stroke)return grdntsnptrns[k];
		return false;
	}
	function findByName(i, j, myGroup, stroke)
	{
		var objs=canvases[i].layers[j].objs,
		grdntsnptrns=canvases[i].layers[j].grdntsnptrns,
		objsLength=objs.length,
		grdntsnptrnsLength=grdntsnptrns.length;
		stroke=stroke.slice(1);
		for(var k=0;k<objsLength;k++)
			if(objs[k]._name==stroke)myGroup.elements.push(objs[k]);
		for(k=0;k<grdntsnptrnsLength;k++)
			if(grdntsnptrns[k]._name==stroke)myGroup.elements.push(grdntsnptrns[k]);
		return myGroup;
	}
	function findByCanvasAndLayer (i, j, myGroup)
	{
		var objs=canvases[i].layers[j].objs,
		grdntsnptrns=canvases[i].layers[j].grdntsnptrns,
		objsLength=objs.length,
		grdntsnptrnsLength=grdntsnptrns.length;
		for(var k=0;k<objsLength;k++)
			myGroup.elements.push(objs[k]);
		for(k=0;k<grdntsnptrnsLength;k++)
			myGroup.elements.push(grdntsnptrns[k]);
		return myGroup;
	}
    /*
    *@function
    *@namespace
    * */
	var jCanvaScript = function (stroke, map) {
        if (stroke === undefined)return this;
        if (typeof stroke == 'object') {
            map = stroke;
            stroke = undefined;
        }
        var canvasNumber = -1,layerNumber = -1,limitC = canvases.length,myGroup = jCanvaScript.group(),i,j,canvas,layer,layers,element,limitL;
        if (map === undefined) {
            if (stroke.charAt(0) == '#') {
                for (i = 0; i < limitC; i++) {
                    limitL = canvases[i].layers.length;
                    for (j = 0; j < limitL; j++) {
                        element = findById(i, j, stroke);
                        if (element)return element;
                    }
                }
            }
            if (stroke.charAt(0) == '.') {
                for (i = 0; i < limitC; i++) {
                    limitL = canvases[i].layers.length;
                    for (j = 0; j < limitL; j++)
                        myGroup = findByName(i, j, myGroup, stroke);
                }
            }
        }
        else {
            if (map.canvas !== undefined) {
                for (i = 0; i < limitC; i++)
                    if (canvases[i].optns.id == map.canvas) {
                        canvasNumber = i;
                        canvas = canvases[i];
                        break;
                    }
            }
            if (map.layer !== undefined) {
                if (canvasNumber != -1) {
                    limitL = canvas.layers.length;
                    for (i = 0; i < limitL; i++)
                        if (canvas.layers[i].optns.id == map.layer) {
                            layerNumber = i;
                            layer = canvas.layers[i];
                            break;
                        }
                }
                else {
                    for (i = 0; i < limitC; i++) {
                        layers = canvases[i].layers;
                        limitL = layers.length;
                        for (j = 0; j < limitL; j++) {
                            if (layers[j].optns.id == map.layer) {
                                canvasNumber = i;
                                layerNumber = j;
                                canvas = canvases[i];
                                layer = canvas.layers[j];
                                break;
                            }
                        }
                        if (layer > -1)break;
                    }
                }
            }
            if (layerNumber < 0 && canvasNumber < 0)return jCanvaScript.group();
            if (layerNumber < 0) {
                layers = canvas.layers;
                limitL = layers.length;
                if (stroke === undefined) {
                    for (j = 0; j < limitL; j++)
                        myGroup = findByCanvasAndLayer(canvasNumber, j, myGroup);
                }
                else if (stroke.charAt(0) == '#') {
                    for (j = 0; j < limitL; j++) {
                        element = findById(canvasNumber, j, stroke);
                        if (element)return element;
                    }
                }
                else if (stroke.charAt(0) == '.') {
                    for (j = 0; j < limitL; j++)
                        myGroup = findByName(canvasNumber, j, myGroup, stroke);
                }
            }
            else {
                if (stroke === undefined) {
                    myGroup = findByCanvasAndLayer(canvasNumber, layerNumber, myGroup);
                }
                if (stroke.charAt(0) == '#') {
                    return findById(canvasNumber, layerNumber, stroke);
                }
                if (stroke.charAt(0) == '.') {
                    myGroup = findByName(canvasNumber, layerNumber, myGroup, stroke)
                }
            }
        }
        if (map !== undefined)
            if (map.attrs !== undefined || map.fns !== undefined)
                return myGroup.find(map);
        if (myGroup.elements.length)return myGroup;
        return jCanvaScript.group();
    };
    /*@namespace*/
    jCanvaScript.Proto={};
	
jCanvaScript.getOffset = function(elem){
	if (elem.getBoundingClientRect) {
		return getOffsetRect(elem)
	} else {
		return getOffsetSum(elem)
	}
}

function getOffsetSum(elem) {
	var top = 0, left = 0;
	while(elem) {
		top = top + parseInt(elem.offsetTop);
		left = left + parseInt(elem.offsetLeft);
		elem = elem.offsetParent
	}
	return {
		top: top,
		left: left
	}
}

function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect();
	var body = document.body||{};
	var docElem = document.documentElement;
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var top = box.top + scrollTop - clientTop;
	var left = box.left + scrollLeft - clientLeft;
	return {
		top: Math.round(top),
		left: Math.round(left)
	}
}
function checkEvents(object,optns)
{
	checkMouseEvents(object,optns);
	checkKeyboardEvents(object,optns);
}
function checkKeyboardEvents(object,optns)
{
	if(!object.optns.focused)return;
	if(optns.keydown.val && optns.keydown.code!==false)if(typeof object.onkeydown=='function')object.onkeydown(optns.keydown);
	if(optns.keyup.val && optns.keyup.code!==false)if(typeof object.onkeyup=='function')object.onkeyup(optns.keyup);
	if(optns.keypress.val && optns.keypress.code!==false)if(typeof object.onkeypress=='function')object.onkeypress(optns.keypress);
}
function isPointInPath(object,x,y)
{
	var point={};
	var canvas=object.canvas();
	var ctx=canvas.optns.ctx;
	var layer=canvas.layers[object.optns.layer.number];
	point.x=x;
	point.y=y;
	if(FireFox_lt_7)
	{
		point=jCanvaScript.Matrix.transformPoint(x,y,layer.matrix());
		point=jCanvaScript.Matrix.transformPoint(point.x,point.y,object.matrix());
	}
	if(ctx.isPointInPath===undefined || object._img!==undefined || object._imgData!==undefined || object._proto=='text')
	{
		var rectangle=object.getRect('poor');
		point=jCanvaScript.Matrix.transformPoint(x,y,jCanvaScript.Matrix.multiplyMatrixAndMatrix(object.matrix(),layer.matrix()));
		if(rectangle.x<=point.x && rectangle.y<=point.y && (rectangle.x+rectangle.width)>=point.x && (rectangle.y+rectangle.height)>=point.y)return point;
	}
	else
	{
		if(ctx.isPointInPath(point.x,point.y)){
			return point;
		}
	}
	return false
}

function keyEvent(e, key, optns)
{
    if(!optns[key].val)return;
	e=e||window.event;
	optns[key].event=e;
	optns[key].code=e.charCode||e.keyCode;
	optns[key].val=true;
	optns.redraw=1;
}
function mouseEvent(e,key,optns)
{
	if(!optns[key].val)return;
	e=e||window.event;
	var point= {
		pageX:e.pageX||e.clientX,
		pageY:e.pageY||e.clientY
	};
	optns[key].event=e;
	optns[key].x=point.pageX - optns.x;
	optns[key].y=point.pageY - optns.y;
	optns.redraw=1;
}

function checkMouseEvents(object,optns)
{
	var point=false,
		mm=optns.mousemove,
		md=optns.mousedown,
		mu=optns.mouseup,
		c=optns.click,
		dc=optns.dblclick,
		x=mm.x||md.x||mu.x||dc.x||c.x,
		y=mm.y||md.y||mu.y||dc.y||c.y;
	if(x!=false)
	{
		point=isPointInPath(object,x,y);
	}
	if(point)
	{
		
		if(mm.x!=false)
			mm.object=object;
		if(md.x!=false)
			md.objects[md.objects.length]=object;
		if(c.x!=false)
			c.objects[c.objects.length]=object;
		if(dc.x!=false)
            dc.objects[dc.objects.length]=object;
		if(mu.x!=false)
			mu.objects[mu.objects.length]=object;
		optns.point=point;
	}
}

function take(f,s) {
	for(var key in s)
	{
		switch(typeof s[key])
		{
			case 'function':
				if(key.substr(0,2)=='on')break;
				if(f[key]===undefined)f[key]=s[key];
				break;
			case 'object':
				if(key=='optns' || key=='animateQueue')break;
				if(key=='objs' || key=='grdntsnptrns')
				{
					for(var i in s[key])
					{
						if(s[key].hasOwnProperty(i))
							s[key][i].clone().layer(f.optns.id);
					}
					break;
				}
				if(!s[key] || key==='ctx')continue;
				f[key]=typeof s[key].pop === 'function' ? []:{};
				take(f[key],s[key]);
				break;
			default:
				if(key=='_level')break;
				f[key]=s[key];
		}
	}
}

function changeMatrix(object)
{
	var optns=object.optns;
	object.matrix(jCanvaScript.Matrix.multiplyMatrix(optns.transformMatrix,optns.translateMatrix,optns.scaleMatrix,optns.rotateMatrix));
	object.redraw();
}

function normalizeLevels(array)
{
	for(var i=0;i<array.length;i++)
	{
		array[i].optns.number=i;
	}
}
function setLayerAndCanvasToArray(array,newLayerId,newLayerNumber,newCanvasId,newCanvasNumber)
{
	var limit=array.length,
	optns,canvas,layer;
	for(var i=0;i<limit;i++)
	{
		optns=array[i].optns;
		canvas=optns.canvas;
		layer=optns.layer;
		canvas.id=newCanvasId;
		canvas.number=newCanvasNumber;
		layer.id=newLayerId;
		layer.number=newLayerNumber;
	}
}
function levelChanger(array)
{
	array.sort(function sort(a,b){
		if(a._level>b._level)return 1;
		if(a._level<b._level)return -1;
		return 0;
	});
	normalizeLevels(array);
	return array.length;
}
function objDeleter(array)
{
	var isAnyObjectDeleted;
	do{
		isAnyObjectDeleted=false;
		for(var i=0;i<array.length;i++)
		{
			if(array[i].optns.deleted)
			{
				array.splice(i,1);
				isAnyObjectDeleted=true;
			}
		}
	}while(isAnyObjectDeleted);
	normalizeLevels(array);
	return array.length;
}

function canvas(idCanvas,array)
{
	var thisCanvas=this.optns.canvas;
	var thisLayer=this.optns.layer;
	if(idCanvas===undefined)return jCanvaScript.canvases[thisCanvas.number];
	this.redraw();
	if(canvases[thisCanvas.number].optns.id==idCanvas)return this;
	var oldIndex={
		i:thisCanvas.number,
		j:thisLayer.number
	};
	jCanvaScript.canvas(idCanvas);
	for(var i=0;i<canvases.length;i++)
	{
		var canvasItem=canvases[i];
		if(canvasItem.optns.id==idCanvas)
		{
			var oldArray=canvases[oldIndex.i].layers[oldIndex.j][array],newArray=canvasItem.layers[0][array];
			oldArray.splice(this.optns.number,1);
			normalizeLevels(oldArray);
			this._level=this.optns.number=newArray.length;
			newArray[this._level]=this;
			thisLayer.number=0;
			thisCanvas.number=i;
			thisCanvas.id=canvasItem.optns.id;
			thisLayer.id=canvasItem.layers[0].optns.id;
		}
	}
	this.redraw();
	return this;
}

function layer(idLayer,array)
{
	var thisCanvas=this.optns.canvas;
	var thisLayer=this.optns.layer;
	if (idLayer===undefined)return jCanvaScript.canvases[thisCanvas.number].layers[thisLayer.number];
	this.redraw();
	if(thisLayer.id==idLayer)return this;
	var oldIndex={
		i:thisCanvas.number,
		j:thisLayer.number
	};
	thisLayer.id=idLayer;
	var newLayer=jCanvaScript.layer(idLayer);
	var newIndex={
		i:newLayer.optns.canvas.number,
		j:newLayer.optns.number
	};
	var oldArray=canvases[oldIndex.i].layers[oldIndex.j][array],newArray=canvases[newIndex.i].layers[newIndex.j][array];
	oldArray.splice(this.optns.number,1);
	this._level=this.optns.number=newArray.length;
	newArray[this._level]=this;
	thisLayer.number=newIndex.j;
	thisCanvas.number=newIndex.i;
	thisCanvas.id=newLayer.optns.canvas.id;
	this.redraw();
	return this;
}
jCanvaScript.canvases = canvases;
jCanvaScript._lastCanvas = 0;


	
jCanvaScript.Proto.Object = function(x, y, service) {
    this._visible = true;
    this._composite = 'source-over';
    this._name = "";
    this._opacity = 1;
    this._shadowX = 0;
    this._shadowY = 0;
    this._shadowBlur = 0;
    this._shadowColorR = 0;
    this._shadowColorG = 0;
    this._shadowColorB = 0;
    this._shadowColorA = 0;
    this._translateX = 0;
    this._translateY = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this._rotateAngle = 0;
    this._rotateX = 0;
    this._rotateY = 0;
    this._transform11 = 1;
    this._transform12 = 0;
    this._transform21 = 0;
    this._transform22 = 1;
    this._transformdx = 0;
    this._transformdy = 0;
    this._matrixChanged = false;
    this._arrayName = 'objs';
    var options = x;
    if (typeof options == 'object') {
        options = jCanvaScript.checkDefaults(options, {x:0,y:0,service:false});
        service = options.service;
        y = options.y;
        x = options.x;
    }
    else {
        if (service === undefined)service = false;
    }
    var canvasItem = canvases[jCanvaScript._lastCanvas];
    this.optns = {
        animated:false,
        clipObject:false,
        drop:{val:false,fn:function() {
        }},
        drag:{val:false},
        layer:{id:canvasItem.optns.id + "_default",number:0},
        canvas:{number:0},
        focused:false,
        buffer:{val:false},
        rotateMatrix:[
            [1,0,0],
            [0,1,0]
        ],
        scaleMatrix:[
            [1,0,0],
            [0,1,0]
        ],
        translateMatrix:[
            [1,0,0],
            [0,1,0]
        ],
        transformMatrix:[
            [1,0,0],
            [0,1,0]
        ],
        shadowColor:{val:'rgba(0,0,0,0)',notColor:undefined}
    };
    this.animateQueue = [];
    this._x = x;
    this._y = y;
    if (!service && canvasItem !== undefined && canvasItem.layers[0] !== undefined) {
        this.optns.layer.number = 0;
        this.optns.canvas.number = jCanvaScript._lastCanvas;
        var layer = this.layer(),
            limit = layer.objs.length;
        this.optns.number = limit;
        this._level = limit ? (layer.objs[limit - 1]._level + 1) : 0;
        layer.objs[limit] = this;
        this.optns.layer.id = layer.optns.id;
        this.redraw();
    }
};
jCanvaScript.Proto.Object.prototype.getCenter = function(type) {
    var rect = this.getRect('poor'),
        point = {
            x:(rect.x * 2 + rect.width) / 2,
            y:(rect.y * 2 + rect.height) / 2
        };
    return jCanvaScript._helpers.getCenter(this, point, type);
};
jCanvaScript.Proto.Object.prototype.position = function() {
    return jCanvaScript.Matrix.multiplyPointMatrix(this._x, this._y, jCanvaScript.Matrix.multiplyMatrixAndMatrix(this.matrix(), this.layer().matrix()));
};
jCanvaScript.Proto.Object.prototype.buffer = function(doBuffering) {
    var bufOptns = this.optns.buffer;
    if (doBuffering === undefined)
        if (bufOptns.val)return bufOptns.cnv;
        else return false;
    if (bufOptns.val === doBuffering)return this;
    if (doBuffering) {
        var cnv = bufOptns.cnv = document.createElement('canvas'),
            ctx = bufOptns.ctx = cnv.getContext('2d'),
            rect = bufOptns.rect = this.getRect(),
            oldM = this.transform();
        cnv.setAttribute('width', rect.width);
        cnv.setAttribute('height', rect.height);
        bufOptns.x = this._x;
        bufOptns.y = this._y;
        bufOptns.dx = this._transformdx;
        bufOptns.dy = this._transformdy;
        this._x = this._y = 0;
        this.transform(1, 0, 0, 1, -rect.x + bufOptns.dx, -rect.y + bufOptns.dy, true);
        this.setOptns(ctx);
        take(bufOptns.optns = {}, this.canvas().optns);
        bufOptns.optns.ctx = ctx;
        this.draw(bufOptns.optns);
        this._x = bufOptns.x;
        this._y = bufOptns.y;
        this.transform(oldM[0][0], oldM[1][0], oldM[0][1], oldM[1][1], rect.x, rect.y, true);
        bufOptns.val = true;
    }
    else {
        this.translate(-bufOptns.rect.x + bufOptns.dx, -bufOptns.rect.y + bufOptns.dy);
        this.optns.buffer = {val:false};
    }
    return this;
};
jCanvaScript.Proto.Object.prototype.clone = function(params) {
    var clone = new jCanvaScript.Proto[this._proto]();
    take(clone, this);
    clone.layer(this.layer().optns.id);
    take(clone.optns.transformMatrix, this.optns.transformMatrix);
    take(clone.optns.translateMatrix, this.optns.translateMatrix);
    take(clone.optns.scaleMatrix, this.optns.scaleMatrix);
    take(clone.optns.rotateMatrix, this.optns.rotateMatrix);
    if (params === undefined) return clone;
    return clone.animate(params);
};
jCanvaScript.Proto.Object.prototype.shadow = function(options) {
    for (var key in options)
        switch (key) {
            case 'x':
                this._shadowX = options.x;
                break;
            case 'y':
                this._shadowY = options.y;
                break;
            case 'blur':
                this._shadowBlur = options.blur;
                break;
            case 'color':
                this.attr('shadowColor', options.color);
                break;
        }
    this.redraw();
    return this;
};
jCanvaScript.Proto.Object.prototype.setOptns = function(ctx) {
    ctx.globalAlpha = this._opacity;
    ctx.shadowOffsetX = this._shadowX;
    ctx.shadowOffsetY = this._shadowY;
    ctx.shadowBlur = this._shadowBlur;
    ctx.globalCompositeOperation = this._composite;
    var shadowColor = jCanvaScript._helpers.updateColor(this, this.optns.shadowColor, 'shadow');
    ctx.shadowColor = shadowColor.val;
    ctx.transform(this._transform11, this._transform12, this._transform21, this._transform22, this._transformdx, this._transformdy);
    return this;
};
jCanvaScript.Proto.Object.prototype.up = function(n) {
    if (n === undefined)n = 1;
    if (n == 'top')this.level(n);
    else {
        var next = this.layer().objs[this.optns.number + n];
        if (next !== undefined) {
            n = next._level + 1 - this._level;
        }
        this.level(this._level + n);
    }
    return this;
};
jCanvaScript.Proto.Object.prototype.down = function(n) {
    if (n == undefined)n = 1;
    if (n == 'bottom')this.level(n);
    else {
        var previous = this.layer().objs[this.optns.number - n];
        if (previous !== undefined) {
            n = this._level - (previous._level - 1);
        }
        this.level(this._level - n);
    }
    return this;
};
jCanvaScript.Proto.Object.prototype.level = function(n) {
    if (n == undefined)return this._level;
    var layer = this.layer();
    if (n == 'bottom') {
        if (this.optns.number == 0)n = this._level;
        else n = layer.objs[0]._level - 1;
    }
    if (n == 'top') {
        if (this.optns.number == layer.objs.length)n = this._level;
        else n = layer.objs[layer.objs.length - 1]._level + 1;
    }
    this._level = n;
    layer.optns.anyObjLevelChanged = true;
    this.redraw();
    return this;
};
jCanvaScript.Proto.Object.prototype.del = function() {
    this.optns.deleted = true;
    this.layer().optns.anyObjDeleted = true;
    this.redraw();
    this.redraw();
};
jCanvaScript.Proto.Object.prototype.focus = function(fn) {
    if (fn === undefined) {
        this.optns.focused = true;
        if (typeof this.onfocus == 'function')this.onfocus();
    }
    else this.onfocus = fn;
    return this;
};
jCanvaScript.Proto.Object.prototype.blur = function(fn) {
    if (fn === undefined) {
        this.optns.focused = false;
        if (typeof this.onblur == 'function')this.onblur();
    }
    else this.onblur = fn;
    return this;
};
jCanvaScript.Proto.Object.prototype.on = jCanvaScript.Proto.Object.prototype.addListener = function(eventName, fn) {
    if(fn===undefined)this['on'+eventName]();
	else this['on'+eventName] = fn;
	if(eventName=='mouseover'||eventName=='mouseout')eventName='mousemove';
	this.canvas().optns[eventName].val=true;
	return this;
};
jCanvaScript.Proto.Object.prototype.click = function(fn) {
    return this.on('click', fn);
};
jCanvaScript.Proto.Object.prototype.dblclick = function(fn) {
    return this.on('dblclick', fn);
};
jCanvaScript.Proto.Object.prototype.keypress = function(fn) {
    return this.on('keypress', fn);
};
jCanvaScript.Proto.Object.prototype.keydown = function(fn) {
    return this.on('keydown', fn);
};
jCanvaScript.Proto.Object.prototype.keyup = function(fn) {
    return this.on('keyup', fn);
};
jCanvaScript.Proto.Object.prototype.mousedown = function(fn) {
    return this.on('mousedown', fn);
};
jCanvaScript.Proto.Object.prototype.mouseup = function(fn) {
    return this.on('mouseup', fn);
};
jCanvaScript.Proto.Object.prototype.mousemove = function(fn) {
    return this.on('mousemove', fn);
};
jCanvaScript.Proto.Object.prototype.mouseover = function(fn) {
    return this.on('mouseover', fn);
};
jCanvaScript.Proto.Object.prototype.mouseout = function(fn) {
    return this.on('mouseout', fn);
};
jCanvaScript.Proto.Object.prototype.attr = function(parameter, value) {
    if (typeof parameter === 'object')
        var parameters = parameter;
    else {
        if (value === undefined)
            return this['_' + parameter];
        parameters = {};
        parameters[parameter] = value;
    }
    return this.animate(parameters);
};
jCanvaScript.Proto.Object.prototype.queue = function() {
    var animateQueueLength = this.animateQueue.length, queue,i,j,duration = 0,longFn = 0,fn,args = arguments;
    for (i = 0; i < args.length; i++) {
        if (typeof args[i] == 'function') {
            args[i].apply(this);
            args[i] = false;
            i++;
            if (this.animateQueue.length > animateQueueLength) {
                for (j = animateQueueLength; j < this.animateQueue.length; j++) {
                    queue = this.animateQueue[j];
                    if (queue.duration !== undefined) {
                        if (queue.duration > duration) {
                            duration = queue.duration;
                            longFn = j;
                        }
                        break;
                    }
                }
                if (duration) {
                    queue = this.animateQueue[longFn];
                    if (queue.animateFn) {
                        fn = queue.animateFn;
                        queue.animateFn = function() {
                            fn.apply(this);
                            this.queue.apply(this, args)
                        }
                    }
                    else queue.animateFn = function() {
                        this.queue.apply(this, args)
                    };
                    break;
                }
            }
        }
    }
};
jCanvaScript.Proto.Object.prototype.stop = function(jumpToEnd, runCallbacks) {
    this.optns.animated = false;
    if (runCallbacks === undefined)runCallbacks = false;
    if (jumpToEnd === undefined)jumpToEnd = false;
    for (var q = 0; q < this.animateQueue.length; q++) {
        var queue = this.animateQueue[q];
        if (runCallbacks)queue.animateFn.call(this);
        if (jumpToEnd)
            for (var key in queue) {
                if (queue[key]['from'] !== undefined) {
                    this[key] = queue[key]['to'];
                    jCanvaScript._helpers.animateTransforms(key, this, queue);
                }
            }
    }
    this.animateQueue = [];
    return this;
};
jCanvaScript.Proto.Object.prototype.animate = function(options, duration, easing, onstep, fn) {
    if (duration === undefined)duration = 1;
    else {
        if (typeof duration == 'function') {
            fn = duration;
            duration = 1;
        }
        if (typeof duration == 'object') {
            easing = duration;
            duration = 1;
        }
    }
    if (easing === undefined)easing = {fn:'linear',type:'in'};
    else {
        if (typeof easing == 'function') {
            fn = easing;
            easing = {fn:'linear',type:'in'};
        }
        if (easing.type === undefined)easing.type = 'in';
    }
    if (onstep === undefined)onstep = false;
    else {
        if (typeof onstep == 'function') {
            fn = onstep;
            onstep = false;
        }
    }
    if (options.scale !== undefined) {
        this._scaleX = this._scaleY = 1;
        if (typeof options.scale != 'object') {
            options.scaleX = options.scaleY = options.scale;
        }
        else {
            options.scaleX = options.scale.x || 1;
            options.scaleY = options.scale.y || 1;
        }
    }
    if (options.translate !== undefined) {
        this._translateX = this._translateY = 0;
        if (typeof options.translate != 'object') {
            options.translateX = options.translateY = options.translate;
        }
        else {
            options.translateX = options.translate.x || 0;
            options.translateY = options.translate.y || 0;
        }
        options.translate = undefined;
    }
    if (options.translateTo !== undefined) {
        var point = this.position();
        this._translateToX = point.x;
        this._translateToY = point.y;
        if (typeof options.translateTo != 'object') {
            options.translateToX = options.translateToY = options.translateTo;
        }
        else {
            options.translateToX = options.translateTo.x || 0;
            options.translateToY = options.translateTo.y || 0;
        }
        options.translateTo = undefined;
    }
    if (options.rotate !== undefined) {
        options.rotateAngle = options.rotate.angle;
        this._rotateAngle = 0;
        this._rotateX = options.rotate.x || 0;
        this._rotateY = options.rotate.y || 0;
        options.rotate = undefined;
    }
    if (duration > 1) {
        var queue = this.animateQueue[this.animateQueue.length] = {animateKeyCount:0};
        queue.animateFn = fn || false;
        this.optns.animated = true;
        queue.duration = duration;
        queue.step = 0;
        queue.easing = easing;
        queue.onstep = onstep;
    }
    for (var key in options) {
        if (!options.hasOwnProperty(key))continue;
        var colorArray = key.split('Color');
        if (colorArray[0] != "" && colorArray[1] == "") {
            var
                color = options[key],
                colorKeeper = jCanvaScript.parseColor(color);
            if (colorKeeper.color.notColor)
                this.optns[key].notColor = colorKeeper.color.notColor;
            else {
                options[key + 'R'] = colorKeeper.r;
                options[key + 'G'] = colorKeeper.g;
                options[key + 'B'] = colorKeeper.b;
                options[key + 'A'] = colorKeeper.a;
            }
            options[key] = undefined;
        }
    }
    for (key in options) {
        if (this['_' + key] !== undefined && options[key] !== undefined) {
            var keyValue = options[key],privateKey = '_' + key;
            if (keyValue != this[privateKey]) {
                if (keyValue.charAt) {
                    if (key == 'string')this._string = keyValue;
                    else if (keyValue.charAt(1) == '=') {
                        keyValue = this[privateKey] + parseInt(keyValue.charAt(0) + '1') * parseInt(keyValue.substr(2));
                    }
                    else if (!regHasLetters.test(keyValue))keyValue = parseInt(keyValue);
                    else this[privateKey] = keyValue;
                }
                if (duration == 1)this[privateKey] = keyValue;
                else {
                    queue[privateKey] = {
                        from:this[privateKey],
                        to:keyValue,
                        prev:0
                    };
                    queue.animateKeyCount++;
                }
            }
        }
    }
    if (duration == 1) {
        if (options['rotateAngle'])
            this.rotate(this._rotateAngle, this._rotateX, this._rotateY);
        if (options['translateX'] || options['translateY'])
            this.translate(this._translateX, this._translateY);
        if (options['translateToX'] || options['translateToY'])
            this.translate(this._translateToX, this._translateToY);
        if (options['scaleX'] || options['scaleY'])
            this.scale(this._scaleX, this._scaleY);
    }
    this.redraw();
    return this;
};
jCanvaScript.Proto.Object.prototype.matrix = function(m) {
    if (m === undefined)return [
        [this._transform11,this._transform21,this._transformdx],
        [this._transform12,this._transform22,this._transformdy]
    ];
    this._transform11 = m[0][0];
    this._transform21 = m[0][1];
    this._transform12 = m[1][0];
    this._transform22 = m[1][1];
    this._transformdx = m[0][2];
    this._transformdy = m[1][2];
    return this;
};
jCanvaScript.Proto.Object.prototype.translateTo = function(newX, newY, duration, easing, onstep, fn) {
    if (duration !== undefined)
        return this.animate({translateTo:{x:newX,y:newY}}, duration, easing, onstep, fn);
    var point = this.position(),
        x = 0,y = 0;
    if (newX !== undefined)
        x = newX - point.x;
    if (newY !== undefined)
        y = newY - point.y;
    return this.translate(x, y);
};
jCanvaScript.Proto.Object.prototype.translate = function(x, y, duration, easing, onstep, fn) {
    if (duration !== undefined)
        return this.animate({translate:{x:x,y:y}}, duration, easing, onstep, fn);
    this.optns.translateMatrix = jCanvaScript.Matrix.multiplyMatrix(this.optns.translateMatrix, [
        [1,0,x],
        [0,1,y]
    ]);
    changeMatrix(this);
    return this;
};
jCanvaScript.Proto.Object.prototype.scale = function(x, y, duration, easing, onstep, fn) {
    if (duration !== undefined)
        return this.animate({scale:{x:x,y:y}}, duration, easing, onstep, fn);
    if (y === undefined)y = x;
    this.optns.scaleMatrix = jCanvaScript.Matrix.multiplyMatrix(this.optns.scaleMatrix, [
        [x,0,this._x * (1 - x)],
        [0,y,this._y * (1 - y)]
    ]);
    changeMatrix(this);
    return this;
};
jCanvaScript.Proto.Object.prototype.rotate = function(x, x1, y1, duration, easing, onstep, fn) {
    if (duration !== undefined)
        return this.animate({rotate:{angle:x,x:x1,y:y1}}, duration, easing, onstep, fn);
    x = x / jCanvaScript.constants.radian;
    var cos = Math.cos(x),
        sin = Math.sin(x),
        translateX = 0,
        translateY = 0;
    if (x1 !== undefined) {
        if (x1 == 'center') {
            var point = this.getCenter('poor');
            if (y1 === undefined) {
                x1 = point.x;
                y1 = point.y;
            }
            else {
                x1 = point.x + y1.x;
                y1 = point.y + y1.y;
            }
        }
        translateX = -x1 * (cos - 1) + y1 * sin;
        translateY = -y1 * (cos - 1) - x1 * sin;
    }
    this.optns.rotateMatrix = jCanvaScript.Matrix.multiplyMatrix(this.optns.rotateMatrix, [
        [cos,-sin,translateX],
        [sin,cos,translateY]
    ]);
    changeMatrix(this);
    return this;
};
jCanvaScript.Proto.Object.prototype.transform = function(m11, m12, m21, m22, dx, dy, reset) {
    if (m11 === undefined)return this.matrix();
    var optns = this.optns;
    if (reset !== undefined) {
        optns.transformMatrix = [
            [m11,m21,dx],
            [m12,m22,dy]
        ];
        optns.rotateMatrix = [
            [1,0,0],
            [0,1,0]
        ];
        optns.scaleMatrix = [
            [1,0,0],
            [0,1,0]
        ];
        optns.translateMatrix = [
            [1,0,0],
            [0,1,0]
        ];
    }
    else {
        optns.transformMatrix = multiplyM(optns.transformMatrix, [
            [m11,m21,dx],
            [m12,m22,dy]
        ]);
    }
    changeMatrix(this);
    return this;
};
jCanvaScript.Proto.Object.prototype.beforeDraw = function(canvasOptns) {
    if (!this._visible)return false;
    var ctx = canvasOptns.ctx;
    ctx.save();
    if (this.optns.clipObject) {
        var clipObject = this.optns.clipObject;
        clipObject._visible = true;
        if (clipObject.optns.animated)jCanvaScript._helpers.animating.call(clipObject, canvasOptns);
        clipObject.setOptns(ctx);
        ctx.beginPath();
        clipObject.draw(ctx);
        ctx.clip();
    }
    this.setOptns(ctx);
    if (this.optns.animated)jCanvaScript._helpers.animating.call(this, canvasOptns);
    ctx.beginPath();
    return true;
};
jCanvaScript.Proto.Object.prototype.clip = function(object) {
    if (object === undefined)return this.optns.clipObject;
    this.layer().objs.splice(object.optns.number, 1);
    this.optns.clipObject = object;
    return this;
};
jCanvaScript.Proto.Object.prototype.afterDraw = function(optns) {
    optns.ctx.closePath();
    checkEvents(this, optns);
    optns.ctx.restore();
    if (this.optns.clipObject) {
        jCanvaScript.Proto.Shape.afterDraw.call(this.optns.clipObject, optns);
    }
};
jCanvaScript.Proto.Object.prototype.redraw = function() {
    this.canvas().optns.redraw = 1;
};
jCanvaScript.Proto.Object.prototype.isPointIn = function(x, y, global) {
    var canvasOptns = this.canvas().optns,
        ctx = canvasOptns.ctx,
        thisAnimated = false,
        optns = this.optns,
        clipAnimated = false;
    if (global !== undefined) {
        x -= canvasOptns.x;
        y -= canvasOptns.y;
    }
    if (optns.animated)thisAnimated = true;
    optns.animated = false;
    if (optns.clipObject) {
        var clipObject = optns.clipObject,
            clipOptns = clipObject.optns;
        if (clipOptns.animated) {
            clipAnimated = true;
            clipOptns.animated = false;
        }
    }
    this.beforeDraw(canvasOptns);
    this.draw(ctx);
    var point = isPointInPath(this, x, y);
    ctx.closePath();
    ctx.restore();
    optns.animated = thisAnimated;
    if (clipAnimated) {
        clipOptns.animated = clipAnimated;
    }
    return (typeof point == 'object');

};
jCanvaScript.Proto.Object.prototype.layer = function(idLayer) {
    return layer.call(this,idLayer, this._arrayName);
};
jCanvaScript.Proto.Object.prototype.canvas = function(idCanvas) {
    return canvas.call(this, idCanvas, this._arrayName);
};
jCanvaScript.Proto.Object.prototype.draggable = function(object, params, drag) {
    if (params === undefined && typeof object == 'object' && object.optns === undefined) {
        params = object.params;
        drag = object.drag;
        var start = object.start,
            stop = object.stop,
            disabled = object.disabled;
        object = object.object;
    }
    var dragObj = this;
    var dragOptns = this.optns.drag;
    if (typeof params === 'function') {
        drag = params;
        params = undefined;
    }
    if (typeof object == 'function') {
        drag = object;
        object = undefined;
    }
    dragOptns.shiftX = 0;
    dragOptns.shiftY = 0;
    if (params !== undefined) {
        if (params.shiftX !== undefined) {
            dragOptns.shiftX = params.shiftX;
            params.shiftX = undefined;
        }
        if (params.shiftY !== undefined) {
            dragOptns.shiftY = params.shiftY;
            params.shiftY = undefined;
        }
    }
    if (object !== undefined) {
        if (object.id)dragObj = (params === undefined) ? object.visible(false) : object.animate(params).visible(false);
        if (object == 'clone') {
            dragObj = this.clone(params).visible(false);
            dragOptns.type = 'clone';
        }
    }
    dragOptns.val = true;
    dragOptns.x = this._x;
    dragOptns.y = this._y;
    dragOptns.dx = this._transformdx;
    dragOptns.dy = this._transformdy;
    dragOptns.object = dragObj;
    dragOptns.params = params;
    dragOptns.drag = drag || false;
    dragOptns.start = start || false;
    dragOptns.stop = stop || false;
    dragOptns.disabled = disabled || false;
    var canvasOptions = this.canvas().optns;
    canvasOptions.mousemove.val = true;
    canvasOptions.mousedown.val = true;
    canvasOptions.mouseup.val = true;
    return this;
};
jCanvaScript.Proto.Object.prototype.droppable = function(fn) {
    this.optns.drop.val = true;
    if (fn !== undefined)this.optns.drop.fn = fn;
    return this;
};
jCanvaScript.Proto.Object.prototype.name = function(name) {
    return this.attr('name', name);
};
jCanvaScript.Proto.Object.prototype.visible = function(visibility) {
    return this.attr('visible', visibility);
};
jCanvaScript.Proto.Object.prototype.composite = function(composite) {
    return this.attr('composite', composite);
};
jCanvaScript.Proto.Object.prototype.id = function(id) {
    if (id === undefined)return this.optns.id;
    this.optns.id = id;
    return this;
};
jCanvaScript.Proto.Object.prototype.opacity = function(n) {
    return this.attr('opacity', n);
};
jCanvaScript.Proto.Object.prototype.fadeIn = function(duration, easing, onstep, fn) {
    return this.fadeTo(1, duration, easing, onstep, fn);
};
jCanvaScript.Proto.Object.prototype.fadeOut = function(duration, easing, onstep, fn) {
    return this.fadeTo(0, duration, easing, onstep, fn);
};
jCanvaScript.Proto.Object.prototype.fadeTo = function(val, duration, easing, onstep, fn) {
    if (duration === undefined)duration = 600;
    return this.animate({opacity:val}, duration, easing, onstep, fn);
};
jCanvaScript.Proto.Object.prototype.fadeToggle = function(duration, easing, onstep, fn) {
    if (this._opacity)
        this.fadeOut(duration, easing, onstep, fn);
    else
        this.fadeIn(duration, easing, onstep, fn);
    return this;
};
jCanvaScript.Proto.Object.prototype.instanceOf = function(name) {
    if (name === undefined)return this._proto;
    return ((this instanceof jCanvaScript.Proto[name]) == true);
};

jCanvaScript.Proto.Canvas = function(idCanvas){
    var limit = jCanvaScript.canvases.length;
    jCanvaScript.canvases[limit] = this;
    jCanvaScript._lastCanvas = limit;
    this.cnv = document.getElementById(idCanvas);
    if ('\v' == 'v') {
        if (typeof G_vmlCanvasManager !== 'undefined')
            G_vmlCanvasManager.initElement(this.cnv);
        if (typeof FlashCanvas !== 'undefined')
            FlashCanvas.initElement(this.cnv);
    }
    this.optns =
    {
        id:idCanvas,
        number:jCanvaScript._lastCanvas,
        ctx: this.cnv.getContext('2d'),
        width: this.cnv.offsetWidth || this.cnv.width,
        height: this.cnv.offsetHeight || this.cnv.height,
        anyLayerDeleted: false,
        anyLayerLevelChanged:false,
        keydown:{val:false,code:false},
        keyup:{val:false,code:false},
        keypress:{val:false,code:false},
        mousemove:{val:false,x:false,y:false,object:false},
        click:{val:false,x:false,y:false,objects:[]},
        dblclick:{val:false,x:false,y:false,objects:[]},
        mouseup:{val:false,x:false,y:false,objects:[]},
        mousedown:{val:false,x:false,y:false,objects:[]},
        drag:{object:false,x:0,y:0},
        gCO: 'source-over',
        redraw:1
    };
    this.layers = [];
    this.interval = 0;
    this._proto = 'Canvas';
    jCanvaScript.layer(idCanvas+'_default').canvas(idCanvas);
}
jCanvaScript.Proto.Canvas.prototype.id = jCanvaScript.Proto.Object.prototype.id
jCanvaScript.Proto.Canvas.prototype.toDataURL = function() {
    return canvas.cnv.toDataURL.apply(canvas.cnv, arguments);
};

jCanvaScript.Proto.Canvas.prototype.start = function(isAnimated) {
    jCanvaScript._lastCanvas = this.optns.number;
    if (isAnimated) {
        if (this.interval)return this;
        this.isAnimated = isAnimated;
        var offset = jCanvaScript.getOffset(this.cnv);
        this.optns.x = offset.left + (parseInt(this.cnv.style.borderTopWidth) || 0);
        this.optns.y = offset.top + (parseInt(this.cnv.style.borderLeftWidth) || 0);
        var canvas = canvases[this.optns.number],
            optns = canvas.optns;
        this.cnv.onclick = function(e) {
            mouseEvent(e, 'click', optns);
        };
        this.cnv.ondblclick = function(e) {
            mouseEvent(e, 'dblclick', optns);
            var tmp = optns.mousemove.val;
            optns.mousemove.val = true;
            setTimeout(function() {
                optns.mousemove.val = tmp;
            }, 3000);
        };
        this.cnv.onmousedown = function(e) {
            mouseEvent(e, 'mousedown', optns);
        };
        this.cnv.onmouseup = function(e) {
            mouseEvent(e, 'mouseup', optns);
        };
        this.cnv.onkeyup = function(e) {
            keyEvent(e, 'keyup', optns);
        };
        this.cnv.onkeydown = function(e) {
            keyEvent(e, 'keydown', optns);
        };
        this.cnv.onkeypress = function(e) {
            keyEvent(e, 'keypress', optns);
        };
        this.cnv.onmouseout = this.cnv.onmousemove = function(e) {
            mouseEvent(e, 'mousemove', optns);
        };
        optns.timeLast = new Date();
        this.interval = requestAnimFrame(function(time) {
                canvas.interval = canvas.interval || 1;
                canvas.frame(time);
            },
            this.cnv);
    }
    else return this.frame();
    return this;
};
jCanvaScript.Proto.Canvas.prototype.pause = function() {
    cancelRequestAnimFrame(this.interval);
    this.interval = 0;
};
jCanvaScript.Proto.Canvas.prototype.del = function() {
    cancelRequestAnimFrame(this.interval);
    this.layers = [];
    canvases.splice(this.optns.number, 1);
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i],
            layers = canvas.layers,
            limitL = layers.length;
        canvas.optns.number = i;
        for (var j = 0; j < limitL; j++) {
            var layer = layers[j];
            layer.optns.canvas.number = i;
            setLayerAndCanvasToArray(layer.objs, layer.optns.id, layer.optns.number, canvas.optns.id, canvas.optns.number);
            setLayerAndCanvasToArray(layer.grdntsnptrns, layer.optns.id, layer.optns.number, canvas.optns.id, canvas.optns.number);
        }
    }
    if (this.cnv.parentNode)this.cnv.parentNode.removeChild(this.cnv);
    jCanvaScript._lastCanvas = 0;
    return false;
};
jCanvaScript.Proto.Canvas.prototype.clear = function() {
    cancelRequestAnimFrame(this.interval);
    this.interval = 0;
    this.layers = [];
    jCanvaScript.layer(this.optns.id + 'Layer_0').canvas(this.optns.id);
    this.optns.ctx.clearRect(0, 0, this.optns.width, this.optns.height);
    this.optns.redraw++;
    return this;
};
jCanvaScript.Proto.Canvas.prototype.frame = function(time) {
    var optns = this.optns,thisCanvas = this;
    time = time || (new Date());
    optns.timeDiff = time - optns.timeLast;
    optns.timeLast = time;
    if (this.interval) {
        this.interval = requestAnimFrame(function(time) {
            thisCanvas.frame(time);
        }, thisCanvas.cnv);
        this.interval = this.interval || 1;
    }
    if (!optns.redraw)return this;
    optns.redraw--;
    optns.ctx.clearRect(0, 0, optns.width, optns.height);
    if (this.layers.length == 0)return this;
    limit = this.layers.length;
    if (optns.anyLayerLevelChanged)
        limit = levelChanger(this.layers);
    if (optns.anyLayerDeleted)
        limit = objDeleter(this.layers);
    if (optns.anyLayerLevelChanged || optns.anyLayerDeleted) {
        optns.anyLayerLevelChanged = optns.anyLayerDeleted = false;
        for (var i = 0; i < limit; i++) {
            var layer = this.layers[i],layerOptns = layer.optns;
            setLayerAndCanvasToArray(layer.objs, layerOptns.id, layerOptns.number, this.optns.id, this.optns.number);
            setLayerAndCanvasToArray(layer.grdntsnptrns, layerOptns.id, layerOptns.number, idCanvas, this.optns.number);
        }
    }
    for (i = 0; i < limit; i++) {
        var object = this.layers[i];
        if (typeof (object.draw) == 'function')
            if (object.beforeDraw(optns)) {
                if (typeof (object.draw) == 'function') {
                    object.draw(optns);
                    object.afterDraw(optns);
                }
            }
    }
    var mm = optns.mousemove;
    var mouseDown = optns.mousedown;
    var mouseUp = optns.mouseup;
    var click = this.optns.click;
    var dblClick = this.optns.dblclick;
    if (mm.x != false) {
        if (optns.drag.object != false) {
            var drag = optns.drag,
                dobject = drag.object;
            dobject.translate(mm.x - drag.x, mm.y - drag.y);
            drag.x = mm.x;
            drag.y = mm.y;
            if (drag.drag)drag.drag.call(dobject, {x:mm.x,y:mm.y});
        }
        var point = this.optns.point || {};
        point.event = mm.event;
        if (mm.object != false) {
            var mousemoveObject = mm.object;
            if (underMouse === mousemoveObject) {
                if (typeof mousemoveObject.onmousemove == 'function')
                    mousemoveObject.onmousemove(point);
            }
            else {
                if (underMouse != false)
                    if (typeof underMouse.onmouseout == 'function')
                        underMouse.onmouseout(point);
                if (typeof mousemoveObject.onmouseover == 'function')
                    mousemoveObject.onmouseover(point);
                underMouse = mousemoveObject;
            }
        }
        else {
            if (underMouse !== false) {
                if (typeof underMouse.onmouseout == 'function') {
                    underMouse.onmouseout(point);
                }
                underMouse = false;
            }
        }
        optns.mousemove.object = false;
    }
    if (mouseDown.objects.length) {
        mdCycle:
            for (i = mouseDown.objects.length - 1; i > -1; i--) {
                var mouseDownObjects = [mouseDown.objects[i],mouseDown.objects[i].layer()], mdObject;
                for (var j = 0; j < 2; j++) {
                    mdObject = mouseDownObjects[j];
                    if (mdObject.optns.drag.val && !mdObject.optns.drag.disabled) {
                        drag = optns.drag;
                        dobject = drag.object = mdObject.optns.drag.object.visible(true);
                        drag.drag = mdObject.optns.drag.drag;
                        drag.init = mdObject;
                        var initoptns = drag.init.optns;
                        if (initoptns.drag.params !== undefined)dobject.animate(initoptns.drag.params);
                        drag.x = drag.startX = mouseDown.x;
                        drag.y = drag.startY = mouseDown.y;
                        if (dobject != drag.init && initoptns.drag.type != 'clone') {
                            point = transformPoint(mouseDown.x, mouseDown.y, dobject.matrix());
                            dobject.translate(point.x - dobject._x, point.y - dobject._y);
                        }
                        dobject.translate(initoptns.drag.shiftX, initoptns.drag.shiftY);
                        if (typeof initoptns.drag.start == 'function')
                            initoptns.drag.start.call(dobject, {x:mouseDown.x,y:mouseDown.y});
                    }
                    if (typeof mdObject.onmousedown == 'function')
                        if (mdObject.onmousedown({x:mouseDown.x,y:mouseDown.y,event:mouseDown.event}) === false)
                            break mdCycle;
                }
            }
        mouseDown.objects = [];
    }
    if (mouseUp.objects.length) {
        muCycle:
            for (i = mouseUp.objects.length - 1; i > -1; i--) {
                var mouseUpObjects = [mouseUp.objects[i],mouseUp.objects[i].layer()],muObject;
                drag = optns.drag;
                for (j = 0; j < 2; j++) {
                    muObject = mouseUpObjects[j];
                    if (optns.drag.init !== undefined) {
                        if (muObject.optns.drop.val) {

                            if (drag.init == drag.object)
                                drag.init.visible(true);
                            if (typeof muObject.optns.drop.fn == 'function')
                                muObject.optns.drop.fn.call(muObject, drag.init);
                        }
                        else {
                            drag.object.visible(false);
                            drag.init.visible(true);
                            drag.init.optns.translateMatrix[0][2] = drag.object.optns.translateMatrix[0][2];
                            drag.init.optns.translateMatrix[1][2] = drag.object.optns.translateMatrix[1][2];
                            changeMatrix(drag.init);
                            if (drag.object != drag.init)drag.object.visible(false);
                            if (typeof drag.init.optns.drag.stop == 'function')
                                drag.init.optns.drag.stop.call(drag.init, {x:mouseUp.x,y:mouseUp.y});
                        }
                        if (drag.x != drag.startX || drag.y !== drag.startY)click.objects = [];
                    }
                    if (typeof muObject.onmouseup == 'function')
                        if (muObject.onmouseup({x:mouseUp.x,y:mouseUp.y,event:mouseUp.event}) === false)
                            break muCycle;
                }
            }
        this.optns.drag = {object:false,x:0,y:0};
        mouseUp.objects = [];
    }
    if (click.objects.length) {
        cCycle:
            for (i = click.objects.length - 1; i > -1; i--) {
                var mouseClickObjects = [click.objects[i],click.objects[i].layer()];
                for (j = 0; j < 2; j++) {
                    if (typeof mouseClickObjects[j].onclick == 'function')
                        if (mouseClickObjects[j].onclick({x:click.x,y:click.y,event:click.event}) === false)
                            break cCycle;
                }
            }
        click.objects = [];
    }
    if (dblClick.objects.length) {
        dcCycle:
            for (i = dblClick.objects.length - 1; i > -1; i--) {
                var mouseDblClickObjects = [dblClick.objects[i],dblClick.objects[i].layer()];
                for (j = 0; j < 2; j++) {
                    if (typeof mouseDblClickObjects[j].ondblclick == 'function')
                        if (mouseDblClickObjects[j].ondblclick({x:dblClick.x,y:dblClick.y, event:dblClick.event}) === false)
                            break dcCycle;
                }
            }
        dblClick.objects = [];
    }
    optns.keyup.code = optns.keydown.code = optns.keypress.code = click.x = dblClick.x = mouseUp.x = mouseDown.x = mm.x = false;
    return this;
};
jCanvaScript.canvas = function(idCanvas) {
    if (idCanvas === undefined)return canvases[0];
    var limit = canvases.length;
    for (var i = 0; i < limit; i++)
        if (canvases[i].optns)
            if (canvases[i].optns.id == idCanvas)return canvases[i];
    return new jCanvaScript.Proto.Canvas(idCanvas);
};

jCanvaScript.Proto.Group = function(elements) {
    for (var Class in jCanvaScript.Proto)if (jCanvaScript.Proto.hasOwnProperty(Class)){
        if (Class == 'Group')continue;
        var tmp = jCanvaScript.Proto[Class].prototype;
        for (var key in tmp) if(tmp.hasOwnProperty(key)){
            if (typeof tmp[key] == 'function' && jCanvaScript.Proto.Group.prototype[key] === undefined) {
                (function(group, key) {
                    jCanvaScript.Proto.Group.prototype[key] = function() {
                        var argumentsClone = [];
                        var args = [];
                        var i = 0;
                        while (arguments[i] !== undefined)
                            args[i] = arguments[i++];
                        for (i = 0; i < this.elements.length; i++) {
                            var element = this.elements[i];
                            take(argumentsClone, args);
                            if (typeof element[key] == 'function') {
                                element[key].apply(element, argumentsClone);
                            }
                        }
                        return this;
                    }
                })(this, key);
            }
        }
    }
    this.elements = elements || [];
    this.unmatchedElements = [];
    this._proto='Group';
};
jCanvaScript.Proto.Group.prototype.reverse = function() {
    var tmpArray = this.elements;
    this.elements = this.unmatchedElements;
    this.unmatchedElements = tmpArray;
    return this;
};
jCanvaScript.Proto.Group.prototype.end = function(n) {
    if (this.previousGroup === undefined || n === 0)return this;
    if (n !== undefined)n--;
    return this.previousGroup.end(n);
};
jCanvaScript.Proto.Group.prototype.find = function(map) {
    var subgroup = group(),
        attrs = map.attrs,
        fns = map.fns || [],
        i,j,
        element,rel,fn,value1,value2;
    subgroup.previousGroup = this;
    for (i = 0; i < this.elements.length; i++) {
        subgroup.elements[i] = this.elements[i];
    }
    if (attrs !== undefined) {
        for (j in attrs) {
            if (attrs.hasOwnProperty(j)) {
                if (typeof attrs[j] != 'object') {
                    attrs[j] = {val:attrs[j],rel:'=='};
                }
                fns[fns.length] = {
                    fn:'attr',
                    args:[j],
                    val:attrs[j].val,
                    rel:attrs[j].rel
                };
            }
        }
    }
    if (fns.length) {
        for (i = 0; i < subgroup.elements.length; i++) {
            element = subgroup.elements[i];
            for (j = 0; j < fns.length; j++) {
                fn = fns[j];
                value2 = fn.val;
                rel = fn.rel;
                if (typeof element[fn.fn] == 'function')
                    value1 = element[fn.fn].apply(element, fn.args);
                else rel = 'del';
                switch (rel) {
                    case '!=':
                        if (!(value1 != value2))rel = 'del';
                        break;
                    case '!==':
                        if (!(value1 !== value2))rel = 'del';
                        break;
                    case '==':
                        if (!(value1 == value2))rel = 'del';
                        break;
                    case '===':
                        if (!(value1 === value2))rel = 'del';
                        break;
                    case '>=':
                        if (!(value1 >= value2))rel = 'del';
                        break;
                    case '<=':
                        if (!(value1 <= value2))rel = 'del';
                        break;
                    case '>':
                        if (!(value1 > value2))rel = 'del';
                        break;
                    case '<':
                        if (!(value1 < value2))rel = 'del';
                        break;
                    case 'typeof':
                        if (!(typeof value1 == value2))rel = 'del';
                        break;
                }
                if (rel == 'del') {
                    subgroup.unmatchedElements[subgroup.unmatchedElements.length] = element;
                    subgroup.elements.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }
    return subgroup;
};
jCanvaScript.group = function(elements)
{
	return new jCanvaScript.Proto.Group(elements);
}

jCanvaScript.Proto.Layer =function(idLayer) {
    this._proto = 'Layer';
    var canvas = canvases[jCanvaScript._lastCanvas],
        lastCanvasLayers = canvas.layers,
        lastCanvasOptns = canvas.optns;
    jCanvaScript.Proto.Object.call(this, 0, 0, true);
    var limit = lastCanvasLayers.length;
    lastCanvasLayers[limit] = this;
    this.objs = [];
    this.grdntsnptrns = [];
    this._level = limit ? (lastCanvasLayers[limit - 1]._level + 1) : 0;
    this.optns.number = limit;
    this.optns.id = idLayer;
    var thisOptns = this.optns;
    thisOptns.anyObjDeleted = false;
    thisOptns.anyObjLevelChanged = false;
    thisOptns.gCO = lastCanvasOptns.gCO;
    thisOptns.canvas.id = lastCanvasOptns.id;
    thisOptns.canvas.number = jCanvaScript._lastCanvas;
    return this;
}
jCanvaScript.Proto.Layer.prototype = Object.create(jCanvaScript.Proto.Object.prototype);
jCanvaScript.Proto.Layer.prototype.position = function() {
    var objs = this.objs,
        points,point,i,
        limit = objs.length;
    for (i = 0; i < limit; i++) {
        point = objs[i].position();
        if (points === undefined)points = point;
        if (points.x > point.x)points.x = point.x;
        if (points.y > point.y)points.y = point.y;
    }
    return points;
};
jCanvaScript.Proto.Layer.prototype.getRect = function(type) {
    var objs = this.objs,
        points,rect,i,
        limit = objs.length;
    if (objs.length == 0)return false;
    if (type == 'coords') {
        for (i = 0; i < limit; i++) {
            rect = objs[i].getRect(type);
            if (points === undefined)points = rect;
            if (points[0][0] > rect[0][0])points[0][0] = rect[0][0];
            if (points[0][1] > rect[0][1])points[0][1] = rect[0][1];
            if (points[1][0] < rect[1][0])points[1][0] = rect[1][0];
            if (points[1][1] > rect[1][1])points[1][1] = rect[1][1];
            if (points[2][0] > rect[2][0])points[2][0] = rect[2][0];
            if (points[2][1] < rect[2][1])points[2][1] = rect[2][1];
            if (points[3][0] < rect[3][0])points[3][0] = rect[3][0];
            if (points[3][1] < rect[3][1])points[3][1] = rect[3][1];
        }
        return points;
    }
    for (i = 0; i < limit; i++) {
        rect = objs[i].getRect(type);
        rect.right = rect.width + rect.x;
        rect.bottom = rect.height + rect.y;
        if (points === undefined)points = rect;
        if (points.x > rect.x)points.x = rect.x;
        if (points.y > rect.y)points.y = rect.y;
        if (points.right < rect.right)points.right = rect.right;
        if (points.bottom < rect.bottom)points.bottom = rect.bottom;
    }
    points.width = points.right - points.x;
    points.height = points.bottom - points.y;
    return points;
};
jCanvaScript.Proto.Layer.prototype.canvas = function(idCanvas) {
    if (idCanvas === undefined)return jCanvaScript.canvases[this.optns.canvas.number];
    if (this.optns.canvas.id == idCanvas)return this;
    var newCanvas = -1,oldCanvas = 0,limitC = canvases.length;
    for (var i = 0; i < limitC; i++) {
        var idCanvasItem = canvases[i].optns.id;
        if (idCanvasItem == idCanvas)newCanvas = i;
        if (idCanvasItem == this.optns.canvas.id)oldCanvas = i;
    }
    if (newCanvas < 0) {
        newCanvas = canvases.length;
        jCanvaScript.canvas(idCanvas);
    }
    this.optns.canvas.id = idCanvas;
    this.optns.canvas.number = newCanvas;
    canvases[oldCanvas].layers.splice(this.optns.number, 1);
    var layersArray = canvases[newCanvas].layers;
    this._level = this.optns.number = layersArray.length;
    layersArray[this._level] = this;
    setLayerAndCanvasToArray(this.objs, this.optns.id, this._level, idCanvas, newCanvas);
    setLayerAndCanvasToArray(this.grdntsnptrns, this.optns.id, this._level, idCanvas, newCanvas);
    canvases[newCanvas].optns.redraw = 1;
    return this;
};
jCanvaScript.Proto.Layer.prototype.up = function(n) {
    if (n === undefined)n = 1;
    if (n == 'top')this.level(n);
    else {
        var next = this.canvas().layers[this.optns.number + n];
        if (next !== undefined) {
            n = next._level + 1 - this._level;
        }
        this.level(this._level + n);
    }
    return this;
};
jCanvaScript.Proto.Layer.prototype.down = function(n) {
    if (n == undefined)n = 1;
    if (n == 'bottom')this.level(n);
    else {
        var previous = this.canvas().layers[this.optns.number - n];
        if (previous !== undefined) {
            n = this._level - (previous._level - 1);
        }
        this.level(this._level - n);
    }
    return this;
};
jCanvaScript.Proto.Layer.prototype.level = function(n) {
    if (n == undefined)return this._level;
    var canvas = this.canvas(),
        optns = canvas.optns;
    if (n == 'bottom')
        if (this.optns.number == 0)n = this._level;
        else n = canvas.layers[0]._level - 1;
    if (n == 'top')
        if (this.optns.number == canvas.layers.length - 1)n = this._level;
        else n = canvas.layers[canvas.layers.length - 1]._level + 1;
    this._level = n;
    optns.anyLayerLevelChanged = true;
    optns.redraw = 1;
    return this;
};
jCanvaScript.Proto.Layer.prototype.del = function() {
    var optns = this.canvas().optns;
    optns.anyLayerDeleted = true;
    this.draw = false;
    optns.redraw = 1;
};
jCanvaScript.Proto.Layer.prototype.setOptns = function(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
   jCanvaScript.Proto.Object.prototype.setOptns.call(this, ctx);
    return this;
};
jCanvaScript.Proto.Layer.prototype.afterDraw = function(optns) {
    optns.ctx.closePath();
    optns.ctx.restore();
    if (this.optns.clipObject) {
        jCanvaScript.Proto.Object.prototype.afterDraw.call(this.optns.clipObject, optns);
    }
};
jCanvaScript.Proto.Layer.prototype.clone = function(idLayer, params) {
    var clone = jCanvaScript.layer(idLayer);
    take(clone, this);
    take(clone.optns.transformMatrix, this.optns.transformMatrix);
    take(clone.optns.translateMatrix, this.optns.translateMatrix);
    take(clone.optns.scaleMatrix, this.optns.scaleMatrix);
    take(clone.optns.rotateMatrix, this.optns.rotateMatrix);
    clone.canvas(this.canvas().optns.id);
    if (params === undefined) return clone;
    return clone.animate(params);
};
jCanvaScript.Proto.Layer.prototype.isPointIn = function(x, y, global) {
    var objs = this.objs,i;
    for (i = 0; i < objs.length; i++)
        if (objs[i].isPointIn(x, y, global))
            return true;
    return false;
};
jCanvaScript.Proto.Layer.prototype.opacity = function(n) {
    var objs = this.objs;
    for (var i = 0; i < objs.length; i++)
        objs[i].attr('opacity', n);
    return this;
};
jCanvaScript.Proto.Layer.prototype.fadeTo = function(val, duration, easing, onstep, fn) {
    if (duration === undefined)duration = 600;
    var objs = this.objs;
    for (var i = 0; i < objs.length; i++)
        objs[i].animate({opacity:val}, duration, easing, onstep, fn);
    return this;
};
jCanvaScript.Proto.Layer.prototype.draw = function(canvasOptns) {
    var optns = this.optns,
        bufOptns = optns.buffer,
        ctx = canvasOptns.ctx;
    if (bufOptns.val) {
        ctx.drawImage(bufOptns.cnv, bufOptns.x, bufOptns.y);
        return this;
    }
    for (var i = 0; i < this.grdntsnptrns.length; i++)
        this.grdntsnptrns[i].draw(canvasOptns);
    if (optns.anyObjLevelChanged) {
        levelChanger(this.objs);
        optns.anyObjLevelChanged = false;
    }
    if (optns.anyObjDeleted) {
        objDeleter(this.objs);
        optns.anyObjDeleted = false;
    }
    ctx.globalCompositeOperation = optns.gCO;
    for (i = 0; i < this.objs.length; i++) {
        var object = this.objs[i];
        if (typeof (object.draw) == 'function') {
            this.setOptns(ctx);
            if (object.beforeDraw(canvasOptns)) {
                if (typeof (object.draw) == 'function') {
                    var objBufOptns = object.optns.buffer;
                    if (objBufOptns.val)
                        ctx.drawImage(objBufOptns.cnv, objBufOptns.x, objBufOptns.y);
                    else
                        object.draw(ctx);
                    if (bufOptns.optns)
                        object.afterDraw(bufOptns.optns);
                    else
                        object.afterDraw(canvasOptns);
                }
            }
        }
    }
    return this;
};
jCanvaScript.Proto.Layer.prototype.objects = function(map) {
        var myGroup = group(),i = 0;
        while (this.objs[i] !== undefined)
            myGroup.elements[i] = this.objs[i++];
        if (map !== undefined)
            return myGroup.find(map);
        return myGroup;
    };
jCanvaScript.layer = function(idLayer) {
    if (idLayer === undefined)return canvases[0].layers[0];
    for (var i = 0; i < canvases.length; i++) {
        var layersArray = canvases[i].layers;
        for (var j = 0; j < layersArray.length; j++)
            if (layersArray[j].optns.id == idLayer)
                return layersArray[j];
    }
    return new jCanvaScript.Proto.Layer(idLayer);
};

window.jCanvaScript=window.jc=jCanvaScript;})(window, undefined);


jCanvaScript.animateFunctions = {
    linear:function(progress, params) {
        return progress;
    },
    exp:function(progress, params) {
        var n = params.n || 2;
        return Math.pow(progress, n);
    },
    circ:function(progress, params) {
        return 1 - Math.sqrt(1 - progress * progress);
    },
    sine:function(progress, params) {
        return 1 - Math.sin((1 - progress) * Math.PI / 2);
    },
    back:function(progress, params) {
        var n = params.n || 2;
        var x = params.x || 1.5;
        return Math.pow(progress, n) * ((x + 1) * progress - x);
    },
    elastic:function(progress, params) {
        var n = params.n || 2;
        var m = params.m || 20;
        var k = params.k || 3;
        var x = params.x || 1.5;
        return Math.pow(n, 10 * (progress - 1)) * Math.cos(m * progress * Math.PI * x / k);
    },
    bounce:function(progress, params) {
        var n = params.n || 4;
        var b = params.b || 0.25;
        var sum = [1];
        for (var i = 1; i < n; i++) sum[i] = sum[i - 1] + Math.pow(b, i / 2);
        var x = 2 * sum[n - 1] - 1;
        for (i = 0; i < n; i++) {
            if (x * progress >= (i > 0 ? 2 * sum[i - 1] - 1 : 0) && x * progress <= 2 * sum[i] - 1)
                return Math.pow(x * (progress - (2 * sum[i] - 1 - Math.pow(b, i / 2)) / x), 2) + 1 - Math.pow(b, i);
        }
        return 1;
    }
}

jCanvaScript.addAnimateFunction = function(name, fn) {
    jCanvaScript.animateFunctions[name] = fn;
    return this;
};

jCanvaScript._helpers = {};
jCanvaScript._helpers.updateColor = function (object, color, prefix)
{
	if(color.notColor===undefined)
		color.val='rgba('+parseInt(object['_'+prefix+'ColorR'])+','+parseInt(object['_'+prefix+'ColorG'])+','+parseInt(object['_'+prefix+'ColorB'])+','+parseInt(object['_'+prefix+'ColorA']*100)/100+')';
	else
	{
		var notColor=color.notColor;
		var notColorLayer=jCanvaScript.canvases[notColor.canvas].layers[notColor.layer];
		if(notColorLayer.grdntsnptrns[notColor.level]!==undefined){color.val=notColorLayer.grdntsnptrns[notColor.level].val;}
	}
	return color;
}
jCanvaScript._helpers.animating = function(canvasOptions)
{
	var timeDiff=canvasOptions.timeDiff,
		progress=1;
	for(var q=0;q<this.animateQueue.length;q++)
	{
		var queue=this.animateQueue[q],
			duration=queue['duration'],
			easing=queue['easing'],
			step=queue.step,
			onstep=queue['onstep'],
			easingIn=easing['type']=='in' || (easing['type']=='inOut' && progress<0.5),
			easingOut=easing['type']=='out' || (easing['type']=='inOut' && progress>0.5);
			queue['step']+=timeDiff;
			progress=step/duration;
		for(var key in queue)
		{
			if(this[key]!==undefined && queue[key])
			{
				var property=queue[key],
					to=property['to'],
					from=property['from'];
				jCanvaScript._helpers.animateTransforms(key,this,queue);
				if(easingIn)this[key]=(to-from)*jCanvaScript.animateFunctions[easing['fn']](progress,easing)+from;
				if(easingOut)this[key]=(to-from)*(1-jCanvaScript.animateFunctions[easing['fn']](1-progress,easing))+from;
				if(onstep)onstep.fn.call(this,onstep);
				if(step>=duration)
				{
					this[key]=to;
					jCanvaScript._helpers.animateTransforms(key,this,queue);
					queue[key]=false;
					queue.animateKeyCount--;
					if(!queue.animateKeyCount)
					{
						if(queue.animateFn)queue.animateFn.apply(this);
						this.animateQueue.splice(q,1);
						q--;
					}
				}
			}
		}
	}
	if (this.animateQueue.length)this.redraw();
	else this.optns.animated=false;
	return this;
}
jCanvaScript._helpers.animateTransforms = function(key,object,queue)
{
	var val=object[key];
	var prev=queue[key]['prev'];
	switch(key)
	{
		case '_rotateAngle':
			object.rotate(val-prev,object._rotateX,object._rotateY);
			break;
		case '_translateX':
			object.translate(val-prev,0);
			break;
		case '_translateY':
			object.translate(0,val-prev);
			break;
		case '_translateToX':
			object.translateTo(val,undefined);
			break;
		case '_translateToY':
			object.translateTo(undefined,val);
			break;
		case '_scaleX':
			if(!prev)prev=1;
			object.scale(val/prev,1);
			break;
		case '_scaleY':
			if(!prev)prev=1;
			object.scale(1,val/prev);
			break;
		default:
			return;
	}
	queue[key]['prev']=val;
}

jCanvaScript._helpers.getRect = function(object, rect, type)
{
	if(type == 'poor')return rect;
	var
        min = {x: rect.x, y: rect.y},
        max = {x: rect.x + rect.width,
               y: rect.y + rect.height},
        m = jCanvaScript.Matrix.multiplyMatrixAndMatrix(object.matrix(), object.layer().matrix()),
        lt = jCanvaScript.Matrix.multiplyPointMatrix(min.x, min.y, m),
        rt = jCanvaScript.Matrix.multiplyPointMatrix(max.x, min.y, m),
        lb = jCanvaScript.Matrix.multiplyPointMatrix(min.x, max.y, m),
        rb = jCanvaScript.Matrix.multiplyPointMatrix(max.x, max.y, m),
        coordinates = [
            [lt.x, lt.y], [rt.x, rt.y],
            [lb.x, lb.y], [rb.x, rb.y]
        ];
	if(type == 'coords')return coordinates;
	var minX, minY,
	    maxX = minX = lt.x,
	    maxY = minY = lt.y;
	for(var i = 0; i < 4; i++)
	{
		if(maxX < coordinates[i][0])maxX = coordinates[i][0];
		if(maxY < coordinates[i][1])maxY = coordinates[i][1];
		if(minX > coordinates[i][0])minX = coordinates[i][0];
		if(minY > coordinates[i][1])minY = coordinates[i][1];
	}
	return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
}

jCanvaScript._helpers.getCenter = function(object, point, type)
{
	if(type=='poor') return point;
	return jCanvaScript.Matrix.multiplyPointMatrix(point.x, point.y, jCanvaScript.Matrix.multiplyMatrixAndMatrix(object.matrix(), object.layer().matrix()));
}


jCanvaScript.imageDataFilters = {
    color:{
        fn: function(width, height, matrix, type) {
            var old,i,j;
            matrix = matrix[type];
            for (i = 0; i < width; i++)
                for (j = 0; j < height; j++) {
                    old = this.getPixel(i, j);
                    old[matrix[0]] = old[matrix[0]] * 2 - old[matrix[1]] - old[matrix[2]];
                    old[matrix[1]] = 0;
                    old[matrix[2]] = 0;
                    old[matrix[0]] = old[matrix[0]] > 255 ? 255 : old[matrix[0]];
                    this.setPixel(i, j, old);
                }
        },
        matrix:
        {
            red:[0,1,2],
            green:[1,0,2],
            blue:[2,0,1]
        }
    },
    linear:{
        fn:function(width, height, matrix, type) {
            var newMatrix = [],old,i,j,k,m,n;
            matrix = matrix[type];
            m = matrix.length;
            n = matrix[0].length;
            for (i = 0; i < width; i++) {
                newMatrix[i] = [];
                for (j = 0; j < height; j++) {
                    newMatrix[i][j] = [0,0,0,1];
                    for (m = 0; m < 3; m++)
                        for (n = 0; n < 3; n++) {
                            old = this.getPixel(i - parseInt(m / 2), j - parseInt(n / 2));
                            for (k = 0; k < 3; k++) {
                                newMatrix[i][j][k] += old[k] * matrix[m][n];
                            }
                        }
                }
            }
            for (i = 0; i < width; i++) {
                for (j = 0; j < height; j++)
                    this.setPixel(i, j, newMatrix[i][j]);
            }
        },
        matrix:{
            sharp:[
                [-0.375,-0.375,-0.375],
                [-0.375,4,-0.375],
                [-0.375,-0.375,-0.375]
            ],
            blur:[
                [0.111,0.111,0.111],
                [0.111,0.111,0.111],
                [0.111,0.111,0.111]
            ]
        }
    }
};

jCanvaScript.addImageDataFilter = function(name, properties) {
    if (jCanvaScript.imageDataFilters[name] === undefined)jCanvaScript.imageDataFilters[name] = {};
    if (properties.fn !== undefined)jCanvaScript.imageDataFilters[name].fn = properties.fn;
    if (properties.matrix !== undefined && properties.type === undefined)jCanvaScript.imageDataFilters[name].matrix = properties.matrix;
    if (properties.type !== undefined)jCanvaScript.imageDataFilters[name].matrix[type] = properties.matrix;
    return jCanvaScript;
};

jCanvaScript.Matrix = {
    multiplyMatrixAndMatrix: function(m1, m2)
    {
        return [
            [(m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0]), (m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1]), (m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2])],
            [(m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0]), (m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1]), (m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2])]
        ];
    },
    multiplyMatrix: function(){
        var result = arguments[0];
        for(var i = 1; i< arguments.length; i++){
            result = this.multiplyMatrixAndMatrix(result, arguments[i]);
        }
        return result;
    },
    multiplyPointMatrix: function(x, y, matrix)
    {
        return {
            x: (x * matrix[0][0] + y * matrix[0][1] + matrix[0][2]),
            y: (x * matrix[1][0] + y * matrix[1][1] + matrix[1][2])
        }
    },
    transformPoint: function(x, y, matrix)
    {
        return{
            x: (x * matrix[1][1] - y * matrix[0][1] + matrix[0][1] * matrix[1][2] - matrix[1][1] * matrix[0][2]) / (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]),
            y: (y * matrix[0][0] - x * matrix[1][0] - matrix[0][0] * matrix[1][2] + matrix[1][0] * matrix[0][2]) / (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1])
        }
    }
}


jCanvaScript.parseColor = function(color)
{
	var colorKeeper={
		color:{
			val:color,
			notColor:undefined
		},
		r:0,
		g:0,
		b:0,
		a:1};
	if(color.id!==undefined)
	{
		colorKeeper.color.notColor = {
            level:color._level,
            canvas:color.optns.canvas.number,
            layer:color.optns.layer.number
        };
		return colorKeeper;
	}
	if(color.r!==undefined)
	{
		colorKeeper=checkDefaults(color,{r:0,g:0,b:0,a:1});
		colorKeeper.color = {
            val:'rgba(' + colorKeeper.r + ',' + colorKeeper.g + ',' + colorKeeper.b + ',' + colorKeeper.a + ')',
            notColor:undefined
        };
		return colorKeeper;
	}
	if(color.charAt(0)=='#')
	{
		colorKeeper.r=parseInt(color.substr(1,2),16);
		colorKeeper.g=parseInt(color.substr(3,2),16);
		colorKeeper.b=parseInt(color.substr(5,2),16);
	}
	else
	{
		var arr=color.split(',');
		if(arr.length==4)
		{
			var colorR = arr[0].split('(');
			var alpha = arr[3].split(')');
			colorKeeper.r=parseInt(colorR[1]);
			colorKeeper.g=parseInt(arr[1]);
			colorKeeper.b=parseInt(arr[2]);
			colorKeeper.a=parseFloat(alpha[0]);
		}
		if(arr.length==3)
		{
			colorR = arr[0].split('(');
			var colorB = arr[2].split(')');
			colorKeeper.r=parseInt(colorR[1]);
			colorKeeper.g=parseInt(arr[1]);
			colorKeeper.b=parseInt(colorB[0]);
		}
	}
	colorKeeper.color.notColor = undefined;
	return colorKeeper;
}

jCanvaScript.constants = {
    PIx2: Math.PI * 2,
    radian: 180 / Math.PI,
    regNumsWithMeasure: /\d.\w\w/
};

jCanvaScript.clear = function(idCanvas) {
    if (jCanvaScript.canvases[0] === undefined)return jCanvaScript;
    if (idCanvas === undefined) {
        jCanvaScript.canvases[0].clear();
        return jCanvaScript;
    }
    jCanvaScript.canvas(idCanvas).clear();
    return jCanvaScript;
};

jCanvaScript.pause = function(idCanvas) {
    if (idCanvas === undefined) {
        jCanvaScript.canvases[0].pause();
        return jCanvaScript;
    }
    jCanvaScript.canvas(idCanvas).pause();
    return jCanvaScript;
};

jCanvaScript.start = function(idCanvas, isAnimated) {
    jCanvaScript.canvas(idCanvas).start(isAnimated);
    return jCanvaScript;
};

jCanvaScript.checkDefaults = function(check, def)
{
	for(var key in def)
	{
		if(check[key] === undefined)check[key] = def[key];
	}
	return check;
}


jCanvaScript.Proto.Shape = function(options) {
    this._fillColorR = 0;
    this._fillColorG = 0;
    this._fillColorB = 0;
    this._fillColorA = 0;
    this._lineColorR = 0;
    this._lineColorG = 0;
    this._lineColorB = 0;
    this._lineColorA = 0;
    this._lineWidth = 1;
    this._cap = 'butt';
    this._join = 'miter';
    this._miterLimit = 1;
    if (options === undefined)options = {};
    if(options.color !== undefined){
        options.lineColor = options.fillColor = options.color;
    }
    if(options.lineColor !== undefined){
        if(options.lineColor === 0 || options.lineColor === false || options.lineColor === 1 || options.lineColor === true){
            options.fillColor = options.lineColor;
            options.lineColor = '#000000';
        }
    }
    if(options.fillColor !== undefined){
        if(options.fillColor === 0 || options.fillColor === false){
            options.fillColor = undefined;
        }
        if(options.fillColor === 1 || options.fillColor === true){
            options.fillColor = options.lineColor;
        }
    }
    options = jCanvaScript.checkDefaults(options, {fillColor:'rgba(0,0,0,0)',lineColor:'rgba(0,0,0,0)'});
    jCanvaScript.Proto.Object.call(this,options);
    this.optns.fillColor = {val:options.fillColor,notColor:undefined};
    this.optns.lineColor = {val:options.lineColor,notColor:undefined};
    this.fillColor(options.fillColor);
    this.lineColor(options.lineColor);
    return this;
}
jCanvaScript.Proto.Shape.prototype = Object.create(jCanvaScript.Proto.Object.prototype);

jCanvaScript.Proto.Shape.prototype.fillColor = function(color) {
    if (color === undefined)return [this._fillColorR,this._fillColorG,this._fillColorB,this._fillColorA];
    return this.attr('fillColor', color);
};
jCanvaScript.Proto.Shape.prototype.lineColor = function(color) {
    if (color === undefined)return [this._lineColorR,this._lineColorG,this._lineColorB,this._lineColorA];
    return this.attr('lineColor', color);
};
jCanvaScript.Proto.Shape.prototype.color = function(color){
    if(color === undefined) return {
        fillColor: this.fillColor(),
        lineColor: this.lineColor()
    }
    this.fillColor(color);
    this.lineColor(color);
    return this;
};
jCanvaScript.Proto.Shape.prototype.lineStyle = function(options) {
    return this.attr(options);
};
jCanvaScript.Proto.Shape.prototype.setOptns = function(ctx) {
    jCanvaScript.Proto.Object.prototype.setOptns.call(this, ctx);
    ctx.lineWidth = this._lineWidth;
    ctx.lineCap = this._cap;
    ctx.lineJoin = this._join;
    ctx.miterLimit = this._miterLimit;
    var fillColor = jCanvaScript._helpers.updateColor(this, this.optns.fillColor, 'fill');
    var lineColor = jCanvaScript._helpers.updateColor(this, this.optns.lineColor, 'line');
    ctx.fillStyle = fillColor.val;
    ctx.strokeStyle = lineColor.val;
};
jCanvaScript.Proto.Shape.prototype.afterDraw = function(optns) {
    optns.ctx.stroke();
    optns.ctx.fill();
    jCanvaScript.Proto.Object.prototype.afterDraw.call(this, optns);
};


jCanvaScript.Proto.Arc = function(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor){
    var options = x;
    if (anticlockwise !== undefined) {
        if (anticlockwise.charAt) {
            fillColor = lineColor;
            lineColor = anticlockwise;
            anticlockwise = true;
        }
    }
    if (typeof options != 'object')
        options = {x:x, y:y, radius:radius, startAngle:startAngle, endAngle:endAngle, anticlockwise:anticlockwise, lineColor:lineColor, fillColor:fillColor};
    options = jCanvaScript.checkDefaults(options, {radius:0, startAngle:0, endAngle:0, anticlockwise:true});
    jCanvaScript.Proto.Shape.call(this, options);
    this._radius = options.radius;
    this._startAngle = options.startAngle;
    this._endAngle = options.endAngle;
    this._anticlockwise = options.anticlockwise;
    this._proto='Arc';
    return this;
};

jCanvaScript.Proto.Arc.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);

jCanvaScript.Proto.Arc.prototype.draw = function(ctx) {
    var radian = jCanvaScript.constants.radian;
    ctx.arc(this._x, this._y, this._radius, this._startAngle / radian, this._endAngle / radian, this._anticlockwise);
};

jCanvaScript.Proto.Arc.prototype.getRect = function(type) {
    var
        radian = jCanvaScript.constants.radian,
        points = {x:this._x, y:this._y},
        startAngle = this._startAngle, endAngle = this._endAngle, radius = this._radius,
        startY = Math.floor(Math.sin(startAngle / radian) * radius), startX = Math.floor(Math.cos(startAngle / radian) * radius),
        endY = Math.floor(Math.sin(endAngle / radian) * radius), endX = Math.floor(Math.cos(endAngle / radian) * radius),
        positiveXs = startX > 0 && endX > 0, negtiveXs = startX < 0 && endX < 0,
        positiveYs = startY > 0 && endY > 0,negtiveYs = startY < 0 && endY < 0;

    points.width = points.height = radius;

    if ((this._anticlockwise && startAngle < endAngle) || (!this._anticlockwise && startAngle > endAngle)) {
        if (((negtiveXs || (positiveXs && (negtiveYs || positiveYs)))) || (startX == 0 && endX == 0)) {
            points.y -= radius;
            points.height += radius;
        }
        else {
            if (positiveXs && endY < 0 && startY > 0) {
                points.y += endY;
                points.height += endY;
            }
            else
            if (endX > 0 && endY < 0 && startX < 0) {
                points.y += Math.min(endY, startY);
                points.height -= Math.min(endY, startY);
            }
            else {
                if (negtiveYs)points.y -= Math.max(endY, startY);
                else points.y -= radius;
                points.height += Math.max(endY, startY);
            }
        }
        if (((positiveYs || (negtiveYs && (negtiveXs || positiveXs) ))) || (startY == 0 && endY == 0)) {
            points.x -= radius;
            points.width += radius;
        }
        else {
            if (endY < 0 && startY > 0) {
                points.x += Math.min(endX, startX);
                points.width -= Math.min(endX, startX);
            }
            else {
                if (negtiveXs)points.x -= Math.max(endX, startX);
                else points.x -= radius;
                points.width += Math.max(endX, startX);
            }
        }
    }
    else {
        positiveXs = startX >= 0 && endX >= 0;
        positiveYs = startY >= 0 && endY >= 0;
        negtiveXs = startX <= 0 && endX <= 0;
        negtiveYs = startY <= 0 && endY <= 0;
        if (negtiveYs && positiveXs) {
            points.x += Math.min(endX, startX);
            points.width -= Math.min(endX, startX);
            points.y += Math.min(endY, startY);
            points.height += Math.max(endY, startY);
        }
        else if (negtiveYs && negtiveXs) {
            points.x += Math.min(endX, startX);
            points.width += Math.max(endX, startX);
            points.y += Math.min(endY, startY);
            points.height += Math.max(endY, startY);
        }
        else if (negtiveYs) {
            points.x += Math.min(endX, startX);
            points.width += Math.max(endX, startX);
            points.y -= radius;
            points.height += Math.max(endY, startY);
        }
        else if (positiveXs && positiveYs) {
            points.x += Math.min(endX, startX);
            points.width = Math.abs(endX - startX);
            points.y += Math.min(endY, startY);
            points.height -= Math.min(endY, startY);
        }
        else if (positiveYs) {
            points.x += Math.min(endX, startX);
            points.width = Math.abs(endX) + Math.abs(startX);
            points.y += Math.min(endY, startY);
            points.height -= Math.min(endY, startY);
        }
        else if (negtiveXs) {
            points.x -= radius;
            points.width += Math.max(endX, startX);
            points.y -= radius;
            points.height += Math.max(endY, startY);
        }
        else if (positiveXs) {
            points.x -= radius;
            points.width += Math.max(endX, startX);
            points.y -= radius;
            points.height += radius;
        }
    }
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.arc = function(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor) {
    return new jCanvaScript.Proto.Arc(x, y, radius, startAngle, endAngle, anticlockwise, lineColor, fillColor);
}

jCanvaScript.Proto.Circle = function(x, y, radius, lineColor, fillColor) {
    var options = x;
    if (typeof options != 'object')
        options = {x:x, y:y, radius:radius, lineColor:lineColor, fillColor:fillColor};
    options = jCanvaScript.checkDefaults(options, {radius:0});
    jCanvaScript.Proto.Shape.call(this, options);
    this._radius = options.radius;
    this._proto = 'Circle';
    return this;
};

jCanvaScript.Proto.Circle.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);

jCanvaScript.Proto.Circle.prototype.draw = function(ctx) {
    ctx.arc(this._x, this._y, this._radius, 0, jCanvaScript.constants.PIx2, true);
};

jCanvaScript.Proto.Circle.prototype.getRect = function(type) {
    var points = {x:this._x - this._radius, y:this._y - this._radius};
    points.width = points.height = this._radius * 2;
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.Proto.Circle.prototype.getCenter = function(type){
    return jCanvaScript._helpers.getCenter(this, {x:this._x, y:this._y}, type);
}

jCanvaScript.circle = function(x, y, radius, lineColor, fillColor){
    return new jCanvaScript.Proto.Circle(x, y, radius, lineColor, fillColor);
}

/*jCanvaScript.addObject('ellipse',function(){
	this.draw=function(ctx)
	{
		 var kappa = .5522848,
		 ox = width / 2 * kappa, // control point offset horiz
		 oy = height / 2 * kappa, // control point offset vert
		 xe = x + width, // x end
		 ye = y + height, // y end
		 xm = x + width / 2, // x middle
		 ym = y + height / 2; // y middle
		 ctx.moveTo(this._x0,this._y0);
		 ctx.push([xm, y, x, ym - oy, xm - ox, y]);
		 points.push([xe, ym, xm + ox, y, xe, ym - oy]);
		 points.push([xm, ye, xe, ym + oy, xm + ox, ye]);
		 points.push([x, ym, xm - ox, ye, x, ym + oy]);
		 points.push([xm, y, x, ym - oy, xm - ox, y]);
		 ellipse.base(points,color,fill);
	}
});*/

jCanvaScript.Proto.Rect = function(x, y, width, height, lineColor, fillColor) {
    var options = x;
    if (typeof options != 'object')
        options = {x:x, y:y, width:width, height:height, lineColor:lineColor, fillColor:fillColor};
    options = jCanvaScript.checkDefaults(options, {width:0, height:0});
    jCanvaScript.Proto.Shape.call(this, options);
    this._width = options.width;
    this._height = options.height;
    this._proto = 'Rect';
    return this;
};

jCanvaScript.Proto.Rect.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);

jCanvaScript.Proto.Rect.prototype.draw = function(ctx) {
    ctx.rect(this._x, this._y, this._width, this._height);
};

jCanvaScript.Proto.Rect.prototype.getRect = function(type) {
    return jCanvaScript._helpers.getRect(this, {x:this._x, y:this._y, width:this._width, height:this._height}, type);
};

jCanvaScript.rect = function(x, y, width, height, lineColor, fillColor) {
    return new jCanvaScript.Proto.Rect(x, y, width, height, lineColor, fillColor);
}

jCanvaScript.Proto.Text = function(string, x, y, maxWidth, lineColor, fillColor) {
    var options = string;
    if (maxWidth !== undefined) {
        if (maxWidth.charAt) {
            fillColor = lineColor;
            lineColor = maxWidth;
            maxWidth = false;
        }
    }
    if (typeof options != 'object')
        options = {string:string, x:x, y:y, maxWidth:maxWidth, lineColor:lineColor, fillColor:fillColor};
    options = jCanvaScript.checkDefaults(options, {string:'', maxWidth:false});
    jCanvaScript.Proto.Shape.call(this,options);
    this._string = options.string;
    this._maxWidth = options.maxWidth;
    this._font = "10px sans-serif";
    this._align = "start";
    this._baseline = "alphabetic";
    this._proto='Text';
    return this;
};

jCanvaScript.Proto.Text.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);

jCanvaScript.Proto.Text.prototype.setOptns = function(ctx) {
    jCanvaScript.Proto.Shape.prototype.setOptns.call(this, ctx);
    ctx.textBaseline = this._baseline;
    ctx.font = this._font;
    ctx.textAlign = this._align;
    return this;
};

jCanvaScript.Proto.Text.prototype.draw = function(ctx) {
    if (this._maxWidth === false) {
        if (this._fillColorA)ctx.fillText(this._string, this._x, this._y);
        if (this._lineColorA)ctx.strokeText(this._string, this._x, this._y);
    }
    else {
        if (this._fillColorA) ctx.fillText(this._string, this._x, this._y, this._maxWidth);
        if (this._lineColorA) ctx.strokeText(this._string, this._x, this._y, this._maxWidth);
    }
};

jCanvaScript.Proto.Text.prototype.getRect = function(type) {
    var
        points = {x:this._x, y:this._y},
        ctx = this.canvas().optns.ctx;
    points.height = parseInt(this._font.match(jCanvaScript.constants.regNumsWithMeasure)[0]);
    points.y -= points.height;
    ctx.save();
    ctx.textBaseline = this._baseline;
    ctx.font = this._font;
    ctx.textAlign = this._align;
    points.width = ctx.measureText(this._string).width;
    if (this._align == 'center')points.x -= points.width / 2;
    if (this._align == 'right')points.x -= points.width;
    ctx.restore();
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.Proto.Text.prototype.position = function() {
    var points = {x:this._x, y:this._y},
        ctx = this.canvas().optns.ctx;
    points.height = parseInt(this._font.match(jCanvaScript.constants.regNumsWithMeasure)[0]);
    points.y -= points.height;
    ctx.save();
    ctx.textBaseline = this._baseline;
    ctx.font = this._font;
    ctx.textAlign = this._align;
    points.width = ctx.measureText(this._string).width;
    ctx.restore();
    return jCanvaScript._helpers.getRect(this, points);
};

jCanvaScript.Proto.Text.prototype.font = function(font) {
    return this.attr('font', font);
};

jCanvaScript.Proto.Text.prototype.align = function(align) {
    return this.attr('align', align);
};

jCanvaScript.Proto.Text.prototype.baseline = function(baseline) {
    return this.attr('baseline', baseline);
};

jCanvaScript.Proto.Text.prototype.string = function(string) {
    return this.attr('string', string);
};

jCanvaScript.text = function(string, x, y, maxWidth, lineColor, fillColor) {
    return new jCanvaScript.Proto.Text(string, x, y, maxWidth, lineColor, fillColor);
}


jCanvaScript.Proto.Image = function(image, x, y, width, height, sx, sy, swidth, sheight) {
    var options = image;
    if (typeof image != 'object' || image.src !== undefined)
        options = {image:image, x:x, y:y, width:width, height:height, sx:sx, sy:sy, swidth:swidth, sheight:sheight};
    options = jCanvaScript.checkDefaults(options, {width:false, height:false, sx:0, sy:0, swidth:false, sheight:false});
    if (options.width === false) {
        options.width = options.image.width;
        options.height = options.image.height;
    }
    if (options.swidth === false) {
        options.swidth = options.image.width;
        options.sheight = options.image.height;
    }
    jCanvaScript.Proto.Object.call(this, options);
    this._img = options.image;
    this._width = options.width;
    this._height = options.height;
    this._sx = options.sx;
    this._sy = options.sy;
    this._swidth = options.swidth;
    this._sheight = options.sheight;
    this._proto = 'Image';
    return this;
};

jCanvaScript.Proto.Image.prototype = Object.create(jCanvaScript.Proto.Object.prototype)

jCanvaScript.Proto.Image.prototype.draw = function(ctx) {
    ctx.drawImage(this._img, this._sx, this._sy, this._swidth, this._sheight, this._x, this._y, this._width, this._height);
};

jCanvaScript.Proto.Image.prototype.getRect = function(type) {
    var points = {x:this._x, y:this._y, width:this._width, height:this._height};
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.image = function(image, x, y, width, height, sx, sy, swidth, sheight){
    return new jCanvaScript.Proto.Image(image, x, y, width, height, sx, sy, swidth, sheight);
}

jCanvaScript.Proto.ImageData = function(width, height) {
    jCanvaScript.Proto.Object.call(this)
    this._getX = 0;
    this._getY = 0;
    this._putData = false;
    if (width === undefined) width={};
    if (height === undefined) {
        var oldImageData = width;
        if(oldImageData._width !== undefined) {
            width = {
                width: oldImageData._width,
                height: oldImageData._height
            }
        }
        width = jCanvaScript.checkDefaults(width, {width:0, height:0});
        height = width.height;
        width = width.width;
    }
    this._width = width;
    this._height = height;
    this._data = [];
    for (var i = 0; i < this._width; i++)
        for (var j = 0; j < this._height; j++) {
            var index = (i + j * this._width) * 4;
            this._data[index + 0] = 0;
            this._data[index + 1] = 0;
            this._data[index + 2] = 0;
            this._data[index + 3] = 0;
        }
    this._proto = 'ImageData';
    return this;
};

jCanvaScript.Proto.ImageData.prototype = Object.create(jCanvaScript.Proto.Object.prototype)

jCanvaScript.Proto.ImageData.prototype.draw = function(ctx) {
    if (this._imgData === undefined) {
        this._imgData = ctx.createImageData(this._width, this._height);
        for (var i = 0; i < this._width * this._height * 4; i++)
            this._imgData.data[i] = this._data[i];
        this._data = this._imgData.data;
    }
    if (this._putData)
        ctx.putImageData(this._imgData, this._x, this._y);
};

jCanvaScript.Proto.ImageData.prototype.getRect = function(type) {
    var points = {x:this._x, y:this._y, width:this._width, height:this._height};
    return jCanvaScript._helpers.getRect(this, points, type);
};

jCanvaScript.Proto.ImageData.prototype.setPixel = function(x, y, color) {
    var
        colorKeeper,
        index = (x + y * this._width) * 4;
    if (color.r !== undefined) colorKeeper = color;
    else if (color[0] !== undefined)
        if (!color.charAt) colorKeeper = {r:color[0], g:color[1], b:color[2], a:color[3]};
        else colorKeeper = jCanvaScript.parseColor(color);
    this._data[index + 0] = colorKeeper.r;
    this._data[index + 1] = colorKeeper.g;
    this._data[index + 2] = colorKeeper.b;
    this._data[index + 3] = colorKeeper.a * 255;
    this.redraw();
    return this;
};

jCanvaScript.Proto.ImageData.prototype.getPixel = function(x, y) {
    var index = (x + y * this._width) * 4;
    return [this._data[index + 0], this._data[index + 1], this._data[index + 2], this._data[index + 3] / 255];
};

jCanvaScript.Proto.ImageData.prototype.getData = function(x, y, width, height) {
    this._getX = x;
    this._getY = y;
    this._width = width;
    this._height = height;
    var ctx = this.canvas().optns.ctx;
    try {
        this._imgData = ctx.getImageData(this._getX, this._getY, this._width, this._height);
    } catch(e) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        this._imgData = ctx.getImageData(this._getX, this._getY, this._width, this._height);
    }
    this._data = this._imgData.data;
    this.redraw();
    return this;
};

jCanvaScript.Proto.ImageData.prototype.putData = function(x, y) {
    if (x !== undefined)this._x = x;
    if (y !== undefined)this._y = y;
    this._putData = true;
    this.redraw();
    return this;
};

jCanvaScript.Proto.ImageData.prototype.clone = function() {
    var clone = jCanvaScript.Proto.Object.prototype.clone.call(this);
    clone._imgData = undefined;
    return clone;
};

jCanvaScript.Proto.ImageData.prototype.filter = function(filterName, filterType) {
    var filter = jCanvaScript.imageDataFilters[filterName];
    filter.fn.call(this, this._width, this._height, filter.matrix, filterType);
    return this;
};

jCanvaScript.imageData = function(width, height){
    return new jCanvaScript.Proto.ImageData(width, height);
}


jCanvaScript.Proto.Lines = function(points, lineColor, fillColor) {
    var options = points;
    if (options !== undefined) {
        if (typeof options.pop == 'function')
            options = {points: points, lineColor: lineColor, fillColor: fillColor};
        this.shapesCount = 0;
    }
    jCanvaScript.Proto.Shape.call(this,options);
    if (options.points !== undefined)
        this.points(options.points);
    return this;
};
jCanvaScript.Proto.Lines.prototype = Object.create(jCanvaScript.Proto.Shape.prototype);
jCanvaScript.Proto.Lines.prototype.getCenter = function(type) {
    var point = {
        x: this._x0,
        y: this._y0
    };
    for (var i = 1; i < this.shapesCount; i++) {
        point.x += this['_x' + i];
        point.y += this['_y' + i];
    }
    point.x = point.x / this.shapesCount;
    point.y = point.y / this.shapesCount;
    return jCanvaScript._helpers.getCenter(this, point, type);
};
jCanvaScript.Proto.Lines.prototype.position = function() {
    return jCanvaScript.multiplyPointM(this._x0, this._y0, jCanvaScript.multiplyM(this.matrix(), this.layer().matrix()));
};
jCanvaScript.Proto.Lines.prototype.getRect = function(type) {
    var
        minX,
        minY,
        maxX = minX = this._x0,
        maxY = minY = this._y0,
        points;
    for (var i = 1; i < this.shapesCount; i++) {
        if (maxX < this['_x' + i]) maxX = this['_x' + i];
        if (maxY < this['_y' + i]) maxY = this['_y' + i];
        if (minX > this['_x' + i]) minX = this['_x' + i];
        if (minY > this['_y' + i]) minY = this['_y' + i];
    }
    points = {x: minX, y:minY, width: maxX - minX, height: maxY - minY};
    return jCanvaScript._helpers.getRect(this, points, type);
};
jCanvaScript.Proto.Lines.prototype.addPoint = function() {
    this.redraw();
    var names = this._pointNames;
    for (var i = 0; i < names.length; i++)
        this[names[i] + this.shapesCount] = arguments[i];
    this.shapesCount++;
    return this;
};
jCanvaScript.Proto.Lines.prototype.delPoint = function(x, y, radius) {
    this.redraw();
    if (y === undefined) {
        var points = this.points();
        points.splice(x, 1);
        this.points(points);
    }
    else {
        radius = radius || 0;
        for (var j = 0; j < this.shapesCount; j++)
            if (this['_x' + j] < x + radius && this['_x' + j] > x - radius && this['_y' + j] < y + radius && this['_y' + j] < y + radius) {
                this.delPoint(j);
                j--;
            }
    }
    return this;
};
jCanvaScript.Proto.Lines.prototype.points = function(points) {
    var names = this._pointNames;
    if (points === undefined) {
        points = [];
        for (var j = 0; j < this.shapesCount; j++) {
            points[j] = [];
            for (var i = 0; i < names.length; i++)
                points[j][i] = this[names[i] + j];
        }
        return points;
    }
    this.redraw();
    var oldCount = this.shapesCount;
    this.shapesCount = points.length;
    for (j = 0; j < this.shapesCount; j++)
        for (i = 0; i < names.length; i++)
            this[names[i] + j] = points[j][i];
    for (j = this.shapesCount; j < oldCount; j++)
        for (i = 0; i < names.length; i++)
            this[names[i] + j] = undefined;
    return this;
}

jCanvaScript.Proto.BCurve = function(points, lineColor, fillColor) {
    this._pointNames = ['_x', '_y', '_cp1x', '_cp1y', '_cp2x', '_cp2y'];
    this._proto = 'BCurve';
    jCanvaScript.Proto.Lines.call(this, points, lineColor, fillColor);
}

jCanvaScript.Proto.BCurve.prototype = Object.create(jCanvaScript.Proto.Lines.prototype);

jCanvaScript.Proto.BCurve.prototype.draw = function(ctx) {
    if (this._x0 === undefined) return;
    ctx.moveTo(this._x0, this._y0);
    for (var j = 1; j < this.shapesCount; j++) {
        ctx.bezierCurveTo(this['_cp1x' + j], this['_cp1y' + j], this['_cp2x' + j], this['_cp2y' + j], this['_x' + j], this['_y' + j]);
    }
};

jCanvaScript.bCurve = function(points, lineColor, fillColor){
    return new jCanvaScript.Proto.BCurve(points, lineColor, fillColor);
}

jCanvaScript.Proto.Line = function(points, lineColor, fillColor){
    this._pointNames = ['_x', '_y'];
    this._proto = 'Line';
    jCanvaScript.Proto.Lines.call(this, points, lineColor, fillColor);
};

jCanvaScript.Proto.Line.prototype = Object.create(jCanvaScript.Proto.Lines.prototype);

jCanvaScript.Proto.Line.prototype.draw = function(ctx) {
    if (this._x0 === undefined)return;
    ctx.moveTo(this._x0, this._y0);
    for (var j = 1; j < this.shapesCount; j++) {
        ctx.lineTo(this['_x' + j], this['_y' + j]);
    }
}

jCanvaScript.line = function(points, lineColor, fillColor){
    return new jCanvaScript.Proto.Line(points, lineColor, fillColor);
}

jCanvaScript.Proto.QCurve = function(points, lineColor, fillColor) {
    this._pointNames = ['_x', '_y', '_cp1x', '_cp1y'];
    this._proto = 'QCurve';
    jCanvaScript.Proto.Lines.call(this, points, lineColor, fillColor);
}

jCanvaScript.Proto.QCurve.prototype = Object.create(jCanvaScript.Proto.Lines.prototype);

jCanvaScript.Proto.QCurve.prototype.draw = function(ctx) {
    if (this._x0 === undefined) return;
    ctx.moveTo(this._x0, this._y0);
    for (var j = 1; j < this.shapesCount; j++) {
        ctx.quadraticCurveTo(this['_cp1x' + j], this['_cp1y' + j], this['_x' + j], this['_y' + j]);
    }
};

jCanvaScript.qCurve = function(points, lineColor, fillColor){
    return new jCanvaScript.Proto.QCurve(points, lineColor, fillColor);
};


/*
 * @function
 * @type {jCanvaScript.gradientsAndPatterns}
 */
jCanvaScript.Proto.GradientsAndPatterns = function() {
    this.animateQueue = [];
    this.optns = {
        animated: false,
        name: "",
        layer: {id: jCanvaScript.canvases[0].optns.id + 'Layer_0', number: 0},
        canvas: {number: 0},
        visible: true
    };
    this.optns.layer.id = jCanvaScript.canvases[jCanvaScript._lastCanvas].optns.id + 'Layer_0';
    this.optns.layer.number = 0;
    this.optns.canvas.number = jCanvaScript._lastCanvas;
    var gradientsAndPatternsArray = jCanvaScript.canvases[jCanvaScript._lastCanvas].layers[0].grdntsnptrns;
    this._level = gradientsAndPatternsArray.length;
    gradientsAndPatternsArray[this._level] = this;
    this._arrayName = 'grdntsnptrns';
    this.redraw();
};

jCanvaScript.Proto.GradientsAndPatterns.prototype.layer = jCanvaScript.Proto.Object.prototype.layer;
jCanvaScript.Proto.GradientsAndPatterns.prototype.canvas = jCanvaScript.Proto.Object.prototype.canvas;
jCanvaScript.Proto.GradientsAndPatterns.prototype.animate = jCanvaScript.Proto.Object.prototype.animate;
jCanvaScript.Proto.GradientsAndPatterns.prototype.attr = jCanvaScript.Proto.Object.prototype.attr;
jCanvaScript.Proto.GradientsAndPatterns.prototype.id = jCanvaScript.Proto.Object.prototype.id;
jCanvaScript.Proto.GradientsAndPatterns.prototype.name = jCanvaScript.Proto.Object.prototype.name;
jCanvaScript.Proto.GradientsAndPatterns.prototype.level = jCanvaScript.Proto.Object.prototype.level;
jCanvaScript.Proto.GradientsAndPatterns.prototype.proto = jCanvaScript.Proto.Object.prototype.proto;
jCanvaScript.Proto.GradientsAndPatterns.prototype.redraw = jCanvaScript.Proto.Object.prototype.redraw;

jCanvaScript.Proto.Gradients = function(colors) {
    /*@private*/
    this._colorStopsCount = 0;
    /*@private*/
    this._paramNames = ['_pos','_colorR','_colorG','_colorB','_colorA'];
    jCanvaScript.Proto.GradientsAndPatterns.call(this);
    if (colors == undefined)
        return this;
    else
        return this.colorStops(colors);
};

jCanvaScript.Proto.Gradients.prototype = Object.create(jCanvaScript.Proto.GradientsAndPatterns.prototype);
/*
 * @param {Number} pos
 * @param {String} color
 * */
jCanvaScript.Proto.Gradients.prototype.addColorStop = function(pos, color) {
    this.redraw();
    var colorKeeper = jCanvaScript.parseColor(color);
    var i = this._colorStopsCount;
    this['_pos' + i] = pos;
    this['_colorR' + i] = colorKeeper.r;
    this['_colorG' + i] = colorKeeper.g;
    this['_colorB' + i] = colorKeeper.b;
    this['_colorA' + i] = colorKeeper.a;
    this._colorStopsCount++;
    return this;
};

/*
 * @param {Object} parameters
 * @param {Number} duration
 * @param {Object} easing
 * @param {Object} onstep
 * @param {Function} fn
 * */
jCanvaScript.Proto.Gradients.prototype.animate = function(parameters, duration, easing, onstep, fn) {
    for (var key in parameters) {
        if (key.substr(0, 5) == 'color') {
            var i = key.substring(5);
            var colorKeeper = jCanvaScript.parseColor(parameters[key]);
            parameters['colorR' + i] = colorKeeper.r;
            parameters['colorG' + i] = colorKeeper.g;
            parameters['colorB' + i] = colorKeeper.b;
            parameters['colorA' + i] = colorKeeper.a;
        }
    }
    jCanvaScript.Proto.GradientsAndPatterns.animate.call(this, parameters, duration, easing, onstep, fn);
};

/*
 * @param {Number} i
 * */
jCanvaScript.Proto.Gradients.prototype.delColorStop = function(i) {
    this.redraw();
    var colorStops = this.colorStops();
    colorStops.splice(i, 1);
    if (colorStops.length > 0)this.colorStops(colorStops);
    else this._colorStopsCount = 0;
    return this;
};

/*
 * @private*/
jCanvaScript.Proto.Gradients.prototype._createColorStops = function() {
    for (var i = 0; i < this._colorStopsCount; i++) {
        this.val.addColorStop(this['_pos' + i], 'rgba(' + parseInt(this['_colorR' + i]) + ',' + parseInt(this['_colorG' + i]) + ',' + parseInt(this['_colorB' + i]) + ',' + this['_colorA' + i] + ')');
    }
};

/*
 * @param {Array} array
 * */
jCanvaScript.Proto.Gradients.prototype.colorStops = function(array) {
    var names = this._paramNames;
    if (array === undefined) {
        array = [];
        for (var j = 0; j < this._colorStopsCount; j++) {
            array[j] = [];
            for (var i = 0; i < names.length; i++)
                array[j][i] = this[names[i] + j];
        }
        return array;
    }
    this.redraw();
    var oldCount = this._colorStopsCount;
    var limit = array.length;
    if (array[0].length == 2)
        for (j = 0; j < limit; j++)
            this.addColorStop(array[j][0], array[j][1]);
    else
        for (j = 0; j < limit; j++)
            for (i = 0; i < names.length; i++)
                this[names[i] + j] = array[j][i];
    for (j = limit; j < oldCount; j++)
        for (i = 0; i < names.length; i++)
            this[names[i] + j] = undefined;
    this._colorStopsCount = limit;
    return this;
}

jCanvaScript.Proto.LGradient = function(x1, y1, x2, y2, colors) {
    var options = x1;
    if (typeof options !== 'object')
        options = {x1: x1, y1: y1, x2: x2, y2: y2, colors: colors};
    options = jCanvaScript.checkDefaults(options, {x1: 0, y1:0, x2: 0, y2: 0});
    jCanvaScript.Proto.Gradients.call(this, options.colors);
    this._x1 = options.x1;
    this._y1 = options.y1;
    this._x2 = options.x2;
    this._y2 = options.y2;
    this._proto = 'lGradient';
    return this;
};
jCanvaScript.Proto.LGradient.prototype = Object.create(jCanvaScript.Proto.Gradients.prototype);
/*
 * @private
 * @param {Object} canvasOptions
 */
jCanvaScript.Proto.LGradient.prototype.draw = function(canvasOptions) {
    if (this.optns.animated)jCanvaScript._helpers.animating.call(this, canvasOptions);
    this.val = canvasOptions.ctx.createLinearGradient(this._x1, this._y1, this._x2, this._y2);
    this._createColorStops();
};

jCanvaScript.lGradient = function(x1, y1, x2, y2, colors){
    return new jCanvaScript.Proto.LGradient(x1, y1, x2, y2, colors);
}

/*
 * @function jCanvaScript.pattern
 * @type {jCanvaScript.pattern}
 * @param {Image} image
 * @param {String} [type]
 */
jCanvaScript.Proto.Pattern = function(image, type) {
    var options = image;
    if (options.src)
        options = {image: image, type: type};
    options = jCanvaScript.checkDefaults(options, {type: 'repeat'});
    jCanvaScript.Proto.GradientsAndPatterns.call(this);
    this._img = options.image;
    this._type = options.type;
    this._proto = 'pattern';
    return this;
};
jCanvaScript.Proto.Pattern.prototype = Object.create(jCanvaScript.Proto.GradientsAndPatterns.prototype);
/*@private*/
jCanvaScript.Proto.Pattern.prototype.draw = function(canvasOptions) {
    if (this.optns.animated) jCanvaScript._helpers.animating.call(this, canvasOptions);
    this.val = canvasOptions.ctx.createPattern(this._img, this._type);
};

jCanvaScript.pattern = function(image, type) {
    return new jCanvaScript.Proto.Pattern(image, type);
}

/*
 * @function
 * @type {jCanvaScript.rGradient}
 */
jCanvaScript.Proto.RGradient = function(x1, y1, r1, x2, y2, r2, colors) {
    var options = x1;
    if (typeof options !== 'object')
        options = {x1: x1, y1: y1, r1: r1, x2: x2, y2: y2, r2: r2, colors: colors};
    options = jCanvaScript.checkDefaults(options, {x1:0,y1:0,r1:0,x2:0,y2:0,r2:0});
    jCanvaScript.Proto.Gradients.call(this, options.colors);
    this._x1 = options.x1;
    this._y1 = options.y1;
    this._r1 = options.r1;
    this._x2 = options.x2;
    this._y2 = options.y2;
    this._r2 = options.r2;
    this._proto='rGradient';
    return this;
};

jCanvaScript.Proto.RGradient.prototype = Object.create(jCanvaScript.Proto.Gradients.prototype);
/*
 * @private
 * @param {Object} canvasOptions
 */
jCanvaScript.Proto.RGradient.prototype.draw = function(canvasOptions) {
    if (this.optns.animated)jCanvaScript._helpers.animating.call(this);
    this.val = canvasOptions.ctx.createRadialGradient(this._x1, this._y1, this._r1, this._x2, this._y2, this._r2);
    this._createColorStops();
};

jCanvaScript.rGradient = function(x1, y1, r1, x2, y2, r2, colors){
    return new jCanvaScript.Proto.RGradient(x1, y1, r1, x2, y2, r2, colors);
}
