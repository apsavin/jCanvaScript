jCanvaScript.canvas = function(idCanvas)
{
	if(idCanvas===undefined)return canvases[0];
	var limit=canvases.length;
	for (var i=0;i<limit;i++)
		if(canvases[i]._optns)
			if(canvases[i]._optns.id==idCanvas)return canvases[i];
	var canvas={
		id:function(id)
		{
			if(id===undefined)return this._optns.id;
			this._optns.id=id;
			return this;
		}
	};
	canvases[limit]=canvas;
	lastCanvas=limit;
	canvas._cnv=document.getElementById(idCanvas);
	if ('\v'=='v')
	{
		if(typeof G_vmlCanvasManager!=='undefined')
			G_vmlCanvasManager.initElement(canvas._cnv);
		if(typeof FlashCanvas !=='undefined')
			FlashCanvas.initElement(canvas._cnv);
	}
	canvas._optns =
	{
		id:idCanvas,
		number:lastCanvas,
		ctx: canvas._cnv.getContext('2d'),
		width: canvas._cnv.offsetWidth||canvas._cnv.width,
		height: canvas._cnv.offsetHeight||canvas._cnv.height,
		anyLayerDeleted: false,
		anyLayerLevelChanged:false,
		keyDown:{val:false,code:false},
		keyUp:{val:false,code:false},
		keyPress:{val:false,code:false},
		mousemove:{val:false,x:false,y:false,object:false},
		click:{val:false,x:false,y:false,objects:[]},
		dblclick:{val:false,x:false,y:false,objects:[]},
		mouseup:{val:false,x:false,y:false,objects:[]},
		mousedown:{val:false,x:false,y:false,objects:[]},
		drag:{object:false,x:0,y:0},
		gCO: 'source-over',
		redraw:1
	}
	canvas.toDataURL=function(){return canvas._cnv.toDataURL.apply(canvas._cnv,arguments);}
	canvas.layers=[];
	canvas.interval=0;
	jCanvaScript.layer(idCanvas+'Layer_0').canvas(idCanvas);
	canvas.start=function(isAnimated)
	{
		lastCanvas=this._optns.number;
		if(isAnimated)
		{
			if(this.interval)return this;
			this.isAnimated=isAnimated;
<<<<<<< HEAD
			var offset=getOffset(this._cnv);
			this._optns.x=offset.left+(parseInt(this._cnv.style.borderTopWidth)||0);
			this._optns.y=offset.top+(parseInt(this._cnv.style.borderLeftWidth)||0);
			var canvas=canvases[this._optns.number],
			optns=canvas._optns;
			this._cnv.onclick=function(e){
				mouseEvent(e,'click',optns);
			}
			this._cnv.ondblclick=function(e){
				mouseEvent(e,'dblclick',optns);
				optns.redraw++;
			}
			this._cnv.onmousedown=function(e){
				mouseEvent(e,'mousedown',optns);
			}
			this._cnv.onmouseup=function(e){
=======
			var offset=getOffset(this.cnv);
			this.optns.x=offset.left+(parseInt(this.cnv.style.borderTopWidth)||0);
			this.optns.y=offset.top+(parseInt(this.cnv.style.borderLeftWidth)||0);
			var canvas=canvases[this.optns.number],
			optns=canvas.optns;
			this.cnv.onclick=function(e){
				mouseEvent(e,'click',optns);
			}
			this.cnv.ondblclick=function(e){
				mouseEvent(e,'dblclick',optns);
				var tmp=optns.mousemove.val;
				optns.mousemove.val=true;
				setTimeout(function(){optns.mousemove.val=tmp;},3000);
			}
			this.cnv.onmousedown=function(e){
				mouseEvent(e,'mousedown',optns);
			}
			this.cnv.onmouseup=function(e){
>>>>>>> 7f0450d1a077fbe3515c208bd38183ffb8500e02
				mouseEvent(e,'mouseup',optns);
			}
			this._cnv.onkeyup=function(e){
				keyEvent(e,'keyUp',optns);
			}
			this._cnv.onkeydown=function(e)
			{
				keyEvent(e,'keyDown',optns);
			}
			this._cnv.onkeypress=function(e)
			{
				keyEvent(e,'keyPress',optns);
			}
			this._cnv.onmouseout=this._cnv.onmousemove=function(e)
			{
				mouseEvent(e,'mousemove',optns);
			}
			optns.timeLast=new Date();
			this.interval=requestAnimFrame(function(time){
					canvas.interval=canvas.interval||1;
					canvas.frame(time);},
				this._cnv);
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
		canvases.splice(this._optns.number,1);
		for(var i=0;i<canvases.length;i++)
		{
			var canvas=canvases[i],
			layers=canvas.layers,
			limitL=layers.length;
			canvas._optns.number=i;
			for(var j=0;j<limitL;j++)
			{
				var layer=layers[j];
				layer._optns.canvas.number=i;
				setLayerAndCanvasToArray(layer.objs,layer._optns.id,layer._optns.number,canvas._optns.id,canvas._optns.number);
				setLayerAndCanvasToArray(layer.grdntsnptrns,layer._optns.id,layer._optns.number,canvas._optns.id,canvas._optns.number);
			}
		}
		if(this._cnv.parentNode)this._cnv.parentNode.removeChild(this._cnv);
		lastCanvas=0;
		return false;
	}
	canvas.clear=function()
	{
		cancelRequestAnimFrame(this.interval);
		var optns=this._optns;
		this.interval=0;
		this.layers=[];
		jCanvaScript.layer(optns.id+'Layer_0').canvas(optns.id);
		optns.ctx.clearRect(0,0,optns.width,optns.height);
		optns.redraw=1;
		return this;
	}
	canvas.frame=function(time)
	{
		var optns=this._optns,thisCanvas=this;
		time=time||(new Date());
		optns.timeDiff=time-optns.timeLast;
		optns.timeLast=time;
		if(this.interval)
		{
			this.interval=requestAnimFrame(function(time){thisCanvas.frame(time);},thisCanvas._cnv);
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
				var layer=this.layers[i],layerOptns=layer._optns;
				setLayerAndCanvasToArray(layer.objs,layerOptns.id,layerOptns.number,this._optns.id,this._optns.number);
				setLayerAndCanvasToArray(layer.grdntsnptrns,layerOptns.id,layerOptns.number,idCanvas,this._optns.number);
			}
		}
		for(i=0;i<limit;i++)
		{
			var object=this.layers[i];
			if(typeof (object.draw)=='function')
				if(object.beforeDraw(optns))
				{
					if(typeof (object.draw)=='function')
					{
						object.draw(optns);
						object.afterDraw(optns);
					}
				}
		}
		var mm=optns.mousemove;
		var mouseDown=optns.mousedown;
		var mouseUp=optns.mouseup;
		var click=this.optns.click;
		var dblClick=this.optns.dblclick;
		if(mm.x!=false)
		{
			if(optns.drag.object!=false)
			{
				var drag=optns.drag,
					dobject=drag.object;
				dobject.translate(mm.x-drag.x,mm.y-drag.y);
				drag.x=mm.x;
				drag.y=mm.y;
				if(drag.drag)drag.drag.call(dobject,{x:mm.x,y:mm.y});
			}
			var point = this._optns.point||{};
			point.event=mm.event;
			if(mm.object!=false)
			{
				var mousemoveObject=mm.object;
				if(underMouse===mousemoveObject)
				{
					if(typeof mousemoveObject.onmousemove=='function')
						mousemoveObject.onmousemove(point);
				}
				else
				{
					if(underMouse!=false)
						if(typeof underMouse.onmouseout=='function')
							underMouse.onmouseout(point);
					if(typeof mousemoveObject.onmouseover=='function')
						mousemoveObject.onmouseover(point);
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
			optns.mousemove.object=false;
		}
		if(mouseDown.objects.length)
		{
<<<<<<< HEAD
			var mouseDown=this._optns.mousedown;
=======
>>>>>>> 7f0450d1a077fbe3515c208bd38183ffb8500e02
			mdCicle:
			for(i=mouseDown.objects.length-1;i>-1;i--)
			{
				var mouseDownObjects=[mouseDown.objects[i],objectLayer(mouseDown.objects[i])], mdObject;
				for(var j=0;j<2;j++)
				{
					mdObject=mouseDownObjects[j];
					if(mdObject._optns.drag.val==true && mdObject._optns.drag.disabled==false)
					{
						drag=optns.drag;
						dobject=drag.object=mdObject._optns.drag.object.visible(true);
						drag.drag=mdObject._optns.drag.drag;
						drag.init=mdObject;
						var initoptns=drag.init._optns;
						if(initoptns.drag.params!==undefined)dobject.animate(initoptns.drag.params);
						drag.x=drag.startX=mouseDown.x;
						drag.y=drag.startY=mouseDown.y;
						if(dobject!=drag.init && initoptns.drag.type!='clone')
						{
							point=transformPoint(mouseDown.x,mouseDown.y,dobject.matrix());
							dobject.translate(point.x-dobject._x,point.y-dobject._y);
						}
						dobject.translate(initoptns.drag.shiftX,initoptns.drag.shiftY);
						if(typeof initoptns.drag.start=='function')
							initoptns.drag.start.call(dobject,{x:mouseDown.x,y:mouseDown.y});
					}
					if(typeof mdObject.onmousedown=='function')
						if(mdObject.onmousedown({x:mouseDown.x,y:mouseDown.y,event:mouseDown.event})===false)
							break mdCicle;
				}
			}
			mouseDown.objects=[];
		}
		if(mouseUp.objects.length)
		{
			muCicle:
			for(i=mouseUp.objects.length-1;i>-1;i--)
			{
				var mouseUpObjects=[mouseUp.objects[i],objectLayer(mouseUp.objects[i])],muObject;
				drag=optns.drag;
				for(j=0;j<2;j++)
				{
					muObject=mouseUpObjects[j];
<<<<<<< HEAD
					if(muObject._optns.drop.val==true && optns.drag.init!==undefined)
					{
						if(drag.init==drag.object)
							drag.init.visible(true);
						if(typeof muObject._optns.drop.fn=='function')
							muObject._optns.drop.fn.call(muObject,drag.init);
					}
					else
					{
						if(drag.init!==undefined)
=======
					if(optns.drag.init!==undefined)
					{
						if(muObject.optns.drop.val==true)
						{

							if(drag.init==drag.object)
								drag.init.visible(true);
							if(typeof muObject.optns.drop.fn=='function')
								muObject.optns.drop.fn.call(muObject,drag.init);
						}
						else
>>>>>>> 7f0450d1a077fbe3515c208bd38183ffb8500e02
						{
							drag.object.visible(false);
							drag.init.visible(true);
							drag.init._optns.translateMatrix[0][2]=drag.object._optns.translateMatrix[0][2];
							drag.init._optns.translateMatrix[1][2]=drag.object._optns.translateMatrix[1][2];
							changeMatrix(drag.init);
							if(drag.object!=drag.init)drag.object.visible(false);
							if(typeof drag.init._optns.drag.stop=='function')
								drag.init._optns.drag.stop.call(drag.init,{x:mouseUp.x,y:mouseUp.y});
						}
						if(drag.x!=drag.startX || drag.y!==drag.startY)click.objects=[];
					}
					if(typeof muObject.onmouseup=='function')
						if(muObject.onmouseup({x:mouseUp.x,y:mouseUp.y,event:mouseUp.event})===false)
							break muCicle;
				}
			}
			this._optns.drag={object:false,x:0,y:0};
			mouseUp.objects=[];
		}
		if(click.objects.length)
		{
<<<<<<< HEAD
			var click=this._optns.click;
=======
>>>>>>> 7f0450d1a077fbe3515c208bd38183ffb8500e02
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
		if(dblClick.objects.length)
        {
<<<<<<< HEAD
            var dblClick=this._optns.dblclick;
=======
>>>>>>> 7f0450d1a077fbe3515c208bd38183ffb8500e02
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
		optns.keyUp.val=optns.keyDown.val=optns.keyPress.val=click.x=dblClick.x=mouseUp.x=mouseDown.x=mm.x=false;
		return this;
	}
	return canvas;
}