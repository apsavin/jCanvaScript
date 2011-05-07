/*!
 * jCanvaScript JavaScript Library v 1.2.3
 * http://jcscript.com/
 *
 * Copyright 2011, Alexander Savin
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(){
var canvases = [],pi=Math.PI*2,lastCanvas=0,lastLayer=0,underMouse = false,regHasLetters = /[A-z]+?/,FireFox=window.navigator.userAgent.match(/Firefox\/\w+\.\w+/i);
if (FireFox!="" && FireFox!==null)
	var FireFox_lt4=(parseInt(FireFox[0].split(/[ \/\.]/i)[1])<4);

function findById(i,j,stroke)
{
	var objs=canvases[i].layers[j].objs;
	var grdntsnptrns=canvases[i].layers[j].grdntsnptrns;
	var limit=objs.length;
	for(var k=0;k<limit;k++)
		if('#'+objs[k].optns.id==stroke)return objs[k];
	limit=grdntsnptrns.length;
	for(k=0;k<limit;k++)
		if('#'+grdntsnptrns[k].optns.id==stroke)return grdntsnptrns[k];
	return false;
}
function findByName(i,j,myGroup,stroke)
{
	var objs=canvases[i].layers[j].objs;
	var grdntsnptrns=canvases[i].layers[j].grdntsnptrns;
	var limit=objs.length;
	for(var k=0;k<limit;k++)
		if(('.'+objs[k]._name)==stroke)myGroup.elements[myGroup.elements.length]=objs[k];
	limit=grdntsnptrns.length;
	for(k=0;k<limit;k++)
		if(('.'+grdntsnptrns[k]._name)==stroke)myGroup.elements[myGroup.elements.length]=grdntsnptrns[k];
	return myGroup;
}
function findByCanvasAndLayer(i,j,myGroup)
{
	var objs=canvases[i].layers[j].objs;
	var grdntsnptrns=canvases[i].layers[j].grdntsnptrns;
	var limit=objs.length;
	for(var k=0;k<limit;k++)
		myGroup.elements[myGroup.elements.length]=objs[k];
	limit=grdntsnptrns.length;
	for(k=0;k<limit;k++)
		myGroup.elements[myGroup.elements.length]=grdntsnptrns[k];
	return myGroup;
}
var jCanvaScript=function(stroke,map)
{
	if(stroke===undefined)return this;
	if(typeof stroke=='object')
	{
		map=stroke;
		stroke=undefined;
	}
	var canvas=-1,layer=-1,limitC=canvases.length,limitL=0,limit=0,myGroup=group();
	if (map===undefined)
	{
		if(stroke.charAt(0)=='#')
		{
			for(i=0;i<limitC;i++)
			{
				limitL=canvases[i].layers.length;
				for (j=0;j<limitL;j++)
				{
					var element=findById(i,j,stroke);
					if(element)return element;
				}
			}
		}
		if(stroke.charAt(0)=='.')
		{
			for(var i=0;i<limitC;i++)
			{
				limitL=canvases[i].layers.length;
				for (var j=0;j<limitL;j++)
				{
					myGroup=findByName(i,j,myGroup,stroke);
				}
			}
			return myGroup;
		}
	}
	else
	{
		if(map.canvas!==undefined)
		{
			for(i=0;i<limitC;i++)
				if(canvases[i].optns.id==map.canvas){canvas=i;break;}
		}
		if(map.layer!==undefined)
		{
			if(canvas!=-1)
			{
				limit=canvases[canvas].layers.length;
				for(i=0;i<limit;i++)
					if(canvases[canvas].layers[i].optns.id==map.layer){layer=i;break;}
			}
			else
			{
				for(i=0;i<limitC;i++)
				{
					limit=canvases[i].layers.length;
					for (j=0;j<limit;j++)
					{
						if(canvases[i].layers[j].optns.id==map.layer){canvas=i;layer=j;break;}
					}
					if (layer>-1)break;
				}
			}
		}
		if(layer<0 && canvas<0)return false;
		if (layer<0)
		{
			limitL=canvases[canvas].layers.length;
			if (stroke===undefined)
			{
				for (j=0;j<limitL;j++)
				{
					myGroup=findByCanvasAndLayer(canvas,j,myGroup);
				}
				return myGroup;
			}
			if(stroke.charAt(0)=='#')
			{
				for (j=0;j<limitL;j++)
				{
					element=findById(canvas,j,stroke);
					if(element)return element;
				}
			}
			if(stroke.charAt(0)=='.')
			{
				for (j=0;j<limitL;j++)
				{
					myGroup=findByName(canvas,j,myGroup,stroke);
				}
				return myGroup;
			}
		}
		else
		{
			if(stroke===undefined)
			{
				return findByCanvasAndLayer(canvas,layer,myGroup);
			}
			if(stroke.charAt(0)=='#')
			{
				return findById(canvas,layer,stroke);
			}
			if(stroke.charAt(0)=='.')
			{
				return findByName(canvas,layer,myGroup,stroke)
			}
		}
	}
}


function redraw(object)
{
	canvases[object.optns.canvas.number].optns.redraw=1;
}

function animating()
{
	var limit=this.animateQueue.length;
	var progress=1;
	for(var q=0;q<limit;q++)
	{
		var queue=this.animateQueue[q];
		for(var key in queue)
		{
			if(this.hasOwnProperty(key) && this[key]!==undefined)
			{
				if(queue[key])
				{
					var property=queue[key];
					var step=property['step'];
					var duration=property['duration'];
					var easing=property['easing'];
					var to=property['to'];
					var from=property['from'];
					property['step']++;
					progress=step/duration;
					animateTransforms(key,this,queue);
					if(easing['type']=='in' || (easing['type']=='inOut' && progress<0.5))this[key]=(to-from)*animateFunctions[easing['fn']](progress,easing)+from;
					if(easing['type']=='out' || (easing['type']=='inOut' && progress>0.5))this[key]=(to-from)*(1-animateFunctions[easing['fn']](1-progress,easing))+from;
					if(property['onstep'])property['onstep'].fn.call(this,property['onstep']);
					if(step>duration)
					{
						this[key]=to;
						animateTransforms(key,this,queue);
						queue[key]=false;
						queue.animateKeyCount--;
					}
				}
				else
				{
					if(!queue.animateKeyCount){
						if(queue.animateFn!==undefined)queue.animateFn.apply(this);
						this.animateQueue.splice(q,1);
						q--;
					}
				}
			}
		}
	}
	if (limit==0)this.optns.animated=false;
	else redraw(this);
	return this;
}
function animateTransforms(key,object,queue)
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
		case '_scaleX':
			object.scale(val-prev,0);
			break;
		case '_scaleY':
			object.scale(0,val-prev);
			break;
		default:
			return;
	}
	queue[key]['prev']=val;
}
function keyEvent(e,key,optns)
{
	e=e||window.event;
	optns[key].code=e.charCode||e.keyCode;
	optns[key].val=true;
	optns.redraw=1;
	return false;
}
function mouseEvent(e,key,optns)
{
	e=e||window.event;
	var point= {
		pageX:e.pageX||e.clientX,
		pageY:e.pageY||e.clientY
	};
	optns[key].x=point.pageX - optns.x;
	optns[key].y=point.pageY - optns.y;
	if(optns[key].val)optns.redraw=1;
	return false;
}
function setMouseEvent(fn,eventName)
{
	if(fn===undefined)this['on'+eventName]();
	else this['on'+eventName] = fn;
	if(eventName=='mouseover'||eventName=='mouseout')eventName='mousemove';
	canvases[this.optns.canvas.number].optns[eventName].val=true;
	return this;
}
function setKeyEvent(fn,eventName)
{
	if(fn===undefined)this[eventName]();
	else this[eventName] = fn;
	return this;
}
var animateFunctions={
	linear:function(progress,params){
		return progress;
	},
	exp:function(progress,params){
		var n=params.n||2;
		return Math.pow(progress,n);
	},
	circ:function(progress,params){
		return 1 - Math.sqrt(1-progress*progress);
	},
	sine:function(progress,params){
		return 1 - Math.sin((1 - progress) * Math.PI/2);
	},
	back:function(progress,params){
		var n=params.n||2;
		var x=params.x||1.5;
		return Math.pow(progress, n) * ((x + 1) * progress - x);
	},
	elastic:function(progress,params){
		var n=params.n||2;
		var m=params.m||20;
		var k=params.k||3;
		var x=params.x||1.5;
		return Math.pow(n,10 * (progress - 1)) * Math.cos(m * progress * Math.PI * x / k);
	},
	bounce:function(progress,params)
	{
		var n=params.n||4;
		var b=params.b||0.25;
		var sum = [1];
		for(var i=1; i<n; i++) sum[i] = sum[i-1] + Math.pow(b, i/2);
		var x = 2*sum[n-1]-1;
		for(i=0; i<n; i++)
		{
			if(x*progress >= (i>0 ? 2*sum[i-1]-1 : 0) && x*progress <= 2*sum[i]-1)
				return Math.pow(x*(progress-(2*sum[i]-1-Math.pow(b, i/2))/x), 2)+1-Math.pow(b, i);
		}
		return 1;
	}
}

function multiplyM(m1,m2)
{
	return [[(m1[0][0]*m2[0][0]+m1[0][1]*m2[1][0]),(m1[0][0]*m2[0][1]+m1[0][1]*m2[1][1]),(m1[0][0]*m2[0][2]+m1[0][1]*m2[1][2]+m1[0][2])],[(m1[1][0]*m2[0][0]+m1[1][1]*m2[1][0]),(m1[1][0]*m2[0][1]+m1[1][1]*m2[1][1]),(m1[1][0]*m2[0][2]+m1[1][1]*m2[1][2]+m1[1][2])]];
}
function transformPoint(x,y,m)
{
	return{
		x:(x*m[1][1]-y*m[0][1]+m[0][1]*m[1][2]-m[1][1]*m[0][2])/(m[0][0]*m[1][1]-m[1][0]*m[0][1]),
		y:(-x*m[1][0]+y*m[0][0]-m[0][0]*m[1][2]+m[1][0]*m[0][2])/(m[0][0]*m[1][1]-m[1][0]*m[0][1])
	}
}
function getObjectRectangle(object)
{
	var points={};
	if(object._proto=='text')
	{
		var ctx=canvases[object.optns.canvas.number].optns.ctx;
		var height=parseInt(object._font);
		points.x=object._x;
		points.y=object._y-height;
		object.setOptns(ctx);
		points.width=ctx.measureText(object._string).width;
		points.height=height;
		return points;
	}
	if(object._img!==undefined)
	{
		points.x=object._sx;
		points.y=object._sy;
		points.width=object._img.width;
		points.height=object._img.height;
		return points;
	}
	if(object._width!==undefined && object._height!==undefined)
	{
		points.x=object._x;
		points.y=object._y;
		points.width=object._width;
		points.height=object._height;
		return points;
	}
	if(object._radius!==undefined)
	{
		if(object._startAngle===undefined)
		{
			points.x=object._x-object._radius;
			points.y=object._y-object._radius;
			points.width=points.height=object._radius*2;
			return points;
		}
	}
	if(object.shapesCount!==undefined)
	{
		var minX;
		var minY;
		var maxX=minX=object._x0;
		var maxY=minY=object._y0;
		for(var i=1;i<object.shapesCount;i++)
		{
			if(maxX<object['_x'+i])maxX=object['_x'+i];
			if(maxY<object['_y'+i])maxY=object['_y'+i];
			if(minX>object['_x'+i])minX=object['_x'+i];
			if(minY>object['_y'+i])minY=object['_y'+i];
		}
		points.x=minX;
		points.y=minX;
		points.width=maxX-minX;
		points.height=maxY-minY;
		return points;
	}
	if(object.objs!==undefined)
	{
		for(i=0;i<object.objs.length;i++)
		{
			var rect=getObjectRectangle(object.objs[i]);
			if(points.x>rect.x || !i)points.x=rect.x;
			if(points.y>rect.y || !i)points.y=rect.y;
			if(points.width<rect.width || !i)points.width=rect.width;
			if(points.height<rect.height || !i)points.height=rect.height;
		}
		return points;
	}
	return false;
}
function getObjectCenter(object)
{
	var point={};
	if(object.objs!==undefined || object._img!==undefined || object._proto=='text')
	{
		var rect=getObjectRectangle(object);
		point.x=(rect.x*2+rect.width)/2;
		point.y=(rect.y*2+rect.height)/2;
		return point;
	}
	if(object._width!==undefined && object._height!==undefined)
	{
		point.x=(object._x*2+object._width)/2;
		point.y=(object._y*2+object._height)/2;
		return point;
	}
	if(object._radius!==undefined)
	{
		point.x=object._x;
		point.y=object._y;
		return point;
	}
	if(object.shapesCount!==undefined)
	{
		point.x=object._x0;
		point.y=object._y0;
		for(var i=1;i<object.shapesCount;i++)
		{
			point.x+=object['_x'+i];
			point.y+=object['_y'+i];
		}
		point.x=point.x/object.shapesCount;
		point.y=point.y/object.shapesCount;
		return point;
	}
	return false;
}
function parseColor(color)
{
	var colorKeeper={
		color:{
			val:color,
			notColor:undefined
		},
		colorR:0,
		colorB:0,
		colorG:0,
		alpha:0};
	if(color.id!==undefined)
	{
		colorKeeper.color.notColor={
			level:color._level,
			canvas:color.optns.canvas.number,
			layer:color.optns.layer.number
		}
		return colorKeeper;
	}
	if(color.charAt(0)=='#')
	{
		colorKeeper.colorR=parseInt(color.substr(1,2),16);
		colorKeeper.colorG=parseInt(color.substr(3,2),16);
		colorKeeper.colorB=parseInt(color.substr(5,2),16);
		colorKeeper.alpha=1;
	}
	else
	{
		var arr=color.split(',');
		if(arr.length==4)
		{
			var colorR = arr[0].split('(');
			var alpha = arr[3].split(')');
			colorKeeper.colorR=parseInt(colorR[1]);
			colorKeeper.colorG=parseInt(arr[1]);
			colorKeeper.colorB=parseInt(arr[2]);
			colorKeeper.alpha=parseFloat(alpha[0]);
		}
		if(arr.length==3)
		{
			colorR = arr[0].split('(');
			var colorB = arr[2].split(')');
			colorKeeper.colorR=parseInt(colorR[1]);
			colorKeeper.colorG=parseInt(arr[1]);
			colorKeeper.colorB=parseInt(colorB[0]);
			colorKeeper.alpha=1;
		}
	}
	colorKeeper.color.notColor = undefined;
	return colorKeeper;
}
function getOffset(elem) {
	if (elem.getBoundingClientRect) {
		return getOffsetRect(elem)
	} else {
		return getOffsetSum(elem)
	}
}

function getOffsetSum(elem) {
	var top=0, left=0
	while(elem) {
		top = top + parseInt(elem.offsetTop)
		left = left + parseInt(elem.offsetLeft)
		elem = elem.offsetParent
	}
	return {
		top: top,
		left: left
	}
}

function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect()
	var body = document.body
	var docElem = document.documentElement
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
	var clientTop = docElem.clientTop || body.clientTop || 0
	var clientLeft = docElem.clientLeft || body.clientLeft || 0
	var top  = box.top +  scrollTop - clientTop
	var left = box.left + scrollLeft - clientLeft
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
	if(optns.keyDown.val!=false)if(typeof object.onkeydown=='function')object.onkeydown(optns.keyDown);
	if(optns.keyUp.val!=false)if(typeof object.onkeyup=='function')object.onkeyup(optns.keyUp);
	if(optns.keyPress.val!=false)if(typeof object.onkeypress=='function')object.onkeypress(optns.keyPress);
}
function isPointInPath(object,x,y)
{
	var point={};
	var canvas=canvases[object.optns.canvas.number];
	var ctx=canvas.optns.ctx;
	var layer=canvas.layers[object.optns.layer.number];
	point.x=x;
	point.y=y;
	if(FireFox_lt4)
	{
		point=transformPoint(x,y,multiplyM(object.matrix(),layer.matrix()));
	}
	if(ctx.isPointInPath===undefined || object._img!==undefined || object._imgData!==undefined || object._proto=='text')
	{
		var rectangle=getObjectRectangle(object);
		point=transformPoint(x,y,multiplyM(object.matrix(),layer.matrix()));
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
function checkMouseEvents(object,optns)
{
	var point=false;
	var x=optns.mousemove.x||optns.mousedown.x||optns.mouseup.x||optns.click.x||optns.dblclick.x;
	var y=optns.mousemove.y||optns.mousedown.y||optns.mouseup.y||optns.click.y||optns.dblclick.y;
	if(x!=false)
	{
		point=isPointInPath(object,x,y);
	}
	if(point)
	{
		if(optns.mousemove.x!=false)
			optns.mousemove.object=object;
		if(optns.mousedown.x!=false)
			optns.mousedown.object=object;
		if(optns.click.x!=false || optns.dblclick.x!=false)
			optns.click.object=object;
		if(optns.mouseup.x!=false)
			optns.mouseup.object=object;
		optns.point=point;
	}
}

function objectLayer(object)
{
	return canvases[object.optns.canvas.number].layers[object.optns.layer.number];
}
function layer(idLayer,object,array)
{
	redraw(object);
	var objectCanvas=object.optns.canvas;
	var objectLayer=object.optns.layer;
	if (idLayer===undefined)return objectLayer.id;
	if(objectLayer.id==idLayer)return object;
	var oldIndex={
		i:objectCanvas.number,
		j:objectLayer.number
	};
	objectLayer.id=idLayer;
	var newLayer=jCanvaScript.layer(idLayer);
	var newIndex={
		i:newLayer.optns.canvas.number,
		j:newLayer._level
	};
	var oldArray=canvases[oldIndex.i].layers[oldIndex.j][array],newArray=canvases[newIndex.i].layers[newIndex.j][array];
	oldArray.splice(object._level,1);
	normalizeLevels(oldArray);
	object._level=newArray.length;
	newArray[object._level]=object;
	objectLayer.number=newIndex.j;
	objectCanvas.number=newIndex.i;
	redraw(object);
	return object;
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
					for(var i=0;i<s[key].length;i++)
					{
						s[key][i].clone().layer(f.optns.id);
					}
					break;
				}
				f[key]=typeof s[key].pop === 'function' ? []:{};
				take(f[key],s[key]);
				break;
			default:
				if(key=='_level')break;
				f[key]=s[key];
		}
	}
}
function canvas(idCanvas,object,array)
{
	redraw(object);
	var objectCanvas=object.optns.canvas;
	var objectLayer=object.optns.layer;
	if(idCanvas===undefined)return canvases[objectCanvas.number].optns.id;
	if(canvases[objectCanvas.number].optns.id==idCanvas)return object;
	var oldIndex={
		i:objectCanvas.number,
		j:objectLayer.number
	};
	jCanvaScript.canvas(idCanvas);
	for(var i=0;i<canvases.length;i++)
		var canvasItem=canvases[i];
		if(canvasItem.optns.id==idCanvas)
		{
			var oldArray=canvases[oldIndex.i].layers[oldIndex.j][array],newArray=canvasItem.layers[0][array];
			oldArray.splice(object._level,1);
			normalizeLevels(oldArray);
			object._level=newArray.length;
			newArray[object._level]=object;
			objectLayer.number=0;
			objectCanvas.number=i;
			objectCanvas.id=canvasItem.optns.id;
			objectLayer.id=canvasItem.layers[0].optns.id;
		}
	redraw(object);
	return object;
}
function normalizeLevels(array)
{
	for(var i=0;i<array.length;i++)
	{
		array[i]._level=i;
	}
}
function levelChanger(array)
{
	var limit=array.length;
	var tmp;
	for(var j=0;j<limit;j++)
	{
		if(array[j]._level!=j)
		{
			tmp=array[j];
			var id=tmp._level;
			if (id>=limit)id=limit-1;
			if (id<0)id=0;
			if(id>j)
				for(var i=j;i<id;i++)
				{
					array[i]=array[i+1];
					array[i]._level=i;
				}
			if(id<j)
				for(i=j;i>id;i--)
				{
					array[i]=array[i-1];
					array[i]._level=i;
				}
			array[id]=tmp;
			array[id]._level=id;
		}
	}
}
function objDeleter(array)
{
	for(var i=0;i<array.length;i++)
	{
		if(array[i].optns.deleted)
		{
			array.splice(i,1);
			i--;
		}
	}
	return array.length;
}
var proto={};



proto.object=function()
{
	this.clone=function(params)
	{
		var clone=new proto[this._proto];
		proto[this._proto].prototype.base.call(clone);
		take(clone,this);
		clone.layer(objectLayer(this).optns.id);
		if(params===undefined) return clone;
		return clone.animate(params);
	}
	this.shadow= function(options)
	{
		for(var key in options)
		switch (key)
		{
			case 'x':
				this._shadowX=options.x;
				break;
			case 'y':
				this._shadowY=options.y;
				break;
			case 'blur':
				this._shadowBlur=options.blur;
				break;
			case 'color':
				var colorKeeper = parseColor(options.color);
				this._shadowColor = options.color.val;
				this._shadowColorR = colorKeeper.colorR;
				this._shadowColorG = colorKeeper.colorG;
				this._shadowColorB = colorKeeper.colorB;
				this._shadowColorA = colorKeeper.alpha;
				break;
		}
		redraw(this);
		return this;
	}
	this.setOptns=function(ctx)
	{
		ctx.globalAlpha = this._opacity;
		ctx.shadowOffsetX = this._shadowX;
		ctx.shadowOffsetY = this._shadowY;
		ctx.shadowBlur = this._shadowBlur;
		ctx.globalCompositeOperation=this._composite;
		ctx.shadowColor = 'rgba('+this._shadowColorR+','+this._shadowColorG+','+this._shadowColorB+','+this._shadowColorA+')';
		if(this.scaleMatrix)
		{
			this.matrix(multiplyM(this.matrix(),this.scaleMatrix));
			this.scaleMatrix=false;
		}
		if(this.rotateMatrix)
		{
			this.matrix(multiplyM(this.matrix(),this.rotateMatrix));
			this.rotateMatrix=false;
		}
		ctx.transform(this._transform11,this._transform12,this._transform21,this._transform22,this._transformdx,this._transformdy);
		return this;
	}
	this.up=function(n)
	{
		if(n === undefined)n=1;
		if(n == 'top')n=objectLayer(this).objs.length-1;
		this._level+=n;
		objectLayer(this).optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	}
	this.down=function(n)
	{
		if(n == undefined)n=1;
		if(n == 'bottom')n=this._level;
		this._level-=n;
		objectLayer(this).optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	}
	this.del=function()
	{
		this.optns.deleted=true;
		objectLayer(this).optns.anyObjDeleted = true;
		redraw(this);
	}
	this.focus=function(fn)
	{
		if(fn===undefined)
		{
			this.optns.focused=true;
			if(typeof this.onfocus=='function')this.onfocus();
		}
		else this.onfocus=fn;
		return this;
	}
	this.blur=function(fn)
	{
		if(fn===undefined)
		{
			this.optns.focused=false;
			if(typeof this.onblur == 'function')this.onblur();
		}
		else this.onblur=fn;
		return this;
	}
	this.click= function(fn)
	{
		return setMouseEvent.call(this,fn,'click');
	}
	this.dblclick = function(fn)
	{
		return setMouseEvent.call(this,fn,'dblclick');
	}
	this.keypress= function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeypress');
	}
	this.keydown= function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeydown');
	}
	this.keyup= function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeyup');
	}
	this.mousedown= function(fn)
	{
		return setMouseEvent.call(this,fn,'mousedown');
	}
	this.mouseup= function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseup');
	}
	this.mousemove= function(fn)
	{
		return setMouseEvent.call(this,fn,'mousemove');
	}
	this.mouseover= function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseover');
	}
	this.mouseout= function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseout');
	}
	this.attr=function(parameter,value)
	{
		if(typeof parameter==='object')
			var parameters=parameter;
		else
		{
			if(value===undefined)
				return this['_'+parameter];
			parameters={};
			parameters[parameter]=value;
		}
		return this.animate(parameters);
	}
	this.stop=function(jumpToEnd,runCallbacks)
	{
		this.optns.animated=false;
		if(runCallbacks===undefined)runCallbacks=false;
		if(jumpToEnd===undefined)jumpToEnd=false;
		for(var q=0;q<this.animateQueue.length;q++)
		{
			var queue=this.animateQueue[q];
			if(runCallbacks)queue.animateFn.call(this);
			if(jumpToEnd)
			for(var key in queue)
			{
				if(queue[key]['from']!==undefined)
				{
					this[key]=queue[key]['to'];
					animateTransforms(key,this,queue);
				}
			}
		}
		this.animateQueue=[];
		return this;
	}
	this.animate=function(options,duration,easing,onstep,fn)
	{
		if(duration===undefined)duration=1;
		else
		{
			if(typeof duration == 'function')
			{
				fn=duration;
				duration=1;
			}
			if(typeof duration == 'object')
			{
				easing=duration;
				duration=1;
			}
		}
		if(duration!=1)duration=duration/1000*canvases[this.optns.canvas.number].fps;
		if (easing===undefined)easing={fn:'linear',type:'in'};
		else
		{
			if(typeof easing == 'function')
			{
				fn=easing;
				easing={fn:'linear',type:'in'};
			}
			if (easing.type===undefined)easing.type='in';
		}
		if(onstep===undefined)onstep=false;
		else
		{
			if(typeof onstep == 'function')
			{
				fn=onstep;
				onstep=false;
			}
		}
		if(options.scale!==undefined)
		{
			this._scaleX=this._scaleY=0;
			if(typeof options.scale!='object')
			{
				options.scaleX=options.scaleY=options.scale;
			}
			else
			{
				options.scaleX=options.scale.x||0;
				options.scaleY=options.scale.y||0;
			}
		}
		if(options.translate!==undefined)
		{
			this._translateX=this._translateY=0;
			if(typeof options.translate!='object')
			{
				options.translateX=options.translateY=options.translate;
			}
			else
			{
				options.translateX=options.translate.x||0;
				options.translateY=options.translate.y||0;
			}
			options.translate=undefined;
		}
		if(options.rotate!==undefined)
		{
			options.rotateAngle=options.rotate.angle;
			this._rotateAngle=0;
			this._rotateX=options.rotate.x||0;
			this._rotateY=options.rotate.y||0;
			options.rotate=undefined;
		}
		if(options.color !== undefined)
		{
			var colorKeeper=parseColor(options.color);
			if(colorKeeper.color.notColor)
				this.optns.color.notColor=colorKeeper.color.notColor;
			else
			{
				options.colorR=colorKeeper.colorR;
				options.colorG=colorKeeper.colorG;
				options.colorB=colorKeeper.colorB;
				options.alpha=colorKeeper.alpha;
			}
			options.color = undefined;
		}
		if(options.shadowColor !== undefined)
		{
			colorKeeper=parseColor(options.shadowColor);
			options.shadowColorR=colorKeeper.colorR;
			options.shadowColorG=colorKeeper.colorG;
			options.shadowColorB=colorKeeper.colorB;
			options.shadowColorA=colorKeeper.alpha;
			options.shadowColor = undefined;
		}
		if(duration>1)
		{
			var queue=this.animateQueue[this.animateQueue.length]={animateKeyCount:0};
			if (fn) queue.animateFn=fn;
			this.optns.animated=true;
		}
		for(var key in options)
		{
			if(this['_'+key] !== undefined && options[key]!==undefined)
			{
				if(options[key]!=this['_'+key])
				{
					if(options[key].charAt)
					{
						if(options[key].charAt(1)=='=')
						{
							options[key]=this['_'+key]+parseInt(options[key].charAt(0)+options[key].substr(2));
						}
						else if(!regHasLetters.test(options[key]))options[key]=parseInt(options[key]);
						else this['_'+key]=options[key];
					}
					if(duration==1)this['_'+key]=options[key];
					else
					{
						queue['_'+key]={
							from:this['_'+key],
							to:options[key],
							duration:duration,
							step:1,
							easing:easing,
							onstep:onstep,
							prev:0
						}
						queue.animateKeyCount++;
					}
				}
			}
		}
		if(duration==1)
		{
			if(options['rotateAngle'])
				this.rotate(this._rotateAngle,this._rotateX,this._rotateY);
			if(options['translateX']||options['translateY'])
				this.translate(this._translateX,this._translateY);
			if(options['scaleX']||options['scaleY'])
				this.scale(this._scaleX,this._scaleY);
		}
		redraw(this);
		return this;
	}
	this.matrix=function(m)
	{
		if(m===undefined)return [[this._transform11,this._transform21,this._transformdx],[this._transform12,this._transform22,this._transformdy]];
		this._transform11=m[0][0];
		this._transform21=m[0][1];
		this._transform12=m[1][0];
		this._transform22=m[1][1];
		this._transformdx=m[0][2];
		this._transformdy=m[1][2];
		return this;
	}
	this.translate=function(x,y)
	{
		this.matrix(multiplyM(this.matrix(),[[1,0,x],[0,1,y]]));
		redraw(this);
		return this;
	}
	this.scale=function(x,y)
	{
		if(y===undefined)y=x;
		if(this.scaleMatrix)
			this.scaleMatrix=multiplyM(this.scaleMatrix,[[x,0,this._x*(1-x)],[0,y,this._y*(1-y)]]);
		else
			this.scaleMatrix=[[x,0,this._x*(1-x)],[0,y,this._y*(1-y)]];
		redraw(this);
		return this;
	}
	this.rotate=function(x,x1,y1)
	{
		redraw(this);
		x=Math.PI*x/180;
		var cos=Math.cos(x);
		var sin=Math.sin(x);
		var matrix=[];
		if(x1===undefined)
		{
			matrix=[[cos,-sin,0],[sin,cos,0]];
		}
		else
		{
			if(x1=='center')
			{
				var point=getObjectCenter(this);
				if(y1===undefined)
				{
					x1=point.x;
					y1=point.y;
				}
				else
				{
					x1=point.x+y1.x;
					y1=point.y+y1.y;
				}
			}
			matrix=[[cos,-sin,-x1*(cos-1)+y1*sin],[sin,cos,-y1*(cos-1)-x1*sin]];
		}
		if(this.rotateMatrix)
				this.rotateMatrix=multiplyM(this.rotateMatrix,matrix);
			else
				this.rotateMatrix=matrix;
		return this;
	}
	this.transform=function(m11,m12,m21,m22,dx,dy,reset)
	{
		if(reset!==undefined)
		{
			this.matrix([[m11,m21,dx],[m12,m22,dy]]);
		}
		else
		{
			var m=multiplyM(this.matrix(),[[m11,m21,dx],[m12,m22,dy]]);
			this.matrix(m);
		}
		redraw(this);
		return this;
	}
	this.beforeDraw=function(ctx)
	{
		if(!this._visible)return false;
		ctx.save();
		if(this.optns.clipObject)
		{
			var clipObject=this.optns.clipObject;
			clipObject._visible=true;
			if (clipObject.optns.animated)animating.call(clipObject);
			clipObject.setOptns(ctx);
			ctx.beginPath();
			clipObject.draw(ctx);
			ctx.clip();
		}
		this.setOptns(ctx);
		if (this.optns.animated)animating.call(this);
		ctx.beginPath();
		return true;
	}
	this.clip=function(object)
	{
		if(object===undefined)return this.optns.clipObject;
		objectLayer(this).objs.splice(object._level,1);
		this.optns.clipObject=object;
		return this;
	}
	this.afterDraw=function(optns)
	{
		optns.ctx.closePath();
		checkEvents(this,optns);
		optns.ctx.restore();
		if(this.optns.clipObject)
		{
			proto.shape.prototype.afterDraw.call(this.optns.clipObject,optns);
		}
	}
	this.isPointIn=function(x,y,global)
	{
		var canvasOptns=canvases[this.optns.canvas.number].optns;
		var ctx=canvasOptns.ctx;
		if(global!==undefined)
		{
			x-=canvasOptns.x;
			y-=canvasOptns.y;
		}
		ctx.save();
		ctx.beginPath();
		this.draw(ctx);
		var point=isPointInPath(this,x,y);
		ctx.closePath();
		ctx.restore();
		if(point)return true;
		return false;
	}
	this.layer=function(idLayer)
	{
		return layer(idLayer,this,'objs');
	}
	this.canvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'objs');
	}
	this.draggable=function(object,params,fn)
	{
		var dragObj=this;
		var dragOptns=this.optns.drag;
		if(typeof params==='function')
		{
			fn=params;
			params=undefined;
		}
		if(typeof object=='function')
		{
			fn=object;
			object=undefined;
		}
		dragOptns.shiftX=0;
		dragOptns.shiftY=0;
		if(params!==undefined)
		{
			if(params.shiftX!==undefined){dragOptns.shiftX=params.shiftX;params.shiftX=undefined;}
			if(params.shiftY!==undefined){dragOptns.shiftY=params.shiftY;params.shiftY=undefined;}
		}
		if(object!==undefined)
		{
			if(object.id)dragObj=(params===undefined)? object.visible(false) : object.animate(params).visible(false);
			if(object=='clone')
			{
				dragObj=this.clone(params).visible(false);
				dragOptns.type='clone';
			}
		}
		dragOptns.val=true;
		dragOptns.x=this._x;
		dragOptns.y=this._y;
		dragOptns.dx=this._transformdx;
		dragOptns.dy=this._transformdy;
		dragOptns.object=dragObj;
		dragOptns.params=params;
		dragOptns.fn=fn||false;
		var optns=canvases[this.optns.canvas.number].optns;
		optns.mousemove.val=true;
		optns.mousedown.val=true;
		optns.mouseup.val=true;
		return this;
	}
	this.droppable=function(fn)
	{
		this.optns.drop.val=true;
		if(fn!==undefined)this.optns.drop.fn=fn;
		return this;
	}
	this.name = function(name)
	{
		return this.attr('name',name);
	}
	this.visible=function(visibility)
	{
		return this.attr('visible',visibility);
	}
	this.composite=function(composite)
	{
		return this.attr('composite',composite);
	}
	this.id=function(id)
	{
		if(id===undefined)return this.optns.id;
		this.optns.id=id;
		return this;
	}
	this.opacity=function(n)
	{
		return this.attr('opacity',n);
	}
	this.level=function(n)
	{
		if(n == undefined)return this._level;
		this._level=n;
		objectLayer(this).optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	}
	this.instanceOf=function(name)
	{
		if(name===undefined)return this._proto;
		return this instanceof proto[name];
	}
	this.base=function(x,y,service)
	{
		var canvasItem=canvases[lastCanvas];
		this.optns={
			animated:false,
			clipObject:false,
			drop:{val:false,fn:function(){}},
			drag:{val:false},
			layer:{id:canvasItem.optns.id+"Layer0",number:0},
			canvas:{number:0},
			focused:false
		}
		this.animateQueue = [];
		this._x=x||0;
		this._y=y||0;
		if(service===undefined && canvasItem!==undefined && canvasItem.layers[0]!==undefined)
		{
			this.optns.layer.number=0;
			this.optns.canvas.number=lastCanvas;
			this._level=objectLayer(this).objs.length;
			objectLayer(this).objs[this._level]=this;
			this.optns.layer.id=objectLayer(this).optns.id;
			redraw(this);
		}
		return this;
	}
	this._visible=true;
	this._composite='source-over';
	this._name="";
	this._opacity=1;
	this._shadowX=0;
	this._shadowY=0;
	this._shadowBlur= 0;
	this._shadowColor= 'rgba(0,0,0,0)';
	this._shadowColorR= 0;
	this._shadowColorG= 0;
	this._shadowColorB= 0;
	this._shadowColorA= 0;
	this._translateX=0;
	this._translateY=0;
	this._scaleX=0;
	this._scaleY=0;
	this._rotateAngle=0;
	this._rotateX=0;
	this._rotateY=0;
	this._transform11=1;
	this._transform12=0;
	this._transform21=0;
	this._transform22=1;
	this._transformdx=0;
	this._transformdy=0;
	this.rotateMatrix=this.scaleMatrix=false;
}

proto.shape=function()
{
	this.color = function(color)
	{
		if (color===undefined)return [this._colorR,this._colorG,this._colorB,this._alpha];
		return this.attr('color',color);
	}
	this.lineStyle = function(options)
	{
		return this.attr(options);
	}
	this.setOptns = function(ctx)
	{
		proto.shape.prototype.setOptns.call(this,ctx);
		ctx.lineWidth = this._lineWidth;
		ctx.lineCap = this._cap;
		ctx.lineJoin = this._join;
		ctx.miterLimit = this._miterLimit;
		var color=this.optns.color;
		if(color.notColor===undefined)
			color.val='rgba('+parseInt(this._colorR)+','+parseInt(this._colorG)+','+parseInt(this._colorB)+','+parseInt(this._alpha*100)/100+')';
		else
		{
			var notColor=color.notColor;
			var notColorLayer=canvases[notColor.canvas].layers[notColor.layer];
			if(notColorLayer.grdntsnptrns[notColor.level]!==undefined){color.val=notColorLayer.grdntsnptrns[notColor.level].val;}
		}
		if(this._fill) ctx.fillStyle = color.val;
		else ctx.strokeStyle = color.val;
	}
	this.afterDraw=function(optns)
	{
		if(this._fill)
			optns.ctx.fill();
		else
			optns.ctx.stroke();
		proto.shape.prototype.afterDraw.call(this,optns);
	}
	this.base=function(x,y,color,fill)
	{
		if(color===undefined)color='rgba(0,0,0,1)';
		else
		{
			if(!color.charAt && color.id===undefined)
			{
				fill=color;
				color='rgba(0,0,0,1)';
			}
		}
		proto.shape.prototype.base.call(this,x,y);
		this._fill=fill;
		this.optns.color={val:color,notColor:undefined};
		
		if(color===undefined)return this;
		return this.color(color);
	}
	this._colorR=0;
	this._colorG=0;
	this._colorB=0;
	this._alpha=0;
	this._lineWidth = 1;
	this._cap = 'butt';
	this._join = 'miter';
	this._miterLimit= 1;
}
proto.shape.prototype=new proto.object;

proto.lines=function()
{
	this.addPoint=function(){
		redraw(this);
		var names=this.pointNames;
		for(var i=0;i<names.length;i++)
				this[names[i]+this.shapesCount]=arguments[i];
		this.shapesCount++;
		return this;
	}
	this.delPoint=function(x,y,radius){
		redraw(this);
		if(y===undefined)
		{
			var points=this.points();
			points.splice(x,1)
			this.points(points);
		}
		else{
			radius=radius||0;
			for(var j=0;j<this.shapesCount;j++)
				if(this['_x'+j]<x+radius && this['_x'+j]>x-radius && this['_y'+j]<y+radius && this['_y'+j]<y+radius)
				{
					this.delPoint(j);
					j--;
				}
		}
		return this;
	}
	this.points=function(points)
	{
		var names=this.pointNames;
		if(points===undefined){
			points=[];
			for(var j=0;j<this.shapesCount;j++)
			{
				points[j]=[];
				for(var i=0;i<names.length;i++)
					points[j][i]=this[names[i]+j];
			}
			return points;
		}
		redraw(this);
		var oldCount=this.shapesCount;
		this.shapesCount=points.length;
		for(j=0;j<this.shapesCount;j++)
			for(i=0;i<names.length;i++)
				this[names[i]+j]=points[j][i];
		for(j=this.shapesCount;j<oldCount;j++)
			for(i=0;i<names.length;i++)
				this[names[i]+j]=undefined;
		return this;
	}
	this.base=function(color,fill)
	{
		proto.lines.prototype.base.call(this,0,0,color,fill);
		this.shapesCount=0;
		return this;
	}
}
proto.lines.prototype=new proto.shape;

proto.line=function(){
	this.draw=function(ctx)
	{
		if(this._x0===undefined)return;
		ctx.moveTo(this._x0,this._y0);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.lineTo(this['_x'+j],this['_y'+j]);
		}
	}
	this.base=function(points,color,fill)
	{
		proto.line.prototype.base.call(this,color,fill);
		if(points!==undefined)this.points(points);
		return this;
	}
	this._proto='line';
	this.pointNames=['_x','_y'];
}
proto.line.prototype=new proto.lines;
proto.qCurve=function(){
	this.draw=function(ctx)
	{
		if(this._x0===undefined)return;
		ctx.moveTo(this._x0,this._y0);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.quadraticCurveTo(this['_cp1x'+j],this['_cp1y'+j],this['_x'+j],this['_y'+j]);
		}
	}
	this.base=function(points,color,fill)
	{
		proto.qCurve.prototype.base.call(this,color,fill);
		if(points!==undefined)this.points(points);
		return this;
	}
	this._proto='qCurve';
	this.pointNames=['_x','_y','_cp1x','_cp1y'];
}
proto.qCurve.prototype=new proto.lines;
proto.bCurve=function(){
	this.draw=function(ctx)
	{
		if(this._x0===undefined)return;
		ctx.moveTo(this._x0,this._y0);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.bezierCurveTo(this['_cp1x'+j],this['_cp1y'+j],this['_cp2x'+j],this['_cp2y'+j],this['_x'+j],this['_y'+j]);
		}
	}
	this.base=function(points,color,fill)
	{
		proto.bCurve.prototype.base.call(this,color,fill);
		if(points!==undefined)this.points(points);
		return this;
	}
	this._proto='bCurve';
	this.pointNames=['_x','_y','_cp1x','_cp1y','_cp2x','_cp2y'];
}
proto.bCurve.prototype=new proto.lines;

proto.circle=function(){
	this.draw=function(ctx)
	{
		ctx.arc (this._x, this._y, this._radius, 0,pi,true);
	}
	this.base=function(x,y,radius,color,fill)
	{
		proto.circle.prototype.base.call(this,x,y,color,fill);
		this._radius=radius;
		return this;
	}
	this._proto='circle';
}
proto.circle.prototype=new proto.shape;
proto.rect=function(){
	this.draw=function(ctx)
	{
		ctx.rect(this._x, this._y, this._width, this._height);
	}
	this.base=function(x,y,width,height,color,fill)
	{
		proto.rect.prototype.base.call(this,x,y,color,fill);
		this._width=width;
		this._height=height;
		return this;
	}
	this._proto='rect';
}
proto.rect.prototype=new proto.shape;
proto.arc=function(){
	this.draw=function(ctx)
	{
		ctx.arc (this._x, this._y, this._radius, this._startAngle,this._endAngle,this._anticlockwise);
	}
	this.base=function(x,y,radius,startAngle,endAngle,anticlockwise,color,fill)
	{
		if(anticlockwise!==undefined)
		if(anticlockwise.charAt)color=anticlockwise;
		proto.arc.prototype.base.call(this,x,y,color,fill);
		this._radius=radius;
		this._startAngle=startAngle;
		this._endAngle=endAngle;
		this._anticlockwise=anticlockwise||true;
		return this;
	}
	this._proto='arc';
}
proto.arc.prototype=new proto.shape;
proto.text=function(){
	this.font=function(font)
	{
		return this.attr('font',font);
	}
	this._font="10px sans-serif";
	this.align=function(align)
	{
		return this.attr('align',align);
	}
	this._align="start";
	this.baseline=function(baseline)
	{
		return this.attr('baseline',baseline);
	}
	this._baseline="alphabetic";
	this.setOptns = function(ctx)
	{
		proto.text.prototype.setOptns.call(this,ctx);
		ctx.textBaseline=this._baseline;
		ctx.font=this._font;
		ctx.textAlign=this._align;
	}
	this.draw=function(ctx)
	{
		if(this._maxWidth==false)
		{
			if(this._fill){ctx.fillText(this._string,this._x,this._y);}
			else{ctx.strokeText(this._string,this._x,this._y);}
		}
		else
		{
			if(this._fill){ctx.fillText(this._string,this._x,this._y,this._maxWidth);}
			else{ctx.strokeText(this._string,this._x,this._y,this._maxWidth);}
		}
	}
	this.base=function(string,x,y,maxWidth,color,fill)
	{
		if (maxWidth!==undefined)
		{
			if (maxWidth.charAt)
			{
				if(color!==undefined)fill=color;
				color=maxWidth;
				maxWidth=false;
			}
		}
		proto.text.prototype.base.call(this,x,y,color,fill||1);
		this._string=string;
		this._maxWidth=maxWidth||false;
		return this;
	}
	this._proto='text';
}
proto.text.prototype=new proto.shape;

proto.grdntsnptrn=function()
{
	this.layer=function(idLayer)
	{
		return layer(idLayer,this,'grdntsnptrns');
	}
	this.canvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'grdntsnptrns');
	}
	var tmpObj=new proto.object;
	this.animate=tmpObj.animate;
	this.attr=tmpObj.attr;
	this.id=tmpObj.id;
	this.name=tmpObj.name;
	this.level=tmpObj.level;
	this.base=function()
	{
		this.animateQueue=[];
		this.optns={
			animated:false,
			name:"",
			layer:{id:canvases[0].optns.id+'Layer_0',number:0},
			canvas:{number:0},
			visible:true
		}
		this.optns.layer.id=canvases[lastCanvas].optns.id+'Layer_0';
		this.optns.layer.number=0
		this.optns.canvas.number=lastCanvas;
		var grdntsnptrnsArray=canvases[lastCanvas].layers[0].grdntsnptrns;
		this._level=grdntsnptrnsArray.length;
		grdntsnptrnsArray[this._level]=this;
		redraw(this);
	}
	return this;
}
proto.gradients=function()
{
	this.colorStopsCount=0;
	this.paramNames=['_pos','_colorR','_colorG','_colorB','_alpha'];
	this.addColorStop=function(pos,color){
		redraw(this);
		var colorKeeper = parseColor(color);
		var i=this.colorStopsCount;
		this['_pos'+i] = pos;
		this['_colorR'+i] = colorKeeper.colorR;
		this['_colorG'+i] = colorKeeper.colorG;
		this['_colorB'+i] = colorKeeper.colorB;
		this['_alpha'+i] = colorKeeper.alpha;
		this.colorStopsCount++;
		return this;
	}
	this.animate=function(parameters,duration,easing,onstep,fn){
		for(var key in parameters)
		{
			if(key.substr(0,5)=='color')
			{
				var i=key.substring(5);
				var colorKeeper=parseColor(parameters[key]);
				parameters['colorR'+i] = colorKeeper.colorR.val;
				parameters['colorG'+i] = colorKeeper.colorG.val;
				parameters['colorB'+i] = colorKeeper.colorB.val;
				parameters['alpha'+i] = colorKeeper.alpha.val;
			}
		}
		proto.gradients.prototype.animate.call(this,parameters,duration,easing,onstep,fn);
	}
	this.delColorStop=function(i)
	{
		redraw(this);
		var colorStops=this.colorStops();
		colorStops.splice(i,1);
		if(colorStops.length>0)this.colorStops(colorStops);
		else this.colorStopsCount=0;
		return this;
	}
	this.colorStops=function(array)
	{
		var names=this.paramNames;
		if(array===undefined){
			array=[];
			for(var j=0;j<this.colorStopsCount;j++)
			{
				array[j]=[];
				for(var i=0;i<names.length;i++)
					array[j][i]=this[names[i]+j];
			}
			return array;
		}
		redraw(this);
		var oldCount=this.colorStopsCount;
		var limit=array.length;
		if(array[0].length==2)
			for(j=0;j<limit;j++)
				this.addColorStop(array[j][0], array[j][1]);
		else
			for(j=0;j<limit;j++)
				for(i=0;i<names.length;i++)
					this[names[i]+j]=array[j][i];
		for(j=limit;j<oldCount;j++)
			for(i=0;i<names.length;i++)
				this[names[i]+j]=undefined;
		this.colorStopsCount=limit;
		return this;
	}
	this.base=function(colors)
	{
		proto.gradients.prototype.base.call(this);
		if (colors==undefined)
			return this;
		else return this.colorStops(colors);
	}
}
proto.gradients.prototype=new proto.grdntsnptrn;

proto.pattern = function()
{
	this.create = function(ctx)
	{
		if(this.optns.animated)animating.call(this);
		this.val = ctx.createPattern(this._img,this._type);
	}
	this.base=function(img,type)
	{
		proto.pattern.prototype.base.call(this);
		this._img=img;
		this._type=type||'repeat';
		return this;
	}
	this._proto='pattern';
}
proto.pattern.prototype=new proto.grdntsnptrn;
proto.lGradient=function()
{
	this.create = function(ctx)
	{
		if(this.optns.animated)animating.call(this);
		this.val=ctx.createLinearGradient(this._x1,this._y1,this._x2,this._y2);
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['_pos'+i],'rgba('+parseInt(this['_colorR'+i])+','+parseInt(this['_colorG'+i])+','+parseInt(this['_colorB'+i])+','+this['_alpha'+i]+')');
		}
	}
	this.base=function(x1,y1,x2,y2,colors)
	{
		proto.lGradient.prototype.base.call(this,colors);
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x2;
		this._y2 = y2;
		return this;
	}
	this._proto='lGradient';
}
proto.lGradient.prototype=new proto.gradients;
proto.rGradient=function()
{
	this.create = function(ctx)
	{
		if(this.optns.animated)animating.call(this);
		this.val=ctx.createRadialGradient(this._x1,this._y1,this._r1,this._x2,this._y2,this._r2);
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['_pos'+i],'rgba('+parseInt(this['_colorR'+i])+','+parseInt(this['_colorG'+i])+','+parseInt(this['_colorB'+i])+','+this['_alpha'+i]+')');
		}
	}
	this.base=function(x1,y1,r1,x2,y2,r2,colors)
	{
		proto.rGradient.prototype.base.call(this,colors);
		this._x1 = x1;
		this._y1 = y1;
		this._r1 = r1;
		this._x2 = x2;
		this._y2 = y2;
		this._r2 = r2;
		return this;
	}
	this._proto='rGradient';
}
proto.rGradient.prototype=new proto.gradients;

proto.layer=function()
{
	this.canvas=function(idCanvas)
	{
		if (idCanvas===undefined)return this.idCanvas;
		if(this.optns.canvas.id==idCanvas)return this;
		var newCanvas=-1,oldCanvas=0,limitC=canvases.length;
		for(var i=0;i<limitC;i++)
		{
			var idCanvasItem=canvases[i].optns.id;
			if (idCanvasItem==idCanvas)newCanvas=i;
			if (idCanvasItem==this.optns.canvas.id)oldCanvas=i;
		}
		if(newCanvas<0){newCanvas=canvases.length;jCanvaScript.canvas(idCanvas);}
		this.optns.canvas.id=idCanvas;
		this.optns.canvas.number=newCanvas;
		canvases[oldCanvas].layers.splice(this._level,1);
		var layersArray=canvases[newCanvas].layers;
		this._level=layersArray.length;
		layersArray[this._level]=this;
		for(i=0;i<this.objs.length;i++)
		{
			var optns=this.objs[i].optns;
			optns.layer.number=this._level;
			optns.canvas.number=newCanvas;
		}
		canvases[this.optns.canvas.number].optns.redraw=1;
		return this;
	}
	this.up=function(n)
	{
		if(n === undefined)n=1;
		if(n == 'top')n=objs[this._layer].length-1;
		this._level+=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].optns.layer.number=this._level;
		}
		var optns=canvases[this.optns.canvas.number].optns;
		optns.anyLayerLevelChanged = true;
		optns.redraw=1;
		return this;
	}
	this.down=function(n)
	{
		if(n == undefined)n=1;
		if(n == 'bottom')n=this._level;
		this._level-=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].options.layer.number=this._level;
		}
		var optns=canvases[this.optns.canvas.number].optns;
		optns.anyLayerLevelChanged = true;
		optns.redraw=1;
		return this;
	}
	this.del=function()
	{
		var optns=canvases[this.optns.canvas.number].optns;
		optns.anyLayerDeleted = true;
		this.draw = false;
		optns.redraw=1;
		return;
	}
	this.setOptns=function(ctx)
	{
		ctx.setTransform(1,0,0,1,0,0);
		proto.layer.prototype.setOptns.call(this,ctx);
		return this;
	}
	this.afterDraw=function(optns)
	{
		optns.ctx.closePath();
		optns.ctx.restore();
		if(this.optns.clipObject)
		{
			proto.layer.prototype.afterDraw.call(this.optns.clipObject,optns);
		}
	}
	this.clone=function(idLayer,params)
	{
		var clone=jCanvaScript.layer(idLayer);
		take(clone,this);
		clone.canvas(canvases[this.optns.canvas.number].optns.id);
		if(params===undefined) return clone;
		return clone.animate(params);
	}
	this.isPointIn=function(x,y,global)
	{
		for(var i=0;i<this.objs.length;i++)
			if(this.objs[i].isPointIn(x,y,global))
				return true;
		return false;
	}
	this.draw=function(canvasOptns)
	{
		var limitGrdntsNPtrns = this.grdntsnptrns.length;
		var limit=this.objs.length;
		for(var i=0;i<limitGrdntsNPtrns;i++)
		{
			this.grdntsnptrns[i].create(canvasOptns.ctx);
		}
		if(this.optns.anyObjLevelChanged)
		{
			levelChanger(this.objs);
			this.optns.anyObjLevelChanged = false;
		}
		if(this.optns.anyObjDeleted)
		{
			limit=objDeleter(this.objs);
			this.optns.anyObjDeleted = false;
		}
		canvasOptns.ctx.globalCompositeOperation = this.optns.gCO;
		for(i=0;i<limit;i++)
		{
			var object=this.objs[i];
			if(typeof (object.draw)=='function')
			{
				this.setOptns(canvasOptns.ctx);
				if(object.beforeDraw(canvasOptns.ctx))
				{
					if(typeof (object.draw)=='function')
					{
						object.draw(canvasOptns.ctx);
						object.afterDraw(canvasOptns);
					}
				}
			}
		}
	}
	this.base=function(idLayer)
	{
		var lastCanvasLayers=canvases[lastCanvas].layers,lastCanvasOptns=canvases[lastCanvas].optns;
		proto.layer.prototype.base.call(this,0,0,true);
		var limit=lastCanvasLayers.length;
		lastCanvasLayers[limit]=this;
		this.objs = [];
		this.grdntsnptrns = [];
		this._level=limit;
		this.optns.id=idLayer;
		var thisOptns=this.optns
		thisOptns.anyObjDeleted= false;
		thisOptns.anyObjLevelChanged= false;
		thisOptns.gCO= lastCanvasOptns.gCO;
		thisOptns.canvas.id=lastCanvasOptns.id;
		thisOptns.canvas.number=lastCanvas;
		return this;
	}
	this._proto='layer';
}
proto.layer.prototype=new proto.object;
function layers(idLayer)
{
	var layer=new proto.layer();
	return layer.base(idLayer);
}

proto.imageData=function()
{
	this.setPixel=function(x,y,color)
	{
		var colorKeeper = parseColor(color);
		var index=(x + y * this._width) * 4;
		this.data[index+0] = colorKeeper.colorR;
		this.data[index+1] = colorKeeper.colorG;
		this.data[index+2] = colorKeeper.colorB;
		this.data[index+3] = colorKeeper.alpha*255;
		redraw(this);
		return this;
	}
	this.getPixel=function(x,y)
	{
		var index=(x + y * this._width) * 4;
		return [this.data[index+0],this.data[index+1],this.data[index+2],this.data[index+3]/255];
	}
	this._getX=0;
	this._getY=0;
	this.getData=function(x,y,width,height)
	{
		this._getX=x;
		this._getY=y;
		this._width=width;
		this._height=height;
		var ctx=canvases[this.optns.canvas.number].optns.ctx;
		try{
				this.imgData=ctx.getImageData(this._getX,this._getY,this._width,this._height);
			}catch(e){
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				this.imgData=ctx.getImageData(this._getX,this._getY,this._width,this._height);
		}
		this.data=this.imgData.data;
		redraw(this);
		return this;
	}
	this.putData=function(x,y)
	{
		if(x!==undefined)this._x=x;
		if(y!==undefined)this._y=y;
		this._putData=true;
		redraw(this);
		return this;
	}
	this.draw=function(ctx)
	{
		if(this.imgData===undefined)
		{
			this.imgData=ctx.createImageData(this._width,this._height);
			for(var i=0;i<this._width*this._height*4;i++)
				this.imgData.data[i]=this.data[i];
			this.data=this.imgData.data;
		}
		if(this._putData)
			ctx.putImageData(this.imgData,this._x,this._y);
	}
	this.base=function(width,height)
	{
		proto.imageData.prototype.base.call(this);
		if(height===undefined)
		{
			var oldImageData=width;
			width=oldImageData._width;
			height=oldImageData._height;
		}
		this._width=width;
		this._height=height;
		this.data=[];
		for(var i=0;i<this._width;i++)
			for(var j=0;j<this._height;j++)
			{
				var index=(i+j*this._width)*4;
				this.data[index+0]=0;
				this.data[index+1]=0;
				this.data[index+2]=0;
				this.data[index+3]=0;
			}
		return this;
	}
	this._putData=false;
	this._proto='imageData';
}
proto.imageData.prototype=new proto.object;
proto.image=function()
{
	this.draw=function(ctx)
	{
		if(this._swidth==false && this._dx==false){ctx.drawImage(this._img,this._sx,this._sy);}
		else{if(this._dx==false)ctx.drawImage(this._img,this._sx,this._sy,this._swidth,this._sheight);
			else ctx.drawImage(this._img,this._sx,this._sy,this._swidth,this._sheight,this._dx,this._dy,this._dwidth,this._dheight);}
	}
	this.base=function(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight)
	{
		proto.image.prototype.base.call(this);
		this._img=img;
		this._swidth=swidth||false;
		this._sheight=sheight||false;
		this._sx=sx;
		this._sy=sy;
		this._dx=dx||false;
		this._dy=dy||false;
		this._dwidth=dwidth||false;
		this._dheight=dheight||false;
		return this;
	}
	this._proto='image';
}
proto.image.prototype=new proto.object;

proto.groups=function()
{
	for(var Class in proto)
	{
		if(Class=='group'||Class=='groups')continue;
		var tmp=new proto[Class];
		for(var key in tmp)
		{
			if(typeof tmp[key]=='function' && this[key]===undefined)
			{
				(function(group,key)
				{
				group[key]=function(){
					var argumentsClone=[];
					var args=[];
					var i=0;
					while(arguments[i]!==undefined)
						args[i]=arguments[i++];
					for(i=0;i<this.elements.length;i++)
					{
						var element=this.elements[i];
						take(argumentsClone,args);
						if(typeof element[key]=='function')
						{
							element[key].apply(element,argumentsClone);
						}
					}
					return this;
				}
				})(this,key);
			}
		}
	}
	this.base=function(){
		this.elements=[];
		return this;
	}
}
proto.group=function()
{
	this._proto='group';
};
proto.group.prototype=new proto.groups;
function group()
{
	var group=new proto.group;
	return group.base();
}


jCanvaScript.addObject=function(name,parameters,drawfn)
{
	proto[name]=function(name){
		this.draw=proto[name].draw;
		this.base=proto[name].base;
		this._proto=name;
	};
	var protoItem=proto[name];
	protoItem.prototype=new proto.shape;
	protoItem.draw=drawfn;
	protoItem.base=function(name,parameters,args)
	{
		protoItem.prototype.base.call(this,parameters.x||0,parameters.y||0,parameters.color||"rgba(0,0,0,0)",parameters.fill||1);
		var i=0;
		for(var key in parameters)
		{
			this['_'+key]=args[i]||parameters[key];
			if(key=='color')this.color(args[i]||parameters[key]);
			i++;
		}
		return this;
	}
	jCanvaScript[name]=function()
	{
		var name=arguments.callee.val;
		var object=new proto[name](name);
		return object.base(name,arguments.callee.parameters,arguments);
	}
	jCanvaScript[name].val=name;
	jCanvaScript[name].parameters=parameters;
}
jCanvaScript.addAnimateFunction=function(name,fn)
{
	animateFunctions[name]=fn;
}
jCanvaScript.clear=function(idCanvas)
{
	if(canvases[0]===undefined)return;
	if(idCanvas===undefined){canvases[0].clear();return;}
	jCanvaScript.canvas(idCanvas).clear();
}
jCanvaScript.pause=function(idCanvas)
{
	if(idCanvas===undefined){canvases[0].pause();return;}
	jCanvaScript.canvas(idCanvas).pause();
}
jCanvaScript.start=function(idCanvas,fps)
{
	jCanvaScript.canvas(idCanvas).start(fps);
}



jCanvaScript.pattern = function(img,type)
{
	var pattern = new proto.pattern;
	return pattern.base(img,type);
}

jCanvaScript.lGradient=function(x1,y1,x2,y2,colors)
{
	var lGrad = new proto.lGradient;
	return lGrad.base(x1,y1,x2,y2,colors);
}
jCanvaScript.rGradient=function(x1,y1,r1,x2,y2,r2,colors)
{
	var rGrad = new proto.rGradient;
	return rGrad.base(x1,y1,r1,x2,y2,r2,colors);
}

jCanvaScript.line=function(points,color,fill)
{
	var line = new proto.line;
	return line.base(points,color,fill);
}
jCanvaScript.qCurve=function(points,color,fill)
{
	var qCurve = new proto.qCurve;
	return qCurve.base(points,color,fill);
}
jCanvaScript.bCurve=function(points,color,fill)
{
	var bCurve = new proto.bCurve;
	return bCurve.base(points,color,fill);
}

jCanvaScript.imageData=function(width,height)
{
	var imageData=new proto.imageData;
	return imageData.base(width,height);
}
jCanvaScript.image=function(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight)
{
	var image=new proto.image;
	return image.base(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight);
}

jCanvaScript.circle=function(x,y,radius,color,fill)
{
	var circle=new proto.circle;
	return circle.base(x,y,radius,color,fill);
}
jCanvaScript.rect=function(x,y,width,height,color,fill)
{
	var rect = new proto.rect;
	return rect.base(x,y,width,height,color,fill);
}
jCanvaScript.arc=function(x,y,radius,startAngle,endAngle,anticlockwise,color,fill)
{
	var arc=new proto.arc;
	return arc.base(x,y,radius,startAngle,endAngle,anticlockwise,color,fill);
}
jCanvaScript.text = function(string,x,y,maxWidth,color,fill)
{
	var text=new proto.text;
	return text.base(string,x,y,maxWidth,color,fill);
}


jCanvaScript.canvas = function(idCanvas)
{
	if(idCanvas===undefined)return canvases[0];
	var limit=canvases.length;
	for (var i=0;i<limit;i++)
		if(canvases[i].optns.id==idCanvas)return canvases[i];
	var canvas={
		id:function(id)
		{
			if(id===undefined)return this.optns.id;
			this.optns.id=id;
			return this;
		}
	};
	canvases[limit]=canvas;
	lastCanvas=limit;
	canvas.cnv=document.getElementById(idCanvas);
	if ('\v'=='v')G_vmlCanvasManager.initElement(canvas.cnv);
	canvas.optns =
	{
		id:idCanvas,
		number:lastCanvas,
		ctx: canvas.cnv.getContext('2d'),
		width: canvas.cnv.offsetWidth,
		height: canvas.cnv.offsetHeight,
		anyLayerDeleted: false,
		anyLayerLevelChanged:false,
		keyDown:{val:false,code:false},
		keyUp:{val:false,code:false},
		keyPress:{val:false,code:false},
		mousemove:{val:false,x:false,y:false,object:false},
		click:{val:false,x:false,y:false,object:false},
		dblclick:{val:false,x:false,y:false,object:false},
		mouseup:{val:false,x:false,y:false,object:false},
		mousedown:{val:false,x:false,y:false,object:false},
		drag:{object:false,x:0,y:0},
		gCO: 'source-over',
		redraw:1
	}
	canvas.toDataURL=function(){return canvas.cnv.toDataURL.apply(canvas.cnv,arguments);}
	canvas.layers=[];
	canvas.interval=0;
	jCanvaScript.layer(idCanvas+'Layer_0').canvas(idCanvas);
	canvas.start=function(fps)
	{
		lastCanvas=this.layers[0].optns.canvas.number;
		if(fps)
		{
			if(this.interval)return this;
			this.fps=fps;
			var offset=getOffset(this.cnv);
			this.optns.x=offset.left;
			this.optns.y=offset.top;
			var canvas=canvases[this.optns.number];
			this.cnv.onclick=function(e){
				if(!canvas.optns.click.val)return;
				mouseEvent(e,'click',canvas.optns);
			};
			this.cnv.ondblclick=function(e){
				if(!canvas.optns.dblclick.val)return;
				mouseEvent(e,'dblclick',canvas.optns);
			}
			this.cnv.onmousedown=function(e){
				if(!canvas.optns.mousedown.val)return;
				mouseEvent(e,'mousedown',canvas.optns);
			};
			this.cnv.onmouseup=function(e){
				if(!canvas.optns.mouseup.val)return;
				mouseEvent(e,'mouseup',canvas.optns);
			};
			this.cnv.onkeyup=function(e){
				keyEvent(e,'keyUp',canvas.optns);
			}
			this.cnv.onkeydown=function(e)
			{
				keyEvent(e,'keyDown',canvas.optns);
			}
			this.cnv.onkeypress=function(e)
			{
				keyEvent(e,'keyPress',canvas.optns);
			}
			this.cnv.onmouseout=this.cnv.onmousemove=function(e)
			{
				if(!canvas.optns.mousemove.val)return;
				mouseEvent(e,'mousemove',canvas.optns);
				if(canvas.optns.drag.object!=false)
				{
					var drag=canvas.optns.drag;
					var point=transformPoint(canvas.optns.mousemove.x,canvas.optns.mousemove.y,drag.object.matrix());
					drag.object.transform(1,0,0,1,point.x-drag.x,point.y-drag.y);
					if(drag.fn)drag.fn.call(drag.object,({x:canvas.optns.mousemove.x,y:canvas.optns.mousemove.y}));
				}
			};
			this.interval=setInterval(function(){jCanvaScript.canvas(idCanvas).frame();},this.fps);
		}
		else this.frame();
		return this;
	}
	canvas.pause=function()
	{
		clearInterval(this.interval);
		this.interval=0;
	}
	canvas.clear=function()
	{
		clearInterval(this.interval);
		this.interval=0;
		this.layers=[];
		jCanvaScript.layer(this.optns.id+'Layer_0').canvas(this.optns.id);
		this.optns.ctx.clearRect(0,0,this.optns.width,this.optns.height);
		this.optns.redraw++;
		return this;
	}
	canvas.frame=function()
	{
		var optns=this.optns;
		if(!optns.redraw)return;
		optns.redraw--;
		optns.ctx.clearRect(0,0,optns.width,optns.height);
		var limit=this.layers.length;
		if(limit==0)return;
		if(optns.anyLayerLevelChanged)
		{
			levelChanger(this.layers);
			optns.anyLayerLevelChanged=false;
		}
		if(optns.anyLayerDeleted)
		{
			limit=objDeleter(this.layers);
			optns.anyLayerDeleted=false;
		}
		for(var i=0;i<limit;i++)
		{
			var object=this.layers[i];
			if(typeof (object.draw)=='function')
				if(object.beforeDraw(optns.ctx))
				{
					if(typeof (object.draw)=='function')
					{
						object.draw(optns);
						object.afterDraw(optns);
					}
				}
		}
		if(optns.mousemove.x!=false)
		{
			if(optns.mousemove.object!=false)
			{
				var mousemoveObject=optns.mousemove.object;
				if(underMouse===mousemoveObject)
				{
					if(typeof mousemoveObject.onmousemove=='function')
					{
						mousemoveObject.onmousemove(this.optns.point);
					}
				}
				else
				{
					if(underMouse==false)
					{
						if(typeof mousemoveObject.onmouseover=='function'){mousemoveObject.onmouseover();}
					}
					else
					{
						if(typeof underMouse.onmouseout=='function'){underMouse.onmouseout();}
						if(typeof mousemoveObject.onmouseover=='function'){mousemoveObject.onmouseover();}
					}
					underMouse=mousemoveObject;
				}
			}
			else
			{
				if(underMouse!==false)
				{
					if(typeof underMouse.onmouseout=='function')
					{
						underMouse.onmouseout();
					}
					underMouse=false;
				}
			}
		}
		if(optns.mousedown.object!=false)
		{
			var mouseDown=this.optns.mousedown;
			var mouseDownObjects=[mouseDown.object,objectLayer(mouseDown.object)];
			for(i=0;i<2;i++)
			{
				if(typeof mouseDownObjects[i].onmousedown=='function')mouseDownObjects[i].onmousedown({x:mouseDown.x,y:mouseDown.y});
				if(mouseDownObjects[i].optns.drag.val==true)
				{
					var drag=optns.drag;
					drag.object=mouseDownObjects[i].optns.drag.object.visible(true);
					drag.fn=mouseDownObjects[i].optns.drag.fn;
					drag.init=mouseDownObjects[i];
					if(drag.init.optns.drag.params!==undefined)drag.object.animate(drag.init.optns.drag.params);
					var point=transformPoint(mouseDown.x,mouseDown.y,drag.object.matrix());
					drag.x=point.x;
					drag.y=point.y;
					if(drag.object!=drag.init && drag.init.optns.drag.type!='clone')
					{
						point.x=-drag.object._x+point.x;
						point.y=-drag.object._y+point.y;
						drag.x-=point.x;
						drag.y-=point.y;
						drag.object.transform(1,0,0,1,point.x,point.y);
					}
					drag.object._transformdx+=drag.init.optns.drag.shiftX;
					drag.object._transformdy+=drag.init.optns.drag.shiftY;
				}
			}
			mouseDown.object=false;
		}
		if(optns.mouseup.object!=false)
		{
			var mouseUp=optns.mouseup;
			var mouseUpObjects=[mouseUp.object,objectLayer(mouseUp.object)];
			drag=optns.drag;
			for(i=0;i<2;i++)
			{
				if(typeof mouseUpObjects[i].onmouseup=='function')mouseUpObjects[i].onmouseup({x:mouseUp.x,y:mouseUp.y});
				if(mouseUpObjects[i].optns.drop.val==true && optns.drag.init!==undefined)
				{
					if(drag.init==drag.object)
						drag.init.visible(true);
					if(typeof mouseUpObjects[i].optns.drop.fn=='function')mouseUpObjects[i].optns.drop.fn.call(mouseUpObjects[i],drag.init);
					this.optns.drag={object:false,x:0,y:0};
				}
				else
				{
					if(drag.init!==undefined)
					{
						drag.object.visible(false);
						drag.init.visible(true);
						drag.init._transformdx=drag.object._transformdx;
						drag.init._transformdy=drag.object._transformdy;
						if(drag.object!=drag.init)drag.object.visible(false);
						this.optns.drag={object:false,x:0,y:0};
					}
				}
			}
			mouseUp.object=false;
		}
		if(this.optns.click.object!=false)
		{
			var mouseClick=this.optns.click;
			var mouseDblClick=this.optns.dblclick;
			var mouseClickObjects=[mouseClick.object,objectLayer(mouseClick.object)];
			for(i=0;i<2;i++)
			{
				if(typeof mouseClickObjects[i].onclick == 'function')
					mouseClickObjects[i].onclick({x:mouseClick.x,y:mouseClick.y});
				if(typeof mouseClickObjects[i].ondblclick == 'function')
					mouseClickObjects[i].ondblclick({x:mouseDblClick.x,y:mouseDblClick.y});
			}
			mouseClick.object=false;
		}
		this.optns.mousemove.object=this.optns.keyUp.val=this.optns.keyDown.val=this.optns.keyPress.val=this.optns.click.x=this.optns.dblclick.x=this.optns.mouseup.x=this.optns.mousedown.x=this.optns.mousemove.x=false;
	}
	return canvas;
}

jCanvaScript.layer=function(idLayer)
{
	if(idLayer===undefined)return canvases[0].layers[0];
	var limit=0;
	for(var i=0;i<canvases.length;i++)
	{
		var canvas=canvases[i];
		limit=canvas.layers.length;
		for (var j=0;j<limit;j++)
		{
			var layer=canvas.layers[j];
			if(layer.optns.id==idLayer)return layer;
		}
	}
	return layers(idLayer);
}

window.jCanvaScript=window.jc=jCanvaScript;})();