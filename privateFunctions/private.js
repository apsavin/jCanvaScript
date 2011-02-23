function keyEvent(e)
{
	e=e||window.event;
	return {code:e.charCode||e.keyCode};
}
function mouseEvent(e,key,optns)
{
	e=e||window.event;
	var point= {pageX:e.pageX||e.clientX,
			pageY:e.pageY||e.clientY};
	optns[key].x=point.pageX - optns.x;
	optns[key].y=point.pageY - optns.y;
	return false;
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
		for(var i=0; i<n; i++) 
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
	var point={x:false,y:false}
	point.x=(x*m[1][1]-y*m[0][1]+m[0][1]*m[1][2]-m[1][1]*m[0][2])/(m[0][0]*m[1][1]-m[1][0]*m[0][1]);
	point.y=(-x*m[1][0]+y*m[0][0]-m[0][0]*m[1][2]+m[1][0]*m[0][2])/(m[0][0]*m[1][1]-m[1][0]*m[0][1]);
	return point;
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
	return false;
}
function getObjectCenter(object)
{
	var point={};
	if(object.width!==undefined && object.height!==undefined)
	{
		point.x=(object.x.val*2+object.width.val)/2;
		point.y=(object.y.val*2+object.height.val)/2;
		return point;
	}
	if(object.radius!==undefined)
	{
		if(object.startAngle===undefined)
		{
			point.x=object.x.val;
			point.y=object.y.val;
			return point;
		}
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
									canvas:color.layer.canvas,
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
	var ctx=canvases[object.layer.canvas].optns.ctx;
	if (navigator.appName != "Mozilla" && navigator.appName != "Netscape"){point.x=x;point.y=y;}
	else point=transformPoint(x,y,[[object.transform11.val,object.transform21.val,object.transformdx.val],[object.transform12.val,object.transform22.val,object.transformdy.val]]);
	if(ctx.isPointInPath===undefined || object.img!==undefined)
	{
		var rectangle=getObjectRectangle(object);
		point=transformPoint(x,y,[[object.transform11.val,object.transform21.val,object.transformdx.val],[object.transform12.val,object.transform22.val,object.transformdy.val]]);
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
	var x=optns.anyObjOnMouseMove.x||optns.anyObjOnMouseDown.x||optns.anyObjOnMouseUp.x||optns.anyObjOnMouseClick.x;
	var y=optns.anyObjOnMouseMove.y||optns.anyObjOnMouseDown.y||optns.anyObjOnMouseUp.y||optns.anyObjOnMouseClick.y;
	if(x!=false)
	{	
		point=isPointInPath(object,x,y);
	}
	if(point)
	{
		if(optns.anyObjOnMouseMove.x!=false)
			optns.anyObjOnMouseMove.object=object;
		if(optns.anyObjOnMouseDown.x!=false)
			optns.anyObjOnMouseDown.object=object;
		if(optns.anyObjOnMouseClick.x!=false)
			optns.anyObjOnMouseClick.object=object;
		if(optns.anyObjOnMouseUp.x!=false)
			optns.anyObjOnMouseUp.object=object;
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
	if (idLayer===undefined)return object.layer.val;
	if(object.layer.val==idLayer)return object;
	var oldIndex={i:object.layer.canvas,j:object.layer.number};
	object.layer.val=idLayer;
	var newLayer=jCanvaScript.layer(idLayer);
	var newIndex={i:newLayer.canvas.number,j:newLayer.level.val};
	canvases[oldIndex.i].layers[oldIndex.j][array].splice(object.level.val,1);
	object.level.val=object.level.current=canvases[newIndex.i].layers[newIndex.j][array].length;
	canvases[newIndex.i].layers[newIndex.j][array][object.level.val]=object;
	object.layer.number=newIndex.j;
	object.layer.canvas=newIndex.i;
	return object;
}
function canvas(idCanvas,object,array)
{
	if(idCanvas===undefined)return canvases[object.layer.canvas].id.val;
	if(canvases[object.layer.canvas].id.val==idCanvas)return object;
	var oldIndex={
		i:object.layer.canvas,
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
			object.layer.canvas=i;
			object.layer.val=canvases[i].layers[0].id.val;
		}
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
function objDeleter(array,limit)
{
	var delCount;
	do
	{
		delCount=0;		
		for(var i=0;i<limit;i++)
		{
			if(typeof (array[i].draw)!='function')							
				delCount++;
			if(delCount)array[i]=array[i+1];
		}				
		if(delCount)
		{
			delete array[limit];
			limit--;
			array.length--;
		}
	}while(delCount!=0);
	return limit;
}

