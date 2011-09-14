proto.pattern = function()
{
	this.create = function(canvasOptns)
	{
		if(this.optns.animated)animating.call(this,canvasOptns);
		this.val = canvasOptns.ctx.createPattern(this._img,this._type);
	}
	this.base=function(image,type)
	{
		if(image.onload)
			image={image:image,type:type};
		image=checkDefaults(image,{type:'repeat'});
		proto.pattern.prototype.base.call(this);
		this._img=image.image;
		this._type=image.type;
		return this;
	}
	this._proto='pattern';
}
proto.pattern.prototype=new proto.grdntsnptrn;
proto.lGradient=function()
{
	this.create = function(canvasOptns)
	{
		if(this.optns.animated)animating.call(this,canvasOptns);
		this.val=canvasOptns.ctx.createLinearGradient(this._x1,this._y1,this._x2,this._y2);
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['_pos'+i],'rgba('+parseInt(this['_colorR'+i])+','+parseInt(this['_colorG'+i])+','+parseInt(this['_colorB'+i])+','+this['_alpha'+i]+')');
		}
	}
	this.base=function(x1,y1,x2,y2,colors)
	{
		if(typeof x1!=='object')
			x1={x1:x1,y1:y1,x2:x2,y2:y2,colors:colors};
		x1=checkDefaults(x1,{x1:0,y1:0,x2:0,y2:0})
		proto.lGradient.prototype.base.call(this,x1.colors);
		this._x1 = x1.x1;
		this._y1 = x1.y1;
		this._x2 = x1.x2;
		this._y2 = x1.y2;
		return this;
	}
	this._proto='lGradient';
}
proto.lGradient.prototype=new proto.gradients;
proto.rGradient=function()
{
	this.create = function(canvasOptns)
	{
		if(this.optns.animated)animating.call(this);
		this.val=canvasOptns.ctx.createRadialGradient(this._x1,this._y1,this._r1,this._x2,this._y2,this._r2);
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['_pos'+i],'rgba('+parseInt(this['_colorR'+i])+','+parseInt(this['_colorG'+i])+','+parseInt(this['_colorB'+i])+','+this['_alpha'+i]+')');
		}
	}
	this.base=function(x1,y1,r1,x2,y2,r2,colors)
	{
		if(typeof x1!=='object')
			x1={x1:x1,y1:y1,r1:r1,x2:x2,y2:y2,r2:r2,colors:colors};
		x1=checkDefaults(x1,{x1:0,y1:0,r1:0,x2:0,y2:0,r2:0})
		proto.rGradient.prototype.base.call(this,x1.colors);
		this._x1 = x1.x1;
		this._y1 = x1.y1;
		this._r1 = x1.r1;
		this._x2 = x1.x2;
		this._y2 = x1.y2;
		this._r2 = x1.r2;
		return this;
	}
	this._proto='rGradient';
}
proto.rGradient.prototype=new proto.gradients;
