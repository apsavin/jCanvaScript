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