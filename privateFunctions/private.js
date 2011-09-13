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
	if(optns.keyDown.val!=false)if(typeof object.onkeydown=='function')object.onkeydown(optns.keyDown);
	if(optns.keyUp.val!=false)if(typeof object.onkeyup=='function')object.onkeyup(optns.keyUp);
	if(optns.keyPress.val!=false)if(typeof object.onkeypress=='function')object.onkeypress(optns.keyPress);
}
function isPointInPath(object,x,y)
{
	var point={};
	var canvas=object.canvas();
	var ctx=canvas.optns.ctx;
	var layer=canvas.layers[object.optns.layer.number];
	point.x=x;
	point.y=y;
	if(FireFox)
	{
		point=jCanvaScript.Matrix.transformPoint(x,y,layer.matrix());
		point=jCanvaScript.Matrix.transformPoint(point.x,point.y,object.matrix());
	}
	if(ctx.isPointInPath===undefined || object._img!==undefined || object._imgData!==undefined || object._proto=='text')
	{
		var rectangle=object.getRect('poor');
		point=transformPoint(x,y,jCanvaScript.Matrix.multiplyMatrixAndMatrix(object.matrix(),layer.matrix()));
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
