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
	optns.redraw++;
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
	optns.redraw++;
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
	if(object.objs!==undefined || object._img!==undefined)
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
	if(ctx.isPointInPath===undefined || object._img!==undefined || object._imgData!==undefined)
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
	var x=optns.mousemove.x||optns.mousedown.x||optns.mouseup.x||optns.click.x;
	var y=optns.mousemove.y||optns.mousedown.y||optns.mouseup.y||optns.click.y;
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
		if(optns.click.x!=false)
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
	canvases[oldIndex.i].layers[oldIndex.j][array].splice(object._level,1);
	normalizeLevels(canvases[oldIndex.i].layers[oldIndex.j][array]);
	object._level=canvases[newIndex.i].layers[newIndex.j][array].length;
	canvases[newIndex.i].layers[newIndex.j][array][object._level]=object;
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
		if(canvases[i].optns.id==idCanvas)
		{
			canvases[oldIndex.i].layers[oldIndex.j][array].splice(object._level,1);
			normalizeLevels(canvases[oldIndex.i].layers[oldIndex.j][array]);
			object._level=canvases[i].layers[0][array].length;
			canvases[i].layers[0][array][object._level]=object;
			objectLayer.number=0;
			objectCanvas.number=i;
			objectCanvas.id=canvases[i].optns.id;
			objectLayer.id=canvases[i].layers[0].optns.id;
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
