proto.pattern = function()
{
	this.create = function(ctx)
	{
		if(this.optns.animated)animating.call(this);
		this.val = ctx.createPattern(this._img,this._type);
	}
	this.base=function(img,type)
	{
		proto.pattern.prototype.base.call(this);
		this._img=img;
		this._type=type||'repeat';
		return this;
	}
	this._proto='pattern';
}
proto.pattern.prototype=new proto.grdntsnptrn;
proto.lGradient=function()
{
	this.create = function(ctx)
	{
		if(this.optns.animated)animating.call(this);
		this.val=ctx.createLinearGradient(this._x1,this._y1,this._x2,this._y2);
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['_pos'+i],'rgba('+parseInt(this['_colorR'+i])+','+parseInt(this['_colorG'+i])+','+parseInt(this['_colorB'+i])+','+this['_alpha'+i]+')');
		}
	}
	this.base=function(x1,y1,x2,y2,colors)
	{
		proto.lGradient.prototype.base.call(this,colors);
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x2;
		this._y2 = y2;
		return this;
	}
	this._proto='lGradient';
}
proto.lGradient.prototype=new proto.gradients;
proto.rGradient=function()
{
	this.create = function(ctx)
	{
		if(this.optns.animated)animating.call(this);
		this.val=ctx.createRadialGradient(this._x1,this._y1,this._r1,this._x2,this._y2,this._r2);
		for(var i=0;i<this.colorStopsCount;i++)
		{
			this.val.addColorStop(this['_pos'+i],'rgba('+parseInt(this['_colorR'+i])+','+parseInt(this['_colorG'+i])+','+parseInt(this['_colorB'+i])+','+this['_alpha'+i]+')');
		}
	}
	this.base=function(x1,y1,r1,x2,y2,r2,colors)
	{
		proto.rGradient.prototype.base.call(this,colors);
		this._x1 = x1;
		this._y1 = y1;
		this._r1 = r1;
		this._x2 = x2;
		this._y2 = y2;
		this._r2 = r2;
		return this;
	}
	this._proto='rGradient';
}
proto.rGradient.prototype=new proto.gradients;