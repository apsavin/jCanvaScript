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
    canvas.width = function(width){
        if(width === undefined)
            return this.cnv.width;
        this.optns.width = this.cnv.width = width;
        this.cnv.style.width = width + 'px';
        this.optns.redraw = 1;
        return this;
    }
    canvas.height = function(height){
        if(height === undefined)
            return this.cnv.height;
        this.optns.heigth = this.cnv.height = height;
        this.cnv.style.height = height + 'px';
        this.optns.redraw = 1;
        return this;
    }
	canvas.optns =
	{
		id:idCanvas,
		number:lastCanvas,
		ctx: canvas.cnv.getContext('2d'),
		width: canvas.cnv.offsetWidth||canvas.cnv.width,
		height: canvas.cnv.offsetHeight||canvas.cnv.height,
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
	canvas.toDataURL=function(){return canvas.cnv.toDataURL.apply(canvas.cnv,arguments);}
	canvas.layers=[];
	canvas.interval=0;
	jCanvaScript.layer(idCanvas+'Layer_0').canvas(idCanvas);
    canvas.recalculateOffset = function() {
        var offset=getOffset(this.cnv);
        this.optns.x=offset.left+(parseInt(this.cnv.style.borderTopWidth)||0);
        this.optns.y=offset.top+(parseInt(this.cnv.style.borderLeftWidth)||0);
        return this;
    }
	canvas.start=function(isAnimated) {
		lastCanvas=this.optns.number;
		if(isAnimated)
		{
			if(this.interval)return this;
			this.isAnimated=isAnimated;
			this.recalculateOffset();
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
				mouseEvent(e,'mouseup',optns);
			}
			this.cnv.onkeyup=function(e){
				keyEvent(e,'keyUp',optns);
			}
			this.cnv.onkeydown=function(e)
			{
				keyEvent(e,'keyDown',optns);
			}
			this.cnv.onkeypress=function(e)
			{
				keyEvent(e,'keyPress',optns);
			}
			this.cnv.onmouseout=this.cnv.onmousemove=function(e)
			{
				mouseEvent(e,'mousemove',optns);
			};
			optns.timeLast=new Date();
			this.interval=requestAnimFrame(function(time){
					canvas.interval=canvas.interval||1;
					canvas.frame(time);},
				this.cnv);
		}
		else return this.frame();
		return this;
	}
	canvas.pause=function() {
		cancelRequestAnimFrame(this.interval);
		this.interval=0;
        return this;
	}
    canvas.restart = function() {
        return this.pause().start(true);
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
	canvas.frame=function(time)
	{
		var optns=this.optns,thisCanvas=this;
		time=time||(new Date());
		optns.timeDiff=time-optns.timeLast;
		optns.timeLast=time;
		if(this.interval)
		{
			this.interval=requestAnimFrame(function(time){thisCanvas.frame(time);},thisCanvas.cnv);
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
			var point = this.optns.point||{};
			point.event=mm.event;
			if(mm.object!=false)
			{
				var mousemoveObject=mm.object,
                    mousemoveLayer = objectLayer(mousemoveObject);
                if(underMouse===mousemoveObject)
                {
                    if(typeof mousemoveObject.onmousemove === 'function'){
                        mousemoveObject.onmousemove(point);
                    }
                    if(mousemoveLayer === underMouseLayer){
                        if(typeof mousemoveLayer.onmousemove === 'function'){
                            mousemoveLayer.onmousemove(point);
                        }
                    }
                    else {
                        if(underMouseLayer){
                            if(typeof underMouseLayer.onmouseout === 'function'){
                                underMouseLayer.onmouseout(point);
                            }
                        }
                        if(typeof mousemoveLayer.onmouseover === 'function'){
                            mousemoveLayer.onmouseover(point);
                        }
                        underMouseLayer = mousemoveLayer;
                    }
                }
                else
                {
                    if(underMouse){
                        if(typeof underMouse.onmouseout === 'function'){
                            underMouse.onmouseout(point);
                        }
                    }
                    if(typeof mousemoveObject.onmouseover === 'function'){
                        mousemoveObject.onmouseover(point);
                    }
                    underMouse = mousemoveObject;
                }
			}
			else
			{
                if(underMouse)
                {
                    if(typeof underMouse.onmouseout=='function')
                    {
                        underMouse.onmouseout(point);
                    }
                    underMouse=false;
                }
                if(underMouseLayer)
                {
                    if(typeof underMouseLayer.onmouseout=='function')
                    {
                        underMouseLayer.onmouseout(point);
                    }
                    underMouseLayer=false;
                }
			}
			optns.mousemove.object=false;
		}
		if(mouseDown.objects.length)
		{
			var mdObjectsLength = mouseDown.objects.length - 1;
			mdCicle:
			for(i=mdObjectsLength;i>-1;i--)
			{
				var mouseDownObjects=[mouseDown.objects[i],objectLayer(mouseDown.objects[i])], mdObject;
				for(var j=0;j<2;j++)
				{
					mdObject=mouseDownObjects[j];
					if(mdObject.optns.drag.val==true && mdObject.optns.drag.disabled==false && i == mdObjectsLength)
					{
						drag=optns.drag;
						dobject=drag.object=mdObject.optns.drag.object.visible(true);
						drag.drag=mdObject.optns.drag.drag;
						drag.init=mdObject;
						var initoptns=drag.init.optns;
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
				for(j=0;j<2;j++)
				{
					muObject=mouseUpObjects[j];
					if(stopDrag(muObject, mouseUp, optns))click.objects=[];
					if(typeof muObject.onmouseup=='function')
						if(muObject.onmouseup({x:mouseUp.x,y:mouseUp.y,event:mouseUp.event})===false)
							break muCicle;
				}
			}
			this.optns.drag={object:false,x:0,y:0};
			mouseUp.objects=[];
		}
		if(click.objects.length)
		{
			cCicle:
			for(i=click.objects.length-1;i>-1;i--)
			{
				var mouseClickObjects=[click.objects[i],objectLayer(click.objects[i])], clickObject;
				for(j=0;j<2;j++)
				{
                    clickObject = mouseClickObjects[j];
                    stopDrag(clickObject, click, optns);
					if(typeof clickObject.onclick == 'function')
						if(clickObject.onclick({x:click.x,y:click.y,event:click.event})===false)
							break cCicle;
				}
			}
            this.optns.drag={object:false,x:0,y:0};
			click.objects=[];
		}
		if(dblClick.objects.length)
        {
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
function stopDrag(object, event, optns){
    var drag=optns.drag;
    if(optns.drag.init && optns.drag.object)
    {
        if(object.optns.drop.val==true)
        {

            if(drag.init==drag.object)
                drag.init.visible(true);
            if(typeof object.optns.drop.fn=='function')
                object.optns.drop.fn.call(object,drag.init);
        }
        else
        {
            drag.object.visible(false);
            drag.init.visible(true);
            drag.init.optns.translateMatrix[0][2]=drag.object.optns.translateMatrix[0][2];
            drag.init.optns.translateMatrix[1][2]=drag.object.optns.translateMatrix[1][2];
            changeMatrix(drag.init);
            if(drag.object!=drag.init)drag.object.visible(false);
            if(typeof drag.init.optns.drag.stop=='function')
                drag.init.optns.drag.stop.call(drag.init,{x:event.x,y:event.y});
        }
        return (drag.x!=drag.startX || drag.y!==drag.startY)
    }
    return false;
}