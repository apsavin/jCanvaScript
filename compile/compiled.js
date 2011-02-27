/*!
 * jCanvaScript JavaScript Library v 1.0
 * http://jcscript.com/
 *
 * Copyright 2010, Alexander Savin
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(){
var canvases = [];
var pi=Math.PI*2;
var lastCanvas=0;
var lastLayer=0;
var underMouse = false;
var jCanvaScript=function(stroke,map)
{
	if(stroke===undefined)return this;
	if(typeof stroke=='object')
	{
		map=stroke;
		stroke=undefined;
	}
	var canvas=-1;
	var layer=-1;
	var limitC=canvases.length;
	var limitL=0;
	var limit=0;
	if (map===undefined)
	{
		if(stroke.charAt(0)=='#')
		{
			for(i=0;i<limitC;i++)
			{
				limitL=canvases[i].layers.length;
				for (j=0;j<limitL;j++)
				{
					limit=canvases[i].layers[j].objs.length;
					for(var k=0;k<limit;k++)
						if('#'+canvases[i].layers[j].objs[k].id.val==stroke)return canvases[i].layers[j].objs[k];
				}
			}
		}
		if(stroke.charAt(0)=='.')
		{
			var myGroup=group();
			for(var i=0;i<limitC;i++)
			{
				limitL=canvases[i].layers.length;
				for (var j=0;j<limitL;j++)
				{
					limit=canvases[i].layers[j].objs.length;
					for(var k=0;k<limit;k++)
						if(('.'+canvases[i].layers[j].objs[k].name.val)==stroke)myGroup.elements[myGroup.elements.length]=canvases[i].layers[j].objs[k];;
				}
			}
			return myGroup;
		}
	}
	else
	{
		if(map.canvas!==undefined)
		{
			for(var i=0;i<limitC;i++)
				if(canvases[i].id.val==map.canvas){canvas=i;break;}
		}
		if(map.layer!==undefined)
		{
			if(canvas!=-1)
			{
				limit=canvases[canvas].layers.length;
				for(var i=0;i<limit;i++)
					if(canvases[canvas].layers[i].id.val==map.layer){layer=i;break;}
			}
			else
			{
				for(var i=0;i<limitC;i++)
				{
					limit=canvases[i].layers.length;
					for (var j=0;j<limit;j++)
					{
						if(canvases[i].layers[j].id.val==map.layer){canvas=i;layer=j;break;}
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
				var myGroup=group();
				for (var j=0;j<limitL;j++)
				{
					limit=canvases[canvas].layers[j].objs.length;
					for(var k=0;k<limit;k++)
						myGroup.elements[myGroup.elements.length]=canvases[canvas].layers[j].objs[k];
				}
				return myGroup;
			}
			if(stroke.charAt(0)=='#')
			{
				for (var j=0;j<limitL;j++)
				{
					limit=canvases[canvas].layers[j].objs.length;
					for(var k=0;k<limit;k++)
						if('#'+canvases[canvas].layers[j].objs[k].id.val==stroke)return canvases[canvas].layers[j].objs[k];
				}
			}
			if(stroke.charAt(0)=='.')
			{
				var myGroup=group();
				for (var j=0;j<limitL;j++)
				{
					limit=canvases[canvas].layers[j].objs.length;
					for(var k=0;k<limit;k++)
						if(('.'+canvases[canvas].layers[j].objs[k].name.val)==stroke)myGroup.elements[myGroup.elements.length]=canvases[canvas].layers[j].objs[k];
				}
				return myGroup;
			}
		}
		else
		{
			if(stroke===undefined)
			{
				var myGroup=group();
				limit=canvases[canvas].layers[layer].objs.length;
				for(var k=0;k<limit;k++)
					myGroup.elements[myGroup.elements.length]=canvases[canvas].layers[layer].objs[k];
				return myGroup;
			}
			if(stroke.charAt(0)=='#')
			{
				limit=canvases[canvas].layers[layer].objs.length;
				for(var k=0;k<limit;k++)
					if('#'+canvases[canvas].layers[layer].objs[k].id.val==stroke)return canvases[canvas].layers[layer].objs[k];
			}
			if(stroke.charAt(0)=='.')
			{
				var myGroup=group();
				limit=canvases[canvas].layers[layer].objs.length;
				for(var k=0;k<limit;k++)
					if(('.'+canvases[canvas].layers[layer].objs[k].name.val)==stroke)myGroup.elements[myGroup.elements.length]=canvases[canvas].layers[layer].objs[k];
				return myGroup;
			}
		}
	}
}
/**/

function redraw(object)
{
	var canvas=canvases[object.canvas.number];
	if(canvas.optns.redraw<2)canvas.optns.redraw++;
}

function animating()
{
	if (!this.animate.val)return false;
	var i=0;
	var fnlimit=this.fn.length;
	var progress=1;
	for(var key in this)
	{
		if(this.hasOwnProperty(key))
		{
			i++;
			if(this[key]===undefined)continue;
			if(this[key]['from']!==undefined)
			{
				var property=this[key];
				var step=property['step'];
				var duration=property['duration'];
				var easing=property['easing'];
				var to=property['to'];
				var from=property['from'];
				var val=property['val'];
				property['step']++;
				progress=step/duration;
				if(easing['type']=='in' || (easing['type']=='inOut' && progress<0.5))property['val']=(to-from)*animateFunctions[easing['fn']](progress,easing)+from;
				if(easing['type']=='out' || (easing['type']=='inOut' && progress>0.5))property['val']=(to-from)*(1-animateFunctions[easing['fn']](1-progress,easing))+from;
				if(property['onstep'])property['onstep'].fn.call(this,property['onstep']);
				if(key=='rotateAngle'){this.rotate(val-property['prev'],this.rotateX.val,this.rotateY.val);property['prev']=val;}
				if(key=='translateX'){this.translate(val-property['prev'],0);property['prev']=val;}
				if(key=='translateY'){this.translate(0,val-property['prev']);property['prev']=val;}
				if(key=='scaleX'){this.scale(val-property['prev'],0);property['prev']=val;}
				if(key=='scaleY'){this.scale(0,val-property['prev']);property['prev']=val;}
				if(step>duration)
				{
					property['from']=undefined;
					property['val']=to;
					if(key=='rotateAngle'){this.rotate(val-property['prev'],this.rotateX.val,this.rotateY.val);}
					if(key=='translateX'){this.translate(val-property['prev'],0);}
					if(key=='translateY'){this.translate(0,val-property['prev']);}
					if(key=='scaleX'){this.scale(val-property['prev'],0);}
					if(key=='scaleY'){this.scale(0,val-property['prev']);}
					for(var j=0;j<fnlimit;j++)
					{
						var fn=this.fn[j];
						if(fn[key])
						{
							fn[key]=false;
							fn.count--;
						}
					}
				}
			}
			else
			{
				for(j=0;j<fnlimit;j++)
				{
					fn=this.fn[j];
					if(fn['func'] != 0 && !fn['count'] && fn.enabled)
					{
						fn.enabled=false;
						fn['func'].apply(this);
					}
				}
				i--;
			}
		}
	}
	if (i==0)
	{
		this.animate.val=false;
	}
	else redraw(this);
	return this;
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
	var point= {pageX:e.pageX||e.clientX,
				pageY:e.pageY||e.clientY};
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
	canvases[this.canvas.number].optns[eventName].val=true;
	return this;
}
function setKeyEvent(fn,eventName)
{
	if(fn===undefined)this[eventName]();
	else this[eventName] = fn;
	return this;
}
var animateFunctions={
	linear:function(progress,params){return progress;},
	exp:function(progress,params){var n=params.n||2;return Math.pow(progress,n);},
	circ:function(progress,params){return 1 - Math.sqrt(1-progress*progress);},
	sine:function(progress,params){return 1 - Math.sin((1 - progress) * Math.PI/2);},
	back:function(progress,params){var n=params.n||2;var x=params.x||1.5;return Math.pow(progress, n) * ((x + 1) * progress - x);},
	elastic:function(progress,params){var n=params.n||2;var m=params.m||20;var k=params.k||3;var x=params.x||1.5;return Math.pow(n,10 * (progress - 1)) * Math.cos(m * progress * Math.PI * x / k);},
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
	if(object.img!==undefined)
	{
		points.x=object.sx.val;
		points.y=object.sy.val;
		points.width=object.img.val.width;
		points.height=object.img.val.height;
		return points;
	}
	if(object.width!==undefined && object.height!==undefined)
	{
		points.x=object.x.val;
		points.y=object.y.val;
		points.width=object.width.val;
		points.height=object.height.val;
		return points;
	}
	if(object.radius!==undefined)
	{
		if(object.startAngle===undefined)
		{
			points.x=object.x.val-object.radius.val;
			points.y=object.y.val-object.radius.val;
			points.width=points.height=object.radius.val*2;
			return points;
		}
	}
	if(object.shapesCount!==undefined)
	{
		var minX;
		var minY;
		var maxX=minX=object.x.val;
		var maxY=minY=object.y.val;
		for(var i=1;i<object.shapesCount;i++)
		{
			if(maxX<object['x'+i].val)maxX=object['x'+i].val;
			if(maxY<object['y'+i].val)maxY=object['y'+i].val;
			if(minX>object['x'+i].val)minX=object['x'+i].val;
			if(minY>object['y'+i].val)minY=object['y'+i].val;
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
	if(object.objs!==undefined || object.img!==undefined)
	{
		var rect=getObjectRectangle(object);
		point.x=(rect.x*2+rect.width)/2;
		point.y=(rect.y*2+rect.height)/2;
		return point;
	}
	if(object.width!==undefined && object.height!==undefined)
	{
		point.x=(object.x.val*2+object.width.val)/2;
		point.y=(object.y.val*2+object.height.val)/2;
		return point;
	}
	if(object.radius!==undefined)
	{
		point.x=object.x.val;
		point.y=object.y.val;
		return point;
	}
	if(object.shapesCount!==undefined)
	{
		point.x=object.x.val;
		point.y=object.y.val;
		for(var i=1;i<object.shapesCount;i++)
		{
			point.x+=object['x'+i].val;
			point.y+=object['y'+i].val;
		}
		point.x=point.x/object.shapesCount;
		point.y=point.y/object.shapesCount;
		return point;
	}
	return false;
}
function parseColor(color)
{
	var colorKeeper={color:{val:color,notColor:undefined},colorR:{val:0},colorB:{val:0},colorG:{val:0},alpha:{val:0}};
	if(color.id!==undefined)
	{
		colorKeeper.color.notColor={level:color.level.val,
									canvas:color.canvas.number,
									layer:color.layer.number}
		return colorKeeper;
	}
	if(color.charAt(0)=='#')
	{
		colorKeeper.colorR.val=parseInt(color.substr(1,2),16);
		colorKeeper.colorG.val=parseInt(color.substr(3,2),16);
		colorKeeper.colorB.val=parseInt(color.substr(5,2),16);
		colorKeeper.alpha.val=1;
	}
	else
	{
		var arr=color.split(',');
		if(arr.length==4)
		{
			var colorR = arr[0].split('(');
			var alpha = arr[3].split(')');
			colorKeeper.colorR.val=parseInt(colorR[1]);
			colorKeeper.colorG.val=parseInt(arr[1]);
			colorKeeper.colorB.val=parseInt(arr[2]);
			colorKeeper.alpha.val=parseFloat(alpha[0]);
		}
		if(arr.length==3)
		{
			colorR = arr[0].split('(');
			var colorB = arr[2].split(')');
			colorKeeper.colorR.val=parseInt(colorR[1]);
			colorKeeper.colorG.val=parseInt(arr[1]);
			colorKeeper.colorB.val=parseInt(colorB[0]);
			colorKeeper.alpha.val=1;
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
    return {top: top, left: left}
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
    return {top: Math.round(top), left: Math.round(left)}
}
function checkEvents(object,optns)
{
	checkMouseEvents(object,optns);
	checkKeyboardEvents(object,optns);
}
function checkKeyboardEvents(object,optns)
{
	if(!object.focus.val)return;
	if(optns.keyDown.val!=false)if(typeof object.onkeydown=='function')object.onkeydown(optns.keyDown);
	if(optns.keyUp.val!=false)if(typeof object.onkeyup=='function')object.onkeyup(optns.keyUp);
	if(optns.keyPress.val!=false)if(typeof object.onkeypress=='function')object.onkeypress(optns.keyPress);
}
function isPointInPath(object,x,y)
{
	var point={};
	var ctx=canvases[object.canvas.number].optns.ctx;
	point.x=x;
	point.y=y;
	if(ctx.isPointInPath===undefined || object.img!==undefined || object.imgData!==undefined)
	{
		var rectangle=getObjectRectangle(object);
		point=transformPoint(x,y,object.matrix());
		if(rectangle.x<=point.x && rectangle.y<=point.y && (rectangle.x+rectangle.width)>=point.x && (rectangle.y+rectangle.height)>=point.y)return point;
	}
	else
	{
		if (!(navigator.appName != "Mozilla" && navigator.appName != "Netscape"))
		{
			ctx.save();
			ctx.setTransform(1,0,0,1,0,0);
			if(ctx.isPointInPath(point.x,point.y)){
				ctx.restore();
				return point;
			}
			ctx.restore();
		}
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

function group()
{
	var group={};
	var tmpObj=shapes();
	group.elements = [];
	group.functionNames=[];
	for(var key in tmpObj)
	{
		if(typeof tmpObj[key]=='function')
		{
			group[key]=function()
			{
				for(var i=0;i<group.elements.length;i++)
				{
					if(typeof group.elements[i][arguments.callee.val]=='function')
					{
						var args=[];
						for(var j=0;j<arguments.length;j++)
						{
							if(typeof arguments[j]!='object')args[j]=arguments[j];
							else
							{
								args[j]={};
								for(var arg in arguments[j])args[j][arg]=arguments[j][arg];
							}
						}
						group.elements[i][arguments.callee.val](args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
					}
				}
				return this;
			}
			group[key].val=key;
		}
		key=undefined;
	}
	return group;
}


function layer(idLayer,object,array)
{
	redraw(object);
	if (idLayer===undefined)return object.layer.val;
	if(object.layer.val==idLayer)return object;
	var oldIndex={i:object.canvas.number,j:object.layer.number};
	object.layer.val=idLayer;
	var newLayer=jCanvaScript.layer(idLayer);
	var newIndex={i:newLayer.canvas.number,j:newLayer.level.val};
	canvases[oldIndex.i].layers[oldIndex.j][array].splice(object.level.val,1);
	object.level.val=object.level.current=canvases[newIndex.i].layers[newIndex.j][array].length;
	canvases[newIndex.i].layers[newIndex.j][array][object.level.val]=object;
	object.layer.number=newIndex.j;
	object.canvas.number=newIndex.i;
	redraw(object);
	return object;
}
function canvas(idCanvas,object,array)
{
	redraw(object);
	if(idCanvas===undefined)return canvases[object.canvas.number].id.val;
	if(canvases[object.canvas.number].id.val==idCanvas)return object;
	var oldIndex={
		i:object.canvas.number,
		j:object.layer.number
	};
	jCanvaScript.canvas(idCanvas);
	for(var i=0;i<canvases.length;i++)
		if(canvases[i].id.val==idCanvas)
		{
			canvases[oldIndex.i].layers[oldIndex.j][array].splice(object.level.val,1);
			object.level.val=object.level.current=canvases[i].layers[0][array].length;
			canvases[i].layers[0][array][object.level.val]=object;
			object.layer.number=0;
			object.canvas.number=i;
			object.layer.val=canvases[i].layers[0].id.val;
		}
	redraw(object);
	return object;
}

function levelChanger(array)
{
	var limit=array.length;
	var tmp;
	for(var j=0;j<limit;j++)
	{
		if(array[j].level.val!=array[j].level.current)
		{
			tmp=array[j];
			var id=tmp.level.val;
			if (id>=limit)id=limit-1;
			if (id<0)id=0;
			if(id>tmp.level.current)
				for(var i=tmp.level.current;i<id;i++)
				{
					array[i]=array[i+1];
					array[i].level.current=i;
					array[i].level.val=i;
				}
			if(id<tmp.level.current)
				for(i=tmp.level.current;i>id;i--)
				{
					array[i]=array[i-1];
					array[i].level.current=i;
					array[i].level.val=i;
				}
			array[id]=tmp;
			array[id].level.current=id;
			array[id].level.val=id;
		}
	}
}
function objDeleter(array)
{
	for(var i=0;i<array.length;i++)
	{
		if(typeof (array[i].draw)!='function')
		{
			array.splice(i,1);
			i--;
		}
	}
	return array.length;
}



/**/

function grdntsnptrn()
{
	var grdntsnptrn={};
	var tmpObj=obj(0,0,true);
	grdntsnptrn.animate=tmpObj.animate;
	grdntsnptrn.layer=tmpObj.layer;
	grdntsnptrn.id=tmpObj.id;
	grdntsnptrn.level=tmpObj.level;
	grdntsnptrn.layer=function(idLayer)
	{
		return layer(idLayer,this,'grdntsnptrns');
	}
	grdntsnptrn.layer.val=canvases[lastCanvas].id.val+'Layer_0';
	grdntsnptrn.layer.number=0
	grdntsnptrn.canvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'grdntsnptrns');
	}
	grdntsnptrn.canvas.number=lastCanvas;
	grdntsnptrn.level.val=canvases[lastCanvas].layers[0].grdntsnptrns.length;
	canvases[lastCanvas].layers[0].grdntsnptrns[grdntsnptrn.level.val]=grdntsnptrn;
	redraw(grdntsnptrn);
	return grdntsnptrn;
}
function gradients(colors)
{
	var gradients = grdntsnptrn();
	gradients.n=0;
	for (var i=0; i<colors.length;i++)
	{
		gradients['pos'+i] = {val:colors[i][0]};
		var colorKeeper = parseColor(colors[i][1]);
		gradients['colorR'+i] = colorKeeper.colorR;
		gradients['colorG'+i] = colorKeeper.colorG;
		gradients['colorB'+i] = colorKeeper.colorB;
		gradients['alpha'+i] = colorKeeper.alpha;
		gradients.n=i;
	}
	return gradients;
}

function obj(x,y,service)
{	
	var opacity=function(n)
	{
		return this.attr('opacity',n);
	}
	opacity.val=1;	
	var fn = [];
	var name = function(name)
	{
		return this.attr('name',name)
	}
	name.val='';
	var visible=function(visibility)
	{
		return this.attr('visible',visibility);
	}
	visible.val=true;
	var composite=function(composite)
	{
		return this.attr('composite',composite);
	}
	composite.val='source-over';
	var droppable=function(fn)
	{
		this.droppable.val=true;
		if(fn!==undefined)this.droppable.fn=fn;
		return this;
	}
	droppable.val=false;
	droppable.fn=function(draggedObject){};
	var draggable=function(object,params,fn)
	{
		var dragObj=this;
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
		this.draggable.shiftX=0;
		this.draggable.shiftY=0;
		if(params!==undefined)
		{
			if(params.shiftX!==undefined){this.draggable.shiftX=params.shiftX;params.shiftX=undefined;}
			if(params.shiftY!==undefined){this.draggable.shiftY=params.shiftY;params.shiftY=undefined;}
		}
		if(object!==undefined)
		{
			if(object.id)dragObj=(params===undefined)? object.visible(false) : object.animate(params).visible(false);
			if(object=='clone')
			{
				dragObj=this.clone(params).visible(false);
				this.draggable.type='clone';
			}
		}
		this.draggable.val=true;
		this.draggable.x=this.x.val;
		this.draggable.y=this.y.val;
		this.draggable.dx=this.transformdx.val;
		this.draggable.dy=this.transformdy.val;
		this.draggable.object=dragObj;
		this.draggable.params=params;
		this.draggable.fn=fn||false;
		var optns=canvases[this.canvas.number].optns;
		optns.mousemove.val=true;
		optns.mousedown.val=true;
		optns.mouseup.val=true;
		return this;
	}
	draggable.val=false;
	var olayer=function(idLayer)
	{
		return layer(idLayer,this,'objs');
	}
	olayer.val=canvases[0].id.val+'Layer_0';
	olayer.number=0;
	var ocanvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'objs');
	}
	ocanvas.number=0;
	var focus=function(fn)
	{
		if(fn===undefined)
		{
			this.focus.val=true;
			if(typeof this.onfocus=='function')this.onfocus();
		}
		else this.onfocus=fn;
		return this;
	}
	focus.val=false;
	var obj={
	x:{val:x||0},
	y:{val:y||0},
	opacity:opacity,
	fn:fn,
	id:function(id)
	{
		return this.attr('id',id);
	},
	name:name,
	clone:function(params)
	{
		var clone=shapes('rgba(0,0,0,0)');
		for(var key in this)
		{
			if(key=='id' || key=='level' || key=='canvas' || key=='layer' || key=="draggable" || key=="droppable" || key=="click" || key.substr(0,5)=="mouse" || key.substr(0,3)=="key")continue;
			if(!clone.hasOwnProperty(key))
			{
				switch(typeof this[key])
				{
					case 'object':clone[key]={};break;
					default:clone[key]=this[key];
				}
			}
			for(var subKey in this[key])
			{
				clone[key][subKey]=this[key][subKey];
			}
		}
		clone.layer(canvases[this.canvas.number].layers[this.layer.number].id.val);
		if(params===undefined) return clone;
		return clone.animate(params);
	},
	visible:visible,
	shadowX: {val:0},
	shadowY: {val:0},
	shadowBlur: {val:0},
	shadowColor: {val:'rgba(0,0,0,0)'},
	shadowColorR: {val:0},
	shadowColorG: {val:0},
	shadowColorB: {val:0},
	shadowColorA: {val:0},
	shadow: function(options)
	{
		for(var key in options)
		switch (key)
		{
			case 'x':
				this.shadowX.val=options.x;
				break;
			case 'y':
				this.shadowY.val=options.y;
				break;
			case 'blur':
				this.shadowBlur.val=options.blur;
				break;
			case 'color':
				var colorKeeper = parseColor(options.color);
				this.shadowColor = options.color.val;
				this.shadowColorR = colorKeeper.colorR;
				this.shadowColorG = colorKeeper.colorG;
				this.shadowColorB = colorKeeper.colorB;
				this.shadowColorA = colorKeeper.alpha;
				break;
		}
		redraw(this);
		return this;
	},
	composite:composite,
	setOptns:function(ctx)
	{
		ctx.globalAlpha = this.opacity.val;
		ctx.shadowOffsetX = this.shadowX.val;  
		ctx.shadowOffsetY = this.shadowY.val;  
		ctx.shadowBlur = this.shadowBlur.val;
		ctx.globalCompositeOperation=this.composite.val;
		ctx.shadowColor = 'rgba('+this.shadowColorR.val+','+this.shadowColorG.val+','+this.shadowColorB.val+','+this.shadowColorA.val+')';
		if(this.translate.matrix)
		{
			this.matrix(multiplyM(this.matrix(),this.translate.matrix));
			this.translate.matrix=false;
		}
		if(this.scale.matrix)
		{
			this.matrix(multiplyM(this.matrix(),this.scale.matrix));
			this.scale.matrix=false;
		}
		if(this.rotate.matrix)
		{
			this.matrix(multiplyM(this.matrix(),this.rotate.matrix));
			this.rotate.matrix=false;
		}
		ctx.transform(this.transform11.val,this.transform12.val,this.transform21.val,this.transform22.val,this.transformdx.val,this.transformdy.val);
		return this;
	},
	up:function(n)
	{						
		if(n === undefined)n=1;
		if(n == 'top')n=canvases[this.canvas.number].layers[this.layer.number].objs.length-1;
		this.level.val+=n;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	down:function(n)
	{						
		if(n == undefined)n=1;
		if(n == 'bottom')n=this.level.val;
		this.level.val-=n;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	level:function(n)
	{
		if(n == undefined)return this.level.val;
		this.level.val=n;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	layer:olayer,
	canvas:ocanvas,
	del:function()
	{
		this.draw=false;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjDeleted = true;
		redraw(this);
	},
	focus:focus,
	blur:function(fn)
	{
		if(fn===undefined)
		{
			this.focus.val=false;
			if(typeof this.onblur == 'function')this.onblur();
		}
		else this.onblur=fn;
		return this;
	},
	click: function(fn)
	{
		return setMouseEvent.call(this,fn,'click');
	},
	keypress: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeypress');
	},
	keydown: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeydown');
	},
	keyup: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeyup');
	},
	mousedown: function(fn)
	{
		return setMouseEvent.call(this,fn,'mousedown');
	},
	mouseup: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseup');
	},
	mousemove: function(fn)
	{
		return setMouseEvent.call(this,fn,'mousemove');
	},
	mouseover: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseover');
	},
	mouseout: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseout');
	},
	draggable:draggable,
	droppable:droppable,
	attr:function(parameter,value)
	{
		if(typeof parameter==='object')
			var parameters=parameter;
		else
		{
			if(this[parameter]===undefined)return undefined;
			if(value===undefined)
				return this[parameter].val;
			parameters={};
			parameters[parameter]=value;
		}
		return this.animate(parameters);
	},
	stop:function(jumpToEnd,runCallbacks)
	{
		this.animate.val=false;
		for(var key in this)
		{
			if(this[key]['from']!==undefined)
			{
				this[key]['from']=undefined;
				if(jumpToEnd!==undefined)
					if(jumpToEnd)
					{
						this[key]['val']=this[key]['to'];
						if(key=='rotateAngle'){this.rotate(this[key]['val']-this[key]['prev'],this.rotateX.val,this.rotateY.val);}
						if(key=='translateX'){this.translate(this[key]['val']-this[key]['prev'],0);}
						if(key=='translateY'){this.translate(0,this[key]['val']-this[key]['prev']);}
						if(key=='scaleX'){this.scale(this[key]['val']-this[key]['prev'],0);}
						if(key=='scaleY'){this.scale(0,this[key]['val']-this[key]['prev']);}
					}
			}
		}		
		var fnlimit=this.fn.length;
		if(runCallbacks===undefined)runCallbacks=false;
		for(var j=0;j<fnlimit;j++)
		{
			if(this['fn'][j]['func'] != 0 && !this['fn'][j]['count'] && this.fn[j].enabled)
			{
				this.fn[j].enabled=false;
				if(runCallbacks)
					this['fn'][j]['func'].apply(this);
			}
		}
		return this;
	},
	animate:function(options,duration,easing,onstep,fn)
	{
		this.animate.val=true;
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
		if(duration!=1)duration=duration/1000*canvases[this.canvas.number].fps;
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
			this.scaleX.val=this.scaleY.val=this.scaleX.prev=this.scaleY.prev=0;
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
			this.translateX.val=this.translateY.val=this.translateX.prev=this.translateY.prev=0;
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
			this.rotateAngle.val=this.rotateAngle.prev=0;
			this.rotateX.val=options.rotate.x||0;
			this.rotateY.val=options.rotate.y||0;
			options.rotate=undefined;
		}
		if(options.color !== undefined)
		{
			var colorKeeper=parseColor(options.color);
			if(colorKeeper.color.notColor)
				this.color.notColor=colorKeeper.color.notColor;
			else
			{
				options.colorR=colorKeeper.colorR.val;
				options.colorG=colorKeeper.colorG.val;
				options.colorB=colorKeeper.colorB.val;
				options.alpha=colorKeeper.alpha.val;
			}
			options.color = undefined;
		}
		if(options.shadowColor !== undefined)
		{
			colorKeeper=parseColor(options.shadowColor);
			options.shadowColorR=colorKeeper.colorR.val;
			options.shadowColorG=colorKeeper.colorG.val;
			options.shadowColorB=colorKeeper.colorB.val;
			options.shadowColorA=colorKeeper.alpha.val;
			options.shadowColor = undefined;
		}
		if (fn)
		{
			var fnlimit=this.fn.length;
			this.fn[fnlimit]={func:fn,count:0,enabled:true};
		}
		if (options.level !== undefined)
		{
			canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
			if(options.level=='top')options.level=canvases[this.canvas.number].layers[this.layer.number].objs[this.level.val].length-1;
			else
				if (options.level=='bottom')options.level=0;	
		}
		var re = /[A-z]+?/;
		for(var key in options)
		{
			if(this[key] !== undefined && options[key]!==undefined)
			{
				if(options[key]!=this[key]['val'])
				{
					if(options[key].charAt)
					{
						if(options[key].charAt(1)=='=')
						{
							options[key]=this[key]['val']+parseInt(options[key].charAt(0)+options[key].substr(2));
						}
						else if(!re.test(options[key]))options[key]=parseInt(options[key]);
						else this[key]['val']=options[key];
					}
					if(duration==1)this[key]['val']=options[key];
					else
					{
						this[key]['from']=this[key]['val'];
						this[key]['to']=options[key];
						this[key]['duration']=duration;
						this[key]['step']=1;
						this[key]['easing']=easing;
						this[key]['onstep']=onstep;
						if(fn)
						{
							this.fn[fnlimit][key]=true;
							this.fn[fnlimit].count++;
						}
					}
				}
			}
		}
		if(duration==1)
		{
			if(options['rotateAngle'])
				this.rotate(this.rotateAngle.val,this.rotateX.val,this.rotateY.val);
			if(options['translateX']||options['translateY'])
				this.translate(this.translateX.val,this.translateY.val);
			if(options['scaleX']||options['scaleY'])
				this.scale(this.scaleX.val,this.scaleY.val);
		}
		redraw(this);
		return this;
	},
	matrix:function(m)
	{
		if(m===undefined)return [[this.transform11.val,this.transform21.val,this.transformdx.val],[this.transform12.val,this.transform22.val,this.transformdy.val]];
		this.transform11.val=m[0][0];
		this.transform21.val=m[0][1];
		this.transform12.val=m[1][0];
		this.transform22.val=m[1][1];
		this.transformdx.val=m[0][2];
		this.transformdy.val=m[1][2];
		return this;
	},
	translateX:{val:0},
	translateY:{val:0},
	translate:function(x,y)
	{
		if(this.translate.matrix)
			this.translate.matrix=multiplyM(this.translate.matrix,[[1,0,x],[0,1,y]]);
		else
			this.translate.matrix=[[1,0,x],[0,1,y]];
		redraw(this);
		return this;
	},
	scaleX:{val:0},
	scaleY:{val:0},
	scale:function(x,y)
	{
		if(y===undefined)y=x;
		if(this.scale.matrix)
			this.scale.matrix=multiplyM(this.scale.matrix,[[x,0,this.x.val*(1-x)],[0,y,this.y.val*(1-y)]]);
		else
			this.scale.matrix=[[x,0,this.x.val*(1-x)],[0,y,this.y.val*(1-y)]];
		redraw(this);
		return this;
	},
	rotateAngle:{val:0},
	rotateX:{val:0},
	rotateY:{val:0},
	rotate:function(x,x1,y1)
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
		if(this.rotate.matrix)
				this.rotate.matrix=multiplyM(this.rotate.matrix,matrix);
			else
				this.rotate.matrix=matrix;
		return this;
	},
	transform11:{val:1},
	transform12:{val:0},
	transform21:{val:0},
	transform22:{val:1},
	transformdx:{val:0},
	transformdy:{val:0},
	transform:function(m11,m12,m21,m22,dx,dy,reset)
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
	},
	beforeDraw:function(ctx)
	{
		if(!this.visible.val)return false;
		ctx.save();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			clipObject.visible.val=true;
			animating.call(clipObject);
			clipObject.setOptns(ctx);
			ctx.beginPath();
			clipObject.draw(ctx);
			ctx.clip();
		}
		animating.call(this);
		this.setOptns(ctx);
		ctx.beginPath();
		return true;
	},
	clip:function(object)
	{
		if(object===undefined)return this.clip.val;
		canvases[object.canvas.number].layers[object.layer.number].objs.splice(object.level.val,1);
		this.clip.val=object;
		return this;
	},
	afterDraw:function(optns)
	{
		optns.ctx.closePath();
		checkEvents(this,optns);
		optns.ctx.restore();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			if(clipObject.afterDrawObj)clipObject.afterDrawObj(optns);
			else clipObject.afterDraw();
		}
	},
	isPointIn:function(x,y,global)
	{
		var ctx=canvases[this.canvas.number].optns.ctx;
		if(global!==undefined)
		{
			x-=canvases[this.canvas.number].optns.x;
			y-=canvases[this.canvas.number].optns.y;
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
	}
	obj.translate.matrix=obj.rotate.matrix=obj.scale.matrix=false;
	if(service===undefined && canvases[lastCanvas]!==undefined && canvases[lastCanvas].layers[0]!==undefined)
	{	
		obj.level.val=obj.level.current=canvases[lastCanvas].layers[0].objs.length;
		canvases[lastCanvas].layers[0].objs[canvases[lastCanvas].layers[0].objs.length]=obj;
		obj.layer.number=0;
		obj.canvas.number=lastCanvas;
		obj.layer.val=canvases[lastCanvas].layers[0].id.val;
		redraw(obj);
	}
	return obj;
}

function shapes(x,y,color,fill)
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
	var shape = obj(x,y);
	shape.fill={val:fill};
	shape.color = function(color)
	{
		if (color===undefined)return [this.colorR.val,this.colorG.val,this.colorB.val,this.alpha.val];
		return this.attr('color',color);
	}
	shape.color.val=color;
	shape.color.notColor=undefined;
	shape.colorR={val:0};
	shape.colorG={val:0};
	shape.colorB={val:0};
	shape.alpha={val:0};
	shape.lineWidth = {val:1};
	shape.cap = {val:'butt'};
	shape.join = {val:'miter'};
	shape.miterLimit= {val:1};
	shape.lineStyle = function(options)
	{
		return this.attr(options);
	}
	shape.setObjOptns = shape.setOptns;
	shape.setOptns = function(ctx)
	{
		this.setObjOptns(ctx);
		ctx.lineWidth = this.lineWidth.val;
		ctx.lineCap = this.cap.val;
		ctx.lineJoin = this.join.val;
		ctx.miterLimit = this.miterLimit.val;
		if(this.color.notColor===undefined)
			this.color.val='rgba('+parseInt(this.colorR.val)+','+parseInt(this.colorG.val)+','+parseInt(this.colorB.val)+','+parseInt(this.alpha.val*100)/100+')';
		else
			if(canvases[this.color.notColor.canvas].layers[this.color.notColor.layer].grdntsnptrns[this.color.notColor.level]!==undefined){this.color.val=canvases[this.color.notColor.canvas].layers[this.color.notColor.layer].grdntsnptrns[this.color.notColor.level].val;}
		if(this.fill.val) ctx.fillStyle = this.color.val;
		else ctx.strokeStyle = this.color.val;
	}
	shape.afterDrawObj=shape.afterDraw;
	shape.afterDraw=function(optns)
	{
		if(this.fill.val)
			optns.ctx.fill();
		else
			optns.ctx.stroke();
		this.afterDrawObj(optns);
	}
	if(color===undefined)return shape;
	return shape.color(color);
}

/**/

jCanvaScript.addObject=function(name,parameters,drawfn)
{
	jCanvaScript[name]=function()
	{
		var object=shapes(parameters.x||0,parameters.y||0,parameters.color||"rgba(0,0,0,0)",parameters.fill||1);
		var i=0;
		for(var key in parameters)
		{
			if(object[key]===undefined)
				object[key]={val:arguments[i]||parameters[key]};
			else
				object[key].val=arguments[i]||parameters[key];
			if(key=='color')object.color(arguments[i]||parameters[key]);
			i++;
		}
		object.draw=drawfn;
		return object;
	}
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

/**/


jCanvaScript.pattern = function(img,type)
{
	var pattern = grdntsnptrn();
	pattern.img={val:img};
	pattern.type={val:type||'repeat'};
	pattern.create = function(ctx)
	{
		animating.call(this);
		this.val = ctx.createPattern(this.img.val,this.type.val);
	}
	return pattern;
}

jCanvaScript.lGradient=function(x1,y1,x2,y2,colors)
{
	var lGrad = gradients(colors);
	lGrad.x1 = {val:x1};
	lGrad.y1 = {val:y1};
	lGrad.x2 = {val:x2};
	lGrad.y2 = {val:y2};
	lGrad.create = function(ctx)
	{
		animating.call(this);
		this.val=ctx.createLinearGradient(this.x1.val,this.y1.val,this.x2.val,this.y2.val);
		for(var i=0;i<=this.n;i++)
		{
			this.val.addColorStop(this['pos'+i].val,'rgba('+this['colorR'+i].val+','+this['colorG'+i].val+','+this['colorB'+i].val+','+this['alpha'+i].val+')');
		}
	}
	return lGrad;
}
jCanvaScript.rGradient=function(x1,y1,r1,x2,y2,r2,colors)
{
	var rGrad = gradients(colors);
	rGrad.x1 = {val:x1};
	rGrad.y1 = {val:y1};
	rGrad.r1 = {val:r1};
	rGrad.x2 = {val:x2};
	rGrad.y2 = {val:y2};
	rGrad.r2 = {val:r2};
	rGrad.create = function(ctx)
	{
		animating.call(this);
		this.val=ctx.createRadialGradient(this.x1.val,this.y1.val,this.r1.val,this.x2.val,this.y2.val,this.r2.val);  
		for(var i=0;i<=this.n;i++)
		{
			this.val.addColorStop(this['pos'+i].val,'rgba('+this['colorR'+i].val+','+this['colorG'+i].val+','+this['colorB'+i].val+','+this['alpha'+i].val+')');  
		}
	}
	return rGrad;
}

jCanvaScript.imageData=function(width,height)
{
	var imageData=obj();
	if(height===undefined)
	{
		var oldImageData=width;
		width=oldImageData.width.val;
		height=oldImageData.height.val;
	}
	imageData.width={val:width};
	imageData.height={val:height};
	imageData.data=[];
	imageData.setPixel=function(x,y,color)
	{
		var colorKeeper = parseColor(color);
		var index=(x + y * this.width.val) * 4;
		this.data[index+0] = colorKeeper.colorR.val;
		this.data[index+1] = colorKeeper.colorG.val;
		this.data[index+2] = colorKeeper.colorB.val;
		this.data[index+3] = colorKeeper.alpha.val*255;
		redraw(this);
		return this;
	}
	imageData.getPixel=function(x,y)
	{
		var index=(x + y * this.width.val) * 4;
		return [this.data[index+0],this.data[index+1],this.data[index+2],this.data[index+3]/255];
	}
	imageData.getX={val:0};
	imageData.getY={val:0};
	imageData.getData=function(x,y,width,height)
	{
		this.getX.val=x;
		this.getY.val=y;
		this.width.val=width;
		this.height.val=height;
		var ctx=canvases[this.canvas.number].optns.ctx;
		try{
				this.imgData=ctx.getImageData(this.getX.val,this.getY.val,this.width.val,this.height.val);
			}catch(e){
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				this.imgData=ctx.getImageData(this.getX.val,this.getY.val,this.width.val,this.height.val);
		}
		this.data=this.imgData.data;
		redraw(this);
		return this;
	}
	imageData.putData=function(x,y)
	{
		if(x!==undefined)this.x.val=x;
		if(y!==undefined)this.y.val=y;
		this.putData.val=true;
		redraw(this);
		return this;
	}
	imageData.putData.val=false;
	for(var i=0;i<imageData.width.val;i++)
		for(var j=0;j<imageData.height.val;j++)
		{
			index=(i+j*imageData.width.val)*4;
			imageData.data[index+0]=0;
			imageData.data[index+1]=0;
			imageData.data[index+2]=0;
			imageData.data[index+3]=0;
		}
	imageData.draw=function(ctx)
	{
		if(this.imgData===undefined)
		{
			this.imgData=ctx.createImageData(this.width.val,this.height.val);
			this.imgData.data=this.data.concat();
			this.data=this.imgData.data;
		}
		if(this.putData.val)
			ctx.putImageData(this.imgData,this.x.val,this.y.val);
	}
	return imageData;
}
jCanvaScript.image=function(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight)
{
	var image=obj();
	image.img={val:img};
	image.swidth={val:swidth||false};
	image.sheight={val:sheight||false};
	image.sx={val:sx};
	image.sy={val:sy};
	image.dx={val:dx||false};
	image.dy={val:dy||false};
	image.dwidth={val:dwidth||false};
	image.dheight={val:dheight||false};
	image.draw=function(ctx)
	{
		if(this.swidth.val==false && this.dx.val==false){ctx.drawImage(this.img.val,this.sx.val,this.sy.val);}
		else{if(this.dx.val==false)ctx.drawImage(this.img.val,this.sx.val,this.sy.val,this.swidth.val,this.sheight.val);
			else ctx.drawImage(this.img.val,this.sx.val,this.sy.val,this.swidth.val,this.sheight.val,this.dx.val,this.dy.val,this.dwidth.val,this.dheight.val);}
	}
	return image;
}

jCanvaScript.circle=function(x,y,radius,color,fill)
{
	var circle = shapes(x,y,color,fill);
	circle.radius={val:radius};
	circle.draw=function(ctx)
	{
		ctx.arc (this.x.val, this.y.val, this.radius.val, 0,pi,true);
	}
	return circle;
}
jCanvaScript.rect=function(x,y,width,height,color,fill)
{
	var rect = shapes(x,y,color,fill);
	rect.width={val:width};
	rect.height={val:height};
	rect.draw=function(ctx)
	{
		ctx.rect(this.x.val, this.y.val, this.width.val, this.height.val);
	}
	return rect;
}
jCanvaScript.arc=function(x,y,radius,startAngle,endAngle,anticlockwise,color,fill)
{
	if(anticlockwise!==undefined)
		if(anticlockwise.charAt)color=anticlockwise;
	var arc = shapes(x,y,color,fill);
	arc.radius={val:radius};
	arc.startAngle={val:startAngle};
	arc.endAngle={val:endAngle};
	arc.anticlockwise={val:anticlockwise||true};
	arc.draw=function(ctx)
	{
		ctx.arc (this.x.val, this.y.val, this.radius.val, this.startAngle.val,this.endAngle.val,this.anticlockwise.val);
	};
	return arc;
}
jCanvaScript.line=function(points,color,fill)
{
	var line = shapes(points[0][0],points[0][1],color,fill);
	for(var j=0;j<points.length;j++)
	{
		line['x'+j]={val:points[j][0]};
		line['y'+j]={val:points[j][1]};
	}
	line.shapesCount=points.length;
	line.draw=function(ctx)
	{
		ctx.moveTo(this.x.val,this.y.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.lineTo(this['x'+j].val,this['y'+j].val);
		}
	}
	return line;
}
jCanvaScript.qCurve=function(points,color,fill)
{
	var qCurve = shapes(points[0][0],points[0][1],color,fill);
	qCurve.fill={val:fill||0};
	for(var j=0;j<points.length;j++)
	{
		qCurve['x'+j]={val:points[j][0]}
		qCurve['y'+j]={val:points[j][1]}
		qCurve['cp1x'+j]={val:points[j][2]}
		qCurve['cp1y'+j]={val:points[j][3]}
	}
	qCurve.shapesCount=points.length;
	qCurve.draw=function(ctx)
	{
		ctx.moveTo(this.x.val,this.y.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.quadraticCurveTo(this['cp1x'+j].val,this['cp1y'+j].val,this['x'+j].val,this['y'+j].val);
		}
	}
	return qCurve;
}
jCanvaScript.bCurve=function(points,color,fill)
{
	var bCurve = shapes(points[0][0],points[0][1],color,fill);
	for(var j=0;j<points.length;j++)
	{
		bCurve['x'+j]={val:points[j][0]};
		bCurve['y'+j]={val:points[j][1]};
		bCurve['cp1x'+j]={val:points[j][2]};
		bCurve['cp1y'+j]={val:points[j][3]};
		bCurve['cp2x'+j]={val:points[j][4]};
		bCurve['cp2y'+j]={val:points[j][5]};
	}
	bCurve.shapesCount=points.length;
	bCurve.draw=function(ctx)
	{
		ctx.moveTo(this.x.val,this.y.val);
		for(var j=1;j<this.shapesCount;j++)
		{
			ctx.bezierCurveTo(this['cp1x'+j].val,this['cp1y'+j].val,this['cp2x'+j].val,this['cp2y'+j].val,this['x'+j].val,this['y'+j].val);
		}
	}
	return bCurve;
}
jCanvaScript.text = function(string,x,y,maxWidth,color,fill)
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
	var text = shapes(x,y,color,fill||1);
	text.string=string;
	text.maxWidth={val:maxWidth||false};
	text.font=function(font)
	{
		return this.attr('font',font);
	}
	text.font.val="10px sans-serif";
	text.align=function(align)
	{
		return this.attr('align',align);
	}
	text.align.val="start";
	text.baseline=function(baseline)
	{
		return this.attr('baseline',baseline);
	}
	text.baseline.val="alphabetic";
	text.setShapeOptns = text.setOptns;
	text.setOptns = function(ctx)
	{
		this.setShapeOptns(ctx);
		ctx.textBaseline=this.baseline.val;
		ctx.font=this.font.val;
		ctx.textAlign=this.align.val;
	}
	text.draw=function(ctx)
	{
		if(this.maxWidth.val==false)
		{
			if(this.fill.val){ctx.fillText(this.string,this.x.val,this.y.val);}
			else{ctx.strokeText(this.string,this.x.val,this.y.val);}
		}
		else
		{
			if(this.fill.val){ctx.fillText(this.string,this.x.val,this.y.val,this.maxWidth.val);}
			else{ctx.strokeText(this.string,this.x.val,this.y.val,this.maxWidth.val);}
		}
	}
	return text;
}

/**/

jCanvaScript.canvas = function(idCanvas)
{
	if(idCanvas===undefined)return canvases[0];
	var limit=canvases.length;
	for (var i=0;i<limit;i++)
		if(canvases[i].id.val==idCanvas)return canvases[i];
	var canvas={
		id:function(id)
		{
			if(id===undefined)return this.id.val;
			this.id.val=id;
			return this;
		}
	};
	canvases[limit]=canvas;
	lastCanvas=limit;
	canvas.id.val=idCanvas;
	canvas.cnv=document.getElementById(idCanvas);
	if ('\v'=='v')G_vmlCanvasManager.initElement(canvas.cnv);
	canvas.optns =
	{
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
		mouseup:{val:false,x:false,y:false,object:false},
		mousedown:{val:false,x:false,y:false,object:false},
		drag:{object:false,x:0,y:0},
		gCO: 'source-over',
		redraw:1
	}
	canvas.layers=[];
	canvas.interval=0;
	jCanvaScript.layer(idCanvas+'Layer_0').canvas(idCanvas);
	canvas.start=function(fps)
	{
		lastCanvas=this.layers[0].canvas.number;
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
					if(drag.fn)drag.fn.call(drag.object,({x:drag.object.transformdx.val,y:drag.object.transformdy.val}));
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
		jCanvaScript.layer(this.id.val+'Layer_0').canvas(this.id.val);
		this.optns.ctx.clearRect(0,0,this.optns.width,this.optns.height);
		this.optns.redraw++;
		return this;
	}
	canvas.composite=function(composite)
	{
		if(composite===undefined)return this.optns.gCO;
		else this.optns.gCO=composite;
		for(var i=0;i<this.layers.length;i++)
			this.layers[i].composite(composite);
		this.optns.redraw++;
		return this;
	}
	canvas.frame=function()
	{
		if(!this.optns.redraw)return;
		this.optns.redraw--;
		this.optns.ctx.clearRect(0,0,this.optns.width,this.optns.height);
		var limit=this.layers.length;
		if(limit==0)return;
		if(this.optns.anyLayerLevelChanged)
		{
			levelChanger(this.layers);
			this.optns.anyLayerLevelChanged=false;
		}
		if(this.optns.anyLayerDeleted)
		{
			limit=objDeleter(this.layers);
			this.optns.anyLayerDeleted=false;
		}
		for(var i=0;i<limit;i++)
		{
			this.optns.ctx.globalCompositeOperation=this.optns.gCO;
			var object=this.layers[i];
			if(typeof (object.draw)=='function')
				if(object.beforeDraw(this.optns.ctx))
				{
					if(typeof (object.draw)=='function')
					{
						object.draw(this.optns);
						object.afterDraw(this.optns);
					}
				}
		}
		if(this.optns.mousemove.x!=false)
		{
			if(this.optns.mousemove.object!=false)
			{
				var mousemoveObject=this.optns.mousemove.object;
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
		if(this.optns.mousedown.object!=false)
		{
			var mouseDown=this.optns.mousedown;
			var mouseDownObjects=[mouseDown.object,canvases[mouseDown.object.canvas.number].layers[mouseDown.object.layer.number]];
			for(i=0;i<2;i++)
			{
				if(typeof mouseDownObjects[i].onmousedown=='function')mouseDownObjects[i].onmousedown({x:mouseDown.x,y:mouseDown.y});
				if(mouseDownObjects[i].draggable.val==true)
				{
					var drag=this.optns.drag;
					drag.object=mouseDownObjects[i].draggable.object.visible(true);
					drag.fn=mouseDownObjects[i].draggable.fn;
					drag.init=mouseDownObjects[i];
					if(drag.init.draggable.params!==undefined)drag.object.animate(drag.init.draggable.params);
					var point=transformPoint(mouseDown.x,mouseDown.y,drag.object.matrix());
					drag.x=point.x;
					drag.y=point.y;
					if(drag.object!=drag.init && drag.init.draggable.type!='clone')
					{
						point.x=-drag.object.x.val+point.x;
						point.y=-drag.object.y.val+point.y;
						drag.x-=point.x;
						drag.y-=point.y;
						drag.object.transform(1,0,0,1,point.x,point.y);
					}
					drag.object.transformdx.val+=drag.init.draggable.shiftX;
					drag.object.transformdy.val+=drag.init.draggable.shiftY;
				}
			}
			mouseDown.object=false;
		}
		if(this.optns.mouseup.object!=false)
		{
			var mouseUp=this.optns.mouseup;
			var mouseUpObjects=[mouseUp.object,canvases[mouseUp.object.canvas.number].layers[mouseUp.object.layer.number]];
			var drag=this.optns.drag;
			for(i=0;i<2;i++)
			{
				if(typeof mouseUpObjects[i].onmouseup=='function')mouseUpObjects[i].onmouseup({x:mouseUp.x,y:mouseUp.y});
				if(mouseUpObjects[i].droppable.val==true && this.optns.drag.init!==undefined)
				{
					if(drag.init==drag.object)
						drag.init.visible(true);
					if(typeof mouseUpObjects[i].droppable.fn=='function')mouseUpObjects[i].droppable.fn.call(mouseUpObjects[i],drag.init);
					drag={object:false,x:0,y:0};
				}
				else
				{
					if(drag.init!==undefined)
					{
						drag.object.visible(false);
						drag.init.visible(true);
						drag.init.transformdx.val=drag.object.transformdx.val;
						drag.init.transformdy.val=drag.object.transformdy.val;
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
			var mouseClickObjects=[mouseClick.object,canvases[mouseClick.object.canvas.number].layers[mouseClick.object.layer.number]];
			for(i=0;i<2;i++)
				if(typeof mouseClickObjects[i].onclick == 'function')
					mouseClickObjects[i].onclick({x:mouseClick.x,y:mouseClick.y});
			mouseClick.object=false;
		}
		this.optns.mousemove.object=this.optns.keyUp.val=this.optns.keyDown.val=this.optns.keyPress.val=this.optns.click.x=this.optns.mouseup.x=this.optns.mousedown.x=this.optns.mousemove.x=false;
	}
	return canvas;
}

jCanvaScript.layer=function(idLayer)
{
	if(idLayer===undefined)return canvases[0].layers[0];
	var limit=0;
	for(var i=0;i<canvases.length;i++)
	{
		limit=canvases[i].layers.length;
		for (var j=0;j<limit;j++)
			if(canvases[i].layers[j].id.val==idLayer)return canvases[i].layers[j];
	}
	var layer=obj(0,0,true);
	limit=canvases[lastCanvas].layers.length;
	canvases[lastCanvas].layers[limit]=layer;
	layer.objs = [];
	layer.grdntsnptrns = [];
	layer.level={val:limit,current:limit};
	layer.id.val=idLayer;
	layer.optns={
		anyObjDeleted: false,
		anyObjLevelChanged: false,
		gCO: canvases[lastCanvas].optns.gCO
	}
	layer.canvas=function(idCanvas)
	{
		if (idCanvas===undefined)return this.canvas.val;
		if(this.canvas.val==idCanvas)return this;
		var newCanvas=-1;
		var oldCanvas=0;
		for(var i=0;i<canvases.length;i++)
		{
			if (canvases[i].id.val==idCanvas)newCanvas=i;
			if (canvases[i].id.val==this.canvas.val)oldCanvas=i;
		}
		if(newCanvas<0){newCanvas=canvases.length;jCanvaScript.canvas(idCanvas);}
		this.canvas.val=idCanvas;
		this.canvas.number=newCanvas;
		canvases[oldCanvas].layers.splice(this.level.val,1);
		this.level.val=this.level.current=canvases[newCanvas].layers.length;
		canvases[newCanvas].layers[this.level.val]=this;
		for(i=0;i<this.objs.length;i++)
		{
			this.objs[i].layer.number=this.level.val;
			this.objs[i].layer.canvas=newCanvas;
		}
		canvases[this.canvas.number].optns.redraw++;
		return this;
	}
	layer.canvas.val=canvases[lastCanvas].id.val;
	layer.canvas.number=lastCanvas;
	layer.up=function(n)
	{						
		if(n === undefined)n=1;
		if(n == 'top')n=objs[this.layer.val].length-1;
		this.level.val+=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].layer.number=this.level.val;
		}
		canvases[this.canvas.number].optns.anyLayerLevelChanged = true;
		canvases[this.canvas.number].optns.redraw++;
		return this;
	}
	layer.down=function(n)
	{						
		if(n == undefined)n=1;
		if(n == 'bottom')n=this.level.val;
		this.level.val-=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].layer.number=this.level.val;
		}
		canvases[this.canvas.number].optns.anyLayerLevelChanged = true;
		canvases[this.canvas.number].optns.redraw++;
		return this;
	}
	layer.del=function()
	{
		canvases[this.canvas.number].optns.anyLayerDeleted = true;
		this.draw = false;
		canvases[this.canvas.number].optns.redraw++;
		return;
	}
	layer.setObjOptns=layer.setOptns;
	layer.setOptns=function(ctx)
	{
		ctx.setTransform(1,0,0,1,0,0);
		layer.setObjOptns(ctx);
		return this;
	}
	layer.afterDraw=function(optns)
	{
		optns.ctx.closePath();
		optns.ctx.restore();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			if(clipObject.afterDrawObj)clipObject.afterDrawObj(optns);
			else clipObject.afterDraw();
		}
	}
	layer.clone=function(idLayer,params)
	{
		var clone=jCanvaScript.layer(idLayer);
		for(var key in this)
		{
			if(key=='id' || key=='canvas' || key=='level' || key=="draggable" || key=="droppable" || key=="click" || key.substr(0,5)=="mouse" || key.substr(0,3)=="key")continue;
			if(key=='objs')
			{
				for(var i=0;i<this.objs.length;i++)
				{
					this.objs[i].clone().layer(idLayer);
				}
				continue;
			}
			if(!clone.hasOwnProperty(key))
			{
				switch(typeof this[key])
				{
					case 'object':clone[key]={};break;
					default:clone[key]=this[key];
				}
			}
			for(var subKey in this[key])
			{
				clone[key][subKey]=this[key][subKey];
			}
		}
		clone.canvas(canvases[this.canvas.number].id.val);
		if(params===undefined) return clone;
		return clone.animate(params);
	}
	layer.isPointIn=function(x,y,global)
	{
		for(var i=0;i<this.objs.length;i++)
			if(this.objs[i].isPointIn(x,y,global))
				return true;
		return false;
	}
	layer.draw=function(canvasOptns)
	{
		var limitGrdntsNPtrns = this.grdntsnptrns.length;
		limit=this.objs.length;
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
	return layer;
}

window.jCanvaScript=window.jc=jCanvaScript;})();