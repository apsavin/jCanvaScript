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
		anyObjOnMouseMove:{val:false,x:false,y:false,object:false},
		anyObjOnMouseClick:{val:false,x:false,y:false,object:false},
		anyObjOnMouseUp:{val:false,x:false,y:false,object:false},
		anyObjOnMouseDown:{val:false,x:false,y:false,object:false},
		drag:{object:false,x:0,y:0},
		gCO: 'source-over'
	}
	canvas.layers=[];
	jCanvaScript.layer(idCanvas+'Layer_0').canvas(idCanvas);
	canvas.start=function(fps)
	{
		if(fps)
		{
			this.fps=parseInt(1000/fps);
			var offset=getOffset(this.cnv);
			this.optns.x=offset.left;
			this.optns.y=offset.top;
			var canvas=canvases[this.optns.number];
			this.cnv.onclick=function(e){
				if(!canvas.optns.anyObjOnMouseClick.val)return;
				var point=mouseEvent(e);
				setXY(point,'anyObjOnMouseClick',canvas.optns);
			};
			this.cnv.onmousedown=function(e){
				if(!canvas.optns.anyObjOnMouseDown.val)return;
				var point=mouseEvent(e);
				setXY(point,'anyObjOnMouseDown',canvas.optns);
			};
			this.cnv.onmouseup=function(e){
				if(!canvas.optns.anyObjOnMouseUp.val)return;
				var point=mouseEvent(e);
				setXY(point,'anyObjOnMouseUp',canvas.optns);
			};
			this.cnv.onkeyup=function(e){
				canvas.optns.keyUp.code=keyEvent(e).code;
				canvas.optns.keyUp.val=true;
			}
			this.cnv.onkeydown=function(e)
			{
				canvas.optns.keyDown.code=keyEvent(e).code;
				canvas.optns.keyDown.val=true;
			}
			this.cnv.onkeypress=function(e)
			{
				canvas.optns.keyPress.code=keyEvent(e).code;
				canvas.optns.keyPress.val=true;
			}
			this.cnv.onmousemove=function(e)
			{
				if(!canvas.optns.anyObjOnMouseMove.val)return;
				var event=mouseEvent(e);
				setXY(event,'anyObjOnMouseMove',canvas.optns);
				if(canvas.optns.drag.object!=false)
				{
					var drag=canvas.optns.drag;
					var point=transformPoint(canvas.optns.anyObjOnMouseMove.x,canvas.optns.anyObjOnMouseMove.y,[[drag.object.transform11.val,drag.object.transform21.val,drag.object.transformdx.val],[drag.object.transform12.val,drag.object.transform22.val,drag.object.transformdy.val]])
					drag.object.x.val=point.x-drag.x;
					drag.object.y.val=point.y-drag.y;
					if(drag.fn)drag.fn.call(drag.object,({x:drag.object.x.val,y:drag.object.y.val}));
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
	}
	canvas.clear=function()
	{
		clearInterval(this.interval);
		this.layers=[];
		jCanvaScript.layer(this.id.val+'Layer_0').canvas(this.id.val);
		this.optns.ctx.clearRect(0,0,this.optns.width,this.optns.height);
	}
	canvas.composite=function(composite)
	{
		if(composite===undefined)return this.optns.gCO;
		else this.optns.gCO=composite;
		return this;
	}
	canvas.frame=function()
	{
		this.optns.ctx.clearRect(0,0,this.optns.width,this.optns.height);
		var limit=this.layers.length;
		if(limit==0)return;
		if(this.anyLayerLevelChanged)
		{
			levelChanger(this.layers);
			this.anyLayerLevelChanged=false;
		}
		if(this.anyLayerDeleted)
		{
			limit=objDeleter(this.layers,limit);
			this.anyLayerDeleted=false;
		}
		for(var i=0;i<limit;i++)
			this.layers[i].draw(this.optns);
		if(this.optns.anyObjOnMouseMove.x!=false)
		{
			if(this.optns.anyObjOnMouseMove.object!=false)
			{
				var mousemoveObject=this.optns.anyObjOnMouseMove.object;
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
			this.optns.anyObjOnMouseMove.x=false;
		}
		if(this.optns.anyObjOnMouseDown.object!=false)
		{
			var mouseDown=this.optns.anyObjOnMouseDown;
			if(typeof mouseDown.object.onmousedown=='function')mouseDown.object.onmousedown({x:mouseDown.x,y:mouseDown.y});
			if(mouseDown.object.draggable.val==true)
			{			
				var drag=this.optns.drag;
				drag.object=mouseDown.object.draggable.object.visible(true);
				drag.fn=mouseDown.object.draggable.fn;
				drag.init=mouseDown.object;
				if(drag.init.draggable.params!==undefined)drag.object.animate(drag.init.draggable.params);
				var point=transformPoint(mouseDown.x,mouseDown.y,[[drag.object.transform11.val,drag.object.transform21.val,drag.object.transformdx.val],[drag.object.transform12.val,drag.object.transform22.val,drag.object.transformdy.val]]);
				drag.x=point.x-drag.object.x.val;
				drag.y=point.y-drag.object.y.val;
				if(drag.object!=drag.init && drag.init.draggable.type!='clone')
				{
					drag.object.x.val=point.x;
					drag.object.y.val=point.y;
					drag.x=drag.y=0;
				}
				drag.object.x.val+=drag.init.draggable.shiftX;
				drag.object.y.val+=drag.init.draggable.shiftY;
			}
			mouseDown.object=false;
		}
		if(this.optns.anyObjOnMouseUp.object!=false)
		{
			var mouseUp=this.optns.anyObjOnMouseUp;
			var drag=this.optns.drag;
			if(typeof mouseUp.object.onmouseup=='function')mouseUp.object.onmouseup({x:mouseUp.x,y:mouseUp.y});
			if(mouseUp.object.droppable.val==true && this.optns.drag.init!==undefined)
			{
				if(drag.init==drag.object)
					drag.init.visible(true);
				if(typeof mouseUp.object.droppable.fn=='function')mouseUp.object.droppable.fn.call(mouseUp.object,drag.init);
				drag={object:false,x:0,y:0};
			}
			else
			{
				if(drag.init!==undefined)
				{
					drag.object.visible(false);
					drag.init.visible(true);
					/*drag.init.x.val=drag.init.draggable.x;?????????? ??????????????????????
					drag.init.y.val=drag.init.draggable.y;???????????? ??????????*/
					drag.init.x.val=drag.object.x.val;
					drag.init.y.val=drag.object.y.val;
					if(drag.object!=drag.init)drag.object.visible(false);
					this.optns.drag={object:false,x:0,y:0};
				}
			}
			mouseUp.object=false;
		}
		if(this.optns.anyObjOnMouseClick.object!=false)
		{
			var mouseClick=this.optns.anyObjOnMouseClick;
			if(typeof mouseClick.object.onclick == 'function')
				mouseClick.object.onclick({x:mouseClick.x,y:mouseClick.y});
			mouseClick.object=false;
		}
		this.optns.anyObjOnMouseMove.object=this.optns.keyUp.val=this.optns.keyDown.val=this.optns.keyPress.val=this.optns.anyObjOnMouseClick.x=this.optns.anyObjOnMouseUp.x=this.optns.anyObjOnMouseDown.x=false;
	}
	return canvas;
}