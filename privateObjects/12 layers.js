proto.layer=function()
{
	this.position=function(){
		var objs=this.objs,
		points,point,i,
		limit=objs.length;
		for(i=0;i<limit;i++)
		{
			point=objs[i].position();
			if(points===undefined)points=point;
			if(points.x>point.x)points.x=point.x;
			if(points.y>point.y)points.y=point.y;
		}
		return points;
	}
	this.getRect=function(type){
		var objs=this.objs,
		points,rect,i,
		limit=objs.length;
		if (objs.length==0)return false;
		if(type=='coords')
		{
			for(i=0;i<limit;i++)
			{
				rect=objs[i].getRect(type);
				if(points===undefined)points=rect;
				if(points[0][0]>rect[0][0])points[0][0]=rect[0][0];
				if(points[0][1]>rect[0][1])points[0][1]=rect[0][1];
				if(points[1][0]<rect[1][0])points[1][0]=rect[1][0];
				if(points[1][1]>rect[1][1])points[1][1]=rect[1][1];
				if(points[2][0]>rect[2][0])points[2][0]=rect[2][0];
				if(points[2][1]<rect[2][1])points[2][1]=rect[2][1];
				if(points[3][0]<rect[3][0])points[3][0]=rect[3][0];
				if(points[3][1]<rect[3][1])points[3][1]=rect[3][1];
			}
			return points;
		}
		for(i=0;i<limit;i++)
		{
			rect=objs[i].getRect(type);
			rect.right=rect.width+rect.x;
			rect.bottom=rect.height+rect.y;
			if(points===undefined)points=rect;
			if(points.x>rect.x)points.x=rect.x;
			if(points.y>rect.y)points.y=rect.y;
			if(points.right<rect.right)points.right=rect.right;
			if(points.bottom<rect.bottom)points.bottom=rect.bottom;
		}
		points.width=points.right-points.x;
		points.height=points.bottom-points.y;
		return points;
	}
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
		canvases[oldCanvas].layers.splice(this.optns.number,1);
		var layersArray=canvases[newCanvas].layers;
		this._level=this.optns.number=layersArray.length;
		layersArray[this._level]=this;
		setLayerAndCanvasToArray(this.objs,this.optns.id,this._level,idCanvas,newCanvas);
		setLayerAndCanvasToArray(this.grdntsnptrns,this.optns.id,this._level,idCanvas,newCanvas);
		canvases[newCanvas].optns.redraw=1;
		return this;
	}
	this.up=function(n)
	{
		if(n === undefined)n=1;
		if(n=='top')this.level(n);
		else {
			var next=objectCanvas(this).layers[this.optns.number+n];
			if(next!==undefined)
			{
				n=next._level+1-this._level;
			}
			this.level(this._level+n);
		}
		return this;
	}
	this.down=function(n)
	{
		if(n == undefined)n=1;
		if(n == 'bottom')this.level(n);
		else {
			var previous=objectCanvas(this).layers[this.optns.number-n];
			if(previous!==undefined)
			{
				n=this._level-(previous._level-1);
			}
			this.level(this._level-n);
		}
		return this;
	}
	this.level=function(n)
	{
		if(n == undefined)return this._level;
		var canvas=objectCanvas(this),
			optns=canvas.optns;
		if(n=='bottom')
			if(this.optns.number==0)n=this._level;
			else n=canvas.layers[0]._level-1;
		if(n=='top')
			if(this.optns.number==canvas.layers.length-1)n=this._level;
			else n=canvas.layers[canvas.layers.length-1]._level+1;
		this._level=n;
		optns.anyLayerLevelChanged = true;
		optns.redraw=1;
		return this;
	}
	this.del=function()
	{
		var optns=objectCanvas(this).optns;
		optns.anyLayerDeleted = true;
		this.optns.deleted = true;
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
		take(clone.optns.transformMatrix,this.optns.transformMatrix);
		take(clone.optns.translateMatrix,this.optns.translateMatrix);
		take(clone.optns.scaleMatrix,this.optns.scaleMatrix);
		take(clone.optns.rotateMatrix,this.optns.rotateMatrix);
		clone.canvas(objectCanvas(this).optns.id);
		if(params===undefined) return clone;
		return clone.animate(params);
	}
	this.isPointIn=function(x,y,global)
	{
		var objs=this.objs,i;
		for(i=0;i<objs.length;i++)
			if(objs[i].isPointIn(x,y,global))
				return true;
		return false;
	}
	this.opacity=function(n)
	{
		var objs=this.objs;
		for(var i=0;i<objs.length;i++)
			objs[i].attr('opacity',n);
		return this;
	}
	this.fadeTo=function(val,duration,easing,onstep,fn)
	{
		if(duration===undefined)duration=600;
		var objs=this.objs;
		for(var i=0;i<objs.length;i++)
			objs[i].animate({opacity:val},duration,easing,onstep,fn);
		return this;
	}
	this.draw=function(canvasOptns)
	{
		var optns=this.optns,
			bufOptns=optns.buffer,
			ctx=canvasOptns.ctx;
		if(bufOptns.val)
		{
			ctx.drawImage(bufOptns.cnv,bufOptns.x,bufOptns.y);
			return this;
		}
		for(var i=0;i<this.grdntsnptrns.length;i++)
			this.grdntsnptrns[i].create(canvasOptns);
		if(optns.anyObjLevelChanged)
		{
			levelChanger(this.objs);
			optns.anyObjLevelChanged = false;
		}
		if(optns.anyObjDeleted)
		{
			objDeleter(this.objs);
			optns.anyObjDeleted = false;
		}
		ctx.globalCompositeOperation = optns.gCO;
		for(i=0;i<this.objs.length;i++)
		{
			var object=this.objs[i];
			if(typeof (object.draw)=='function')
			{
				this.setOptns(ctx);
				if(object.beforeDraw(canvasOptns))
				{
					if(typeof (object.draw)=='function')
					{
						var objBufOptns=object.optns.buffer;
						if(objBufOptns.val)
							ctx.drawImage(objBufOptns.cnv,objBufOptns.x,objBufOptns.y);
						else
							object.draw(ctx);
						if(bufOptns.optns)
							object.afterDraw(bufOptns.optns);
						else
							object.afterDraw(canvasOptns);
					}
				}
			}
		}
		return this;
	}
	this.objects=function(map)
	{
		var myGroup=group(),i=0;
		while(this.objs[i]!==undefined)
				myGroup.elements[i]=this.objs[i++];
		if(map!==undefined)
			return myGroup.find(map);
		return myGroup;
	}
	this.base=function(idLayer)
	{
		var canvas=canvases[lastCanvas],
		lastCanvasLayers=canvas.layers,
		lastCanvasOptns=canvas.optns;
		proto.layer.prototype.base.call(this,0,0,true);
		var limit=lastCanvasLayers.length;
		lastCanvasLayers[limit]=this;
		this.objs = [];
		this.grdntsnptrns = [];
		this._level=limit?(lastCanvasLayers[limit-1]._level+1):0;
		this.optns.number=limit;
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