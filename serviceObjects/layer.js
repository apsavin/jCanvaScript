jCanvaScript.layer=function(idLayer)
{
	if(idLayer===undefined)return canvases[0].layers[0];
	var limit=0;
	for(var i=0;i<canvases.length;i++)
	{
		limit=canvases[i].layers.length;
		for (var j=0;j<limit;j++)
			if(canvases[i].layers[j].id.val==idLayer)return canvases[i].layers[j];
	}
	var layer={};
	var tmpObj=obj();
	limit=canvases[lastCanvas].layers.length;
	canvases[lastCanvas].layers[limit]=layer;
	layer.objs = [];
	layer.grdntsnptrns = [];
	layer.level={val:limit,current:limit};
	layer.id=tmpObj.id;
	layer.id.val=idLayer;
	layer.animate=tmpObj.animate;
	layer.animating=tmpObj.animating;
	layer.optns={
		anyObjDeleted: false,
		anyObjLevelChanged: false,
		gCO: canvases[lastCanvas].optns.gCO
	}
	layer.canvas=function(idCanvas)
	{
		if (idCanvas===undefined)return this.canvas.val;
		if(this.canvas.val==idCanvas)return this;
		var newCanvas=-1;
		var oldCanvas=0;
		for(var i=0;i<canvases.length;i++)
		{
			if (canvases[i].id.val==idCanvas)newCanvas=i;
			if (canvases[i].id.val==this.canvas.val)oldCanvas=i;
		}
		if(newCanvas<0){newCanvas=canvases.length;jCanvaScript.canvas(idCanvas);}
		this.canvas.val=idCanvas;
		this.canvas.number=newCanvas;
		canvases[oldCanvas].layers.splice(this.level.val,1);
		this.level.val=this.level.current=canvases[newCanvas].layers.length;
		canvases[newCanvas].layers[this.level.val]=this;
		for(i=0;i<this.objs.length;i++)
		{
			this.objs[i].layer.number=this.level.val;
			this.objs[i].layer.canvas=newCanvas;
		}
		return this;
	}
	layer.canvas.val=canvases[lastCanvas].id.val;
	layer.canvas.number=lastCanvas;
	layer.up=function(n)
	{						
		if(n === undefined)n=1;
		if(n == 'top')n=objs[this.layer.val].length-1;
		this.level.val+=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].layer.number=this.level.val;
		}
		canvases[this.canvas.number].optns.anyLayerLevelChanged = true;
		return this;
	}
	layer.down=function(n)
	{						
		if(n == undefined)n=1;
		if(n == 'bottom')n=this.level.val;
		this.level.val-=n;
		for(var i=0;i<this.objs.length;i++)
		{
			this.objs[i].layer.number=this.level.val;
		}
		canvases[this.canvas.number].optns.anyLayerLevelChanged = true;
		return this;
	}
	layer.del=function()
	{
		canvases[this.canvas.number].optns.anyLayerDeleted = true;
		this.draw = false;
		return;
	}
	layer.composite=function(composite)
	{
		if(composite===undefined)return this.optns.gCO;
		else this.optns.gCO=composite;
		return this;
	}
	layer.draw=function(canvasOptns)
	{
		this.animating();
		var limitGrdntsNPtrns = this.grdntsnptrns.length;
		limit=this.objs.length;
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
			limit=objDeleter(this.objs,limit);
			this.optns.anyObjDeleted = false;
		}
		canvasOptns.ctx.globalCompositeOperation = this.optns.gCO;
		for(i=0;i<limit;i++)
		{
			if(typeof (this.objs[i].draw)=='function')
				if(this.objs[i].beforeDraw(canvasOptns.ctx))	
				{
					if(typeof (this.objs[i].draw)=='function')
					{
						this.objs[i].draw(canvasOptns.ctx);
						this.objs[i].afterDraw(canvasOptns);
					}
				}
		}
	}
	return layer;
}