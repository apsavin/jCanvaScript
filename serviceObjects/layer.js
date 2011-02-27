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
	var layer=obj(0,0,true);
	limit=canvases[lastCanvas].layers.length;
	canvases[lastCanvas].layers[limit]=layer;
	layer.objs = [];
	layer.grdntsnptrns = [];
	layer.level={val:limit,current:limit};
	layer.id.val=idLayer;
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
		canvases[this.canvas.number].optns.redraw++;
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
		canvases[this.canvas.number].optns.redraw++;
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
		canvases[this.canvas.number].optns.redraw++;
		return this;
	}
	layer.del=function()
	{
		canvases[this.canvas.number].optns.anyLayerDeleted = true;
		this.draw = false;
		canvases[this.canvas.number].optns.redraw++;
		return;
	}
	layer.setObjOptns=layer.setOptns;
	layer.setOptns=function(ctx)
	{
		ctx.setTransform(1,0,0,1,0,0);
		layer.setObjOptns(ctx);
		return this;
	}
	layer.afterDraw=function(optns)
	{
		optns.ctx.closePath();
		optns.ctx.restore();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			if(clipObject.afterDrawObj)clipObject.afterDrawObj(optns);
			else clipObject.afterDraw();
		}
	}
	layer.clone=function(idLayer,params)
	{
		var clone=jCanvaScript.layer(idLayer);
		for(var key in this)
		{
			if(key=='id' || key=='canvas' || key=='level' || key=="draggable" || key=="droppable" || key=="click" || key.substr(0,5)=="mouse" || key.substr(0,3)=="key")continue;
			if(key=='objs')
			{
				for(var i=0;i<this.objs.length;i++)
				{
					this.objs[i].clone().layer(idLayer);
				}
				continue;
			}
			if(!clone.hasOwnProperty(key))
			{
				switch(typeof this[key])
				{
					case 'object':clone[key]={};break;
					default:clone[key]=this[key];
				}
			}
			for(var subKey in this[key])
			{
				clone[key][subKey]=this[key][subKey];
			}
		}
		clone.canvas(canvases[this.canvas.number].id.val);
		if(params===undefined) return clone;
		return clone.animate(params);
	}
	layer.isPointIn=function(x,y,global)
	{
		for(var i=0;i<this.objs.length;i++)
			if(this.objs[i].isPointIn(x,y,global))
				return true;
		return false;
	}
	layer.draw=function(canvasOptns)
	{
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
	return layer;
}