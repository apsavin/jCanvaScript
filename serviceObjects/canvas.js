jCanvaScript.canvas = function(idCanvas)
{
	if(idCanvas===undefined)return canvases[0];
	var limit=canvases.length;
	for (var i=0;i<limit;i++)
		if(canvases[i].optns)
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
	if ('\v'=='v')
	{
		if(typeof G_vmlCanvasManager!=='undefined')
			G_vmlCanvasManager.initElement(canvas.cnv);
		if(typeof FlashCanvas !=='undefined')
			FlashCanvas.initElement(canvas.cnv);
	}
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
		mousemove:{val:false,x:false,y:false,objects:[]},
		click:{val:false,x:false,y:false,objects:[]},
		dblclick:{val:false,x:false,y:false,objects:[]},
		mouseup:{val:false,x:false,y:false,objects:[]},
		mousedown:{val:false,x:false,y:false,objects:[]},
		drag:{object:false,x:0,y:0},
		gCO: 'source-over',
		redraw:1
	}
	canvas.toDataURL=function(){return canvas.cnv.toDataURL.apply(canvas.cnv,arguments);}
	canvas.layers=[];
	canvas.interval=0;
	jCanvaScript.layer(idCanvas+'Layer_0').canvas(idCanvas);
	canvas.start=function(isAnimated)
	{
		lastCanvas=this.optns.number;
		if(isAnimated)
		{
			if(this.interval)return this;
			this.isAnimated=isAnimated;
			var offset=getOffset(this.cnv);
			this.optns.x=offset.left+(parseInt(this.cnv.style.borderTopWidth)||0);
			this.optns.y=offset.top+(parseInt(this.cnv.style.borderLeftWidth)||0);
			var canvas=canvases[this.optns.number];
			this.cnv.onclick=function(e){
				if(!canvas.optns.click.val)return;
				mouseEvent(e,'click',canvas.optns);
			}
			this.cnv.ondblclick=function(e){
				if(!canvas.optns.dblclick.val)return;
				mouseEvent(e,'dblclick',canvas.optns);
			}
			this.cnv.onmousedown=function(e){
				if(!canvas.optns.mousedown.val)return;
				mouseEvent(e,'mousedown',canvas.optns);
			}
			this.cnv.onmouseup=function(e){
				if(!canvas.optns.mouseup.val)return;
				mouseEvent(e,'mouseup',canvas.optns);
			}
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
			this.interval=requestAnimFrame(function(){
					canvas.interval=canvas.interval||1;
					canvas.frame();},
				this.cnv);
		}
		else return this.frame();
		return this;
	}
	canvas.pause=function()
	{
		cancelRequestAnimFrame(this.interval);
		this.interval=0;
	}
	canvas.del=function()
	{
		cancelRequestAnimFrame(this.interval);
		this.layers=[];
		canvases.splice(this.optns.number,1);
		for(var i=0;i<canvases.length;i++)
		{
			var canvas=canvases[i],
			layers=canvas.layers,
			limitL=layers.length;
			canvas.optns.number=i;
			for(var j=0;j<limitL;j++)
			{
				var layer=layers[j];
				layer.optns.canvas.number=i;
				setLayerAndCanvasToArray(layer.objs,layer.optns.id,layer.optns.number,canvas.optns.id,canvas.optns.number);
				setLayerAndCanvasToArray(layer.grdntsnptrns,layer.optns.id,layer.optns.number,canvas.optns.id,canvas.optns.number);
			}
		}
		if(this.cnv.parentNode)this.cnv.parentNode.removeChild(this.cnv);
		lastCanvas=0;
		return false;
	}
	canvas.clear=function()
	{
		cancelRequestAnimFrame(this.interval);
		this.interval=0;
		this.layers=[];
		jCanvaScript.layer(this.optns.id+'Layer_0').canvas(this.optns.id);
		this.optns.ctx.clearRect(0,0,this.optns.width,this.optns.height);
		this.optns.redraw++;
		return this;
	}
	canvas.frame=function()
	{
		var optns=this.optns,thisCanvas=this;
		if(this.interval)
		{
			this.interval=requestAnimFrame(function(){thisCanvas.frame();},this.cnv);
			this.interval=this.interval||1;
		}
		if(!optns.redraw)return this;
		optns.redraw--;
		optns.ctx.clearRect(0,0,optns.width,optns.height);
		if(this.layers.length==0)return this;
		limit=this.layers.length;
		if(optns.anyLayerLevelChanged)
			limit=levelChanger(this.layers);
		if(optns.anyLayerDeleted)
			limit=objDeleter(this.layers);
		if(optns.anyLayerLevelChanged || optns.anyLayerDeleted)
		{
			optns.anyLayerLevelChanged=optns.anyLayerDeleted=false;
			for(var i=0;i<limit;i++)
			{
				var layer=this.layers[i],layerOptns=layer.optns;
				setLayerAndCanvasToArray(layer.objs,layerOptns.id,layerOptns.number,this.optns.id,this.optns.number);
				setLayerAndCanvasToArray(layer.grdntsnptrns,layerOptns.id,layerOptns.number,idCanvas,this.optns.number);
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
			var point = this.optns.point||{},
				mm=optns.mousemove;
			point.event=mm.event;
			if(mm.objects!=false)
			{
				for(i=mm.objects.length-1;i>-1;i--)
				{
					var mousemoveObject=mm.objects[i];
					if(underMouse===mousemoveObject)
					{
						if(typeof mousemoveObject.onmousemove=='function')
						{
							if(mousemoveObject.onmousemove(point)===false)break;
						}
					}
					else
					{
						if(underMouse==false)
						{
							if(typeof mousemoveObject.onmouseover=='function')
							{
								if(mousemoveObject.onmouseover(point)===false)break;
							}
						}
						else
						{
							if(typeof underMouse.onmouseout=='function'){underMouse.onmouseout(point);}
							if(typeof mousemoveObject.onmouseover=='function')
							{
								if(mousemoveObject.onmouseover(point)===false)break;
							}
						}
						underMouse=mousemoveObject;
					}
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
			optns.mousemove.objects=[];
		}
		if(optns.mousedown.objects.length)
		{
			var mouseDown=this.optns.mousedown;
			mdCicle:
			for(i=mouseDown.objects.length-1;i>-1;i--)
			{
				var mouseDownObjects=[mouseDown.objects[i],objectLayer(mouseDown.objects[i])];
				for(var j=0;j<2;j++)
				{
					if(mouseDownObjects[j].optns.drag.val==true)
					{
						var drag=optns.drag;
						drag.object=mouseDownObjects[j].optns.drag.object.visible(true);
						drag.fn=mouseDownObjects[j].optns.drag.fn;
						drag.init=mouseDownObjects[j];
						if(drag.init.optns.drag.params!==undefined)drag.object.animate(drag.init.optns.drag.params);
						point=transformPoint(mouseDown.x,mouseDown.y,drag.object.matrix());
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
					if(typeof mouseDownObjects[j].onmousedown=='function')
						if(mouseDownObjects[j].onmousedown({x:mouseDown.x,y:mouseDown.y,event:mouseDown.event})===false)
							break mdCicle;
				}
			}
			mouseDown.objects=[];
		}
		if(optns.mouseup.objects.length)
		{
			var mouseUp=optns.mouseup;
			muCicle:
			for(i=mouseUp.objects.length-1;i>-1;i--)
			{
				var mouseUpObjects=[mouseUp.objects[i],objectLayer(mouseUp.objects[i])];
				drag=optns.drag;
				for(j=0;j<2;j++)
				{
					if(mouseUpObjects[j].optns.drop.val==true && optns.drag.init!==undefined)
					{
						if(drag.init==drag.object)
							drag.init.visible(true);
						if(typeof mouseUpObjects[j].optns.drop.fn=='function')
							mouseUpObjects[j].optns.drop.fn.call(mouseUpObjects[j],drag.init);
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
						}
					}
					if(typeof mouseUpObjects[j].onmouseup=='function')
						if(mouseUpObjects[j].onmouseup({x:mouseUp.x,y:mouseUp.y,event:mouseUp.event})===false)
							break muCicle;
				}
			}
			this.optns.drag={object:false,x:0,y:0};
			mouseUp.objects=[];
		}
		if(optns.click.objects.length)
		{
			var click=this.optns.click;
			cCicle:
			for(i=click.objects.length-1;i>-1;i--)
			{
				var mouseClickObjects=[click.objects[i],objectLayer(click.objects[i])];
				for(j=0;j<2;j++)
				{
					if(typeof mouseClickObjects[j].onclick == 'function')
						if(mouseClickObjects[j].onclick({x:click.x,y:click.y,event:click.event})===false)
							break cCicle;
				}
			}
			click.objects=[];
		}
		if(optns.dblclick.objects.length)
        {
            var dblClick=this.optns.dblclick;
			dcCicle:
			for(i=dblClick.objects.length-1;i>-1;i--)
			{
				var mouseDblClickObjects=[dblClick.objects[i],objectLayer(dblClick.objects[i])];
				for(j=0;j<2;j++)
				{
					if(typeof mouseDblClickObjects[j].ondblclick == 'function')
						if(mouseDblClickObjects[j].ondblclick({x:dblClick.x,y:dblClick.y, event:dblClick.event})===false)
							break dcCicle;
				}
			}
            dblClick.objects=[];
        }
		optns.keyUp.val=optns.keyDown.val=optns.keyPress.val=optns.click.x=optns.dblclick.x=optns.mouseup.x=optns.mousedown.x=optns.mousemove.x=false;
		return this;
	}
	return canvas;
}