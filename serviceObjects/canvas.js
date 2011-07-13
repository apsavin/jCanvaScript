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
	if ('\v'=='v' && G_vmlCanvasManager!==undefined)G_vmlCanvasManager.initElement(canvas.cnv);
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
					var mousemove=canvas.optns.mousemove;
					var point=transformPoint(mousemove.x,mousemove.y,drag.object.matrix());
					drag.object.transform(1,0,0,1,point.x-drag.x,point.y-drag.y);
					if(drag.fn)drag.fn.call(drag.object,({x:mousemove.x,y:mousemove.y}));
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
	canvas.del=function()
	{
		clearInterval(this.interval);
		this.layers=[];
		canvases.splice(this.optns.number,1);
		if(this.cnv.length)this.cnv.parentNode.removeChild(this.optns.id);
		lastCanvas=0;
		return false;
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
			levelChanger(this.layers);
		if(optns.anyLayerDeleted)
			limit=objDeleter(this.layers);
		if(optns.anyLayerLevelChanged || optns.anyLayerDeleted)
		{
			optns.anyLayerLevelChanged=optns.anyLayerDeleted=false;
			normalizeLevels(this.layers);
			for(var i=0;i<limit;i++)
			{
				var layer=this.layers[i];
				for(var j=0;i<layer.objs.length;i++)
					layer.objs[j].optns.layer.number=layer._level;
			}
		}
		for(i=0;i<limit;i++)
		{
			var object=this.layers[i];
			if(typeof (object.draw)=='function')
				if(object.beforeDraw(optns.ctx))
				{
					if(typeof (object.draw)=='function')
					{
						object.draw(optns.ctx);
						object.afterDraw(optns);
					}
				}
		}
		if(optns.mousemove.x!=false)
		{
			var point = this.optns.point;
			if(optns.mousemove.object!=false)
			{
				var mousemoveObject=optns.mousemove.object;
				if(underMouse===mousemoveObject)
				{
					if(typeof mousemoveObject.onmousemove=='function')
					{
						mousemoveObject.onmousemove(point);
					}
				}
				else
				{
					if(underMouse==false)
					{
						if(typeof mousemoveObject.onmouseover=='function'){mousemoveObject.onmouseover(point);}
					}
					else
					{
						if(typeof underMouse.onmouseout=='function'){underMouse.onmouseout(point);}
						if(typeof mousemoveObject.onmouseover=='function'){mousemoveObject.onmouseover(point);}
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
						underMouse.onmouseout(point);
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
			var mouseClickObjects=[mouseClick.object,objectLayer(mouseClick.object)];
			for(i=0;i<2;i++)
			{
				if(typeof mouseClickObjects[i].onclick == 'function')
					mouseClickObjects[i].onclick({x:mouseClick.x,y:mouseClick.y});
			}
			mouseClick.object=false;
		}
		if(this.optns.dblclick.object!=false)
        {
            var mouseDblClick=this.optns.dblclick;
            var mouseDblClickObjects=[mouseDblClick.object,objectLayer(mouseDblClick.object)];
            for(i=0;i<2;i++)
            {
                if(typeof mouseDblClickObjects[i].ondblclick == 'function')
                    mouseDblClickObjects[i].ondblclick({x:mouseDblClick.x,y:mouseDblClick.y});
            }
            mouseDblClick.object=false;
        }
		this.optns.mousemove.object=this.optns.keyUp.val=this.optns.keyDown.val=this.optns.keyPress.val=this.optns.click.x=this.optns.dblclick.x=this.optns.mouseup.x=this.optns.mousedown.x=this.optns.mousemove.x=false;
	}
	return canvas;
}