function checkDefaults(check,def)
{
	for(var key in def)
	{
		if(check[key]===undefined)check[key]=def[key];
	}
	return check;
}

function redraw(object)
{
	objectCanvas(object).optns.redraw=1;
}

function animating()
{
	var limit=this.animateQueue.length,
	progress=1;
	for(var q=0;q<limit;q++)
	{
		var queue=this.animateQueue[q];
		for(var key in queue)
		{
			if(this[key]!==undefined)
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
						if(queue.animateFn)queue.animateFn.apply(this);
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
function keyEvent(e,key,optns)
{
	e=e||window.event;
	optns[key].event=e;
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
	optns[key].event=e;
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
	objectCanvas(this).optns[eventName].val=true;
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
		return m_pow(progress,n);
	},
	circ:function(progress,params){
		return 1 - m_sqrt(1-progress*progress);
	},
	sine:function(progress,params){
		return 1 - m_sin((1 - progress) * m_pi/2);
	},
	back:function(progress,params){
		var n=params.n||2;
		var x=params.x||1.5;
		return m_pow(progress, n) * ((x + 1) * progress - x);
	},
	elastic:function(progress,params){
		var n=params.n||2;
		var m=params.m||20;
		var k=params.k||3;
		var x=params.x||1.5;
		return m_pow(n,10 * (progress - 1)) * m_cos(m * progress * m_pi * x / k);
	},
	bounce:function(progress,params)
	{
		var n=params.n||4;
		var b=params.b||0.25;
		var sum = [1];
		for(var i=1; i<n; i++) sum[i] = sum[i-1] + m_pow(b, i/2);
		var x = 2*sum[n-1]-1;
		for(i=0; i<n; i++)
		{
			if(x*progress >= (i>0 ? 2*sum[i-1]-1 : 0) && x*progress <= 2*sum[i]-1)
				return m_pow(x*(progress-(2*sum[i]-1-m_pow(b, i/2))/x), 2)+1-m_pow(b, i);
		}
		return 1;
	}
},
imageDataFilters={
	color:{fn:function(width,height,matrix,type){
		var old,i,j;
		matrix=matrix[type];
		for(i=0;i<width;i++)
		for(j=0;j<height;j++)
		{
			old=this.getPixel(i,j);
			old[matrix[0]]=old[matrix[0]]*2-old[matrix[1]]-old[matrix[2]];
			old[matrix[1]]=0;
			old[matrix[2]]=0;
			old[matrix[0]]=old[matrix[0]]>255?255:old[matrix[0]];
			this.setPixel(i,j,old);
		}
	},matrix:
		{
			red:[0,1,2],
			green:[1,0,2],
			blue:[2,0,1]
		}},
	linear:{fn:function(width,height,matrix,type){
		var newMatrix=[],old,i,j,k,m,n;
		matrix=matrix[type];
		m=matrix.length;
		n=matrix[0].length;
			for(i=0;i<width;i++)
			{
				newMatrix[i]=[];
				for(j=0;j<height;j++)
				{
					newMatrix[i][j]=[0,0,0,1];
					for(m=0;m<3;m++)
					for(n=0;n<3;n++)
					{
						old=this.getPixel(i-parseInt(m/2),j-parseInt(n/2));
						for(k=0;k<3;k++)
						{
							newMatrix[i][j][k]+=old[k]*matrix[m][n];
						}
					}
				}
			}
			for(i=0;i<width;i++)
			{
				for(j=0;j<height;j++)
					this.setPixel(i,j,newMatrix[i][j]);
			}
	},
		matrix:{
			sharp:[[-0.375,-0.375,-0.375],[-0.375,4,-0.375],[-0.375,-0.375,-0.375]],
			blur:[[0.111,0.111,0.111],[0.111,0.111,0.111],[0.111,0.111,0.111]]
		}
	}
}

function multiplyM(m1,m2)
{
	return [[(m1[0][0]*m2[0][0]+m1[0][1]*m2[1][0]),(m1[0][0]*m2[0][1]+m1[0][1]*m2[1][1]),(m1[0][0]*m2[0][2]+m1[0][1]*m2[1][2]+m1[0][2])],[(m1[1][0]*m2[0][0]+m1[1][1]*m2[1][0]),(m1[1][0]*m2[0][1]+m1[1][1]*m2[1][1]),(m1[1][0]*m2[0][2]+m1[1][1]*m2[1][2]+m1[1][2])]];
}
function multiplyPointM(x,y,m)
{
	return {
		x:(x*m[0][0]+y*m[0][1]+m[0][2]),
		y:(x*m[1][0]+y*m[1][1]+m[1][2])
	}
}
function transformPoint(x,y,m)
{
	return{
		x:(x*m[1][1]-y*m[0][1]+m[0][1]*m[1][2]-m[1][1]*m[0][2])/(m[0][0]*m[1][1]-m[1][0]*m[0][1]),
		y:(-x*m[1][0]+y*m[0][0]-m[0][0]*m[1][2]+m[1][0]*m[0][2])/(m[0][0]*m[1][1]-m[1][0]*m[0][1])
	}
}
function getRect(object,rect,type)
{
	if(type=='poor')return rect;
	var min={x:rect.x,y:rect.y},max={x:rect.x+rect.width,y:rect.y+rect.height},
	m=multiplyM(object.matrix(),objectLayer(object).matrix()),
	lt=multiplyPointM(min.x,min.y,m),
	rt=multiplyPointM(max.x,min.y,m),
	lb=multiplyPointM(min.x,max.y,m),
	rb=multiplyPointM(max.x,max.y,m),
	coords=[[lt.x,lt.y],[rt.x,rt.y],[lb.x,lb.y],[rb.x,rb.y]];
	if(type=='coords')return coords;
	var minX, minY,
	maxX=minX=lt.x,
	maxY=minY=lt.y;
	for(var i=0;i<4;i++)
	{
		if(maxX<coords[i][0])maxX=coords[i][0];
		if(maxY<coords[i][1])maxY=coords[i][1];
		if(minX>coords[i][0])minX=coords[i][0];
		if(minY>coords[i][1])minY=coords[i][1];
	}
	return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
}
function getObjectCenter(object)
{
	var point={};
	if(object.objs!==undefined || object._img!==undefined || object._proto=='text')
	{
		var rect=object.getRect('poor');
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
		r:0,
		g:0,
		b:0,
		a:0};
	if(color.id!==undefined)
	{
		colorKeeper.color.notColor={
			level:color._level,
			canvas:color.optns.canvas.number,
			layer:color.optns.layer.number
		}
		return colorKeeper;
	}
	if(color.r!==undefined)
	{
		colorKeeper=checkDefaults(color,{a:1});
		colorKeeper.color={
			val:'rgba('+colorKeeper.r+','+colorKeeper.g+','+colorKeeper.b+','+colorKeeper.a+')',
			notColor:undefined
		}
		return colorKeeper;
	}
	if(color.charAt(0)=='#')
	{
		colorKeeper.r=parseInt(color.substr(1,2),16);
		colorKeeper.g=parseInt(color.substr(3,2),16);
		colorKeeper.b=parseInt(color.substr(5,2),16);
		colorKeeper.a=1;
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
			colorKeeper.a=1;
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
		top: m_round(top),
		left: m_round(left)
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
	var canvas=objectCanvas(object);
	var ctx=canvas.optns.ctx;
	var layer=canvas.layers[object.optns.layer.number];
	point.x=x;
	point.y=y;
	if(FireFox)
	{
		point=transformPoint(x,y,multiplyM(object.matrix(),layer.matrix()));
	}
	if(ctx.isPointInPath===undefined || object._img!==undefined || object._imgData!==undefined || object._proto=='text')
	{
		var rectangle=object.getRect('poor');
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
	var x=optns.mousemove.x||optns.mousedown.x||optns.mouseup.x||optns.dblclick.x||optns.click.x;
	var y=optns.mousemove.y||optns.mousedown.y||optns.mouseup.y||optns.dblclick.y||optns.click.y;
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
		if(optns.dblclick.x!=false)
            optns.dblclick.object=object;
		if(optns.mouseup.x!=false)
			optns.mouseup.object=object;
		optns.point=point;
	}
}

function objectLayer(object)
{
	return objectCanvas(object).layers[object.optns.layer.number];
}
function objectCanvas(object)
{
	return canvases[object.optns.canvas.number];
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
		j:newLayer.optns.number
	};
	var oldArray=canvases[oldIndex.i].layers[oldIndex.j][array],newArray=canvases[newIndex.i].layers[newIndex.j][array];
	oldArray.splice(object.optns.number,1);
	object._level=object.optns.number=newArray.length;
	newArray[object._level]=object;
	objectLayer.number=newIndex.j;
	objectCanvas.number=newIndex.i;
	objectCanvas.id=newLayer.optns.canvas.id;
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
			oldArray.splice(object.optns.number,1);
			object._level=object.optns.number=newArray.length;
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
	array.sort(function(a,b){
		if(a._level>b._level)return 1;
		if(a._level<b._level)return -1;
		return 0;
	});
	normalizeLevels(array);
	return array.length;
}
function objDeleter(array)
{
	for(var i=0;i<array.length;i++)
	{
		if(array[i].optns.deleted)
			array.splice(i,1);
	}
	normalizeLevels(array);
	return array.length;
}
var proto={};
