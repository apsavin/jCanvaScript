proto.layer=function()
{
	this.canvas=function(idCanvas)
	{
		if (idCanvas===undefined)return this.idCanvas;
		if(this.optns.canvas.id==idCanvas)return this;
		var newCanvas=-1,oldCanvas=0,limitC=canvases.length;
		for(var i=0;i<limitC;i++)
		{
			var idCanvasItem=canvases[i].optns.id;
			if (idCanvasItem==idCanvas)newCanvas=i;
			if (idCanvasItem==this.optns.canvas.id)oldCanvas=i;
		}
		if(newCanvas<0){newCanvas=canvases.length;jCanvaScript.canvas(idCanvas);}
		this.optns.canvas.id=idCanvas;
		this.optns.canvas.number=newCanvas;
		canvases[oldCanvas].layers.splice(this._level,1);
		var layersArray=canvases[newCanvas].layers;
		this._level=layersArray.length;
		layersArray[this._level]=this;
		for(i=0;i<this.objs.length;i++)
		{
			var optns=this.objs[i].optns;
			optns.layer.number=this._level;
			optns.canvas.number=newCanvas;
		}
		canvases[newCanvas].optns.redraw=1;
		return this;
	}
	this.up=function(n)
	{
		if(n === undefined)n=1;
		if(n == 'top')n=objs[this._layer].length-1;
		this._level+=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].optns.layer.number=this._level;
		}
		var optns=canvases[this.optns.canvas.number].optns;
		optns.anyLayerLevelChanged = true;
		optns.redraw=1;
		return this;
	}
	this.down=function(n)
	{
		if(n == undefined)n=1;
		if(n == 'bottom')n=this._level;
		this._level-=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].options.layer.number=this._level;
		}
		var optns=canvases[this.optns.canvas.number].optns;
		optns.anyLayerLevelChanged = true;
		optns.redraw=1;
		return this;
	}
	this.del=function()
	{
		var optns=canvases[this.optns.canvas.number].optns;
		optns.anyLayerDeleted = true;
		this.draw = false;
		optns.redraw=1;
		return;
	}
	this.setOptns=function(ctx)
	{
		ctx.setTransform(1,0,0,1,0,0);
		proto.layer.prototype.setOptns.call(this,ctx);
		return this;
	}
	this.afterDraw=function(optns)
	{
		optns.ctx.closePath();
		optns.ctx.restore();
		if(this.optns.clipObject)
		{
			proto.layer.prototype.afterDraw.call(this.optns.clipObject,optns);
		}
	}
	this.clone=function(idLayer,params)
	{
		var clone=jCanvaScript.layer(idLayer);
		take(clone,this);
		clone.canvas(canvases[this.optns.canvas.number].optns.id);
		if(params===undefined) return clone;
		return clone.animate(params);
	}
	this.isPointIn=function(x,y,global)
	{
		for(var i=0;i<this.objs.length;i++)
			if(this.objs[i].isPointIn(x,y,global))
				return true;
		return false;
	}
	this.draw=function(canvasOptns)
	{
		var limitGrdntsNPtrns = this.grdntsnptrns.length;
		var limit=this.objs.length;
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
	this.base=function(idLayer)
	{
		var lastCanvasLayers=canvases[lastCanvas].layers,lastCanvasOptns=canvases[lastCanvas].optns;
		proto.layer.prototype.base.call(this,0,0,true);
		var limit=lastCanvasLayers.length;
		lastCanvasLayers[limit]=this;
		this.objs = [];
		this.grdntsnptrns = [];
		this._level=limit;
		this.optns.id=idLayer;
		var thisOptns=this.optns
		thisOptns.anyObjDeleted= false;
		thisOptns.anyObjLevelChanged= false;
		thisOptns.gCO= lastCanvasOptns.gCO;
		thisOptns.canvas.id=lastCanvasOptns.id;
		thisOptns.canvas.number=lastCanvas;
		return this;
	}
	this._proto='layer';
}
proto.layer.prototype=new proto.object;
function layers(idLayer)
{
	var layer=new proto.layer();
	return layer.base(idLayer);
}