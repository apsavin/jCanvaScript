proto.shape=function()
{
	this.color = function(color)
	{
		if (color===undefined)return [this._colorR,this._colorG,this._colorB,this._alpha];
		return this.attr('color',color);
	}
	this.lineStyle = function(options)
	{
		return this.attr(options);
	}
	this.setOptns = function(ctx)
	{
		proto.shape.prototype.setOptns.call(this,ctx);
		ctx.lineWidth = this._lineWidth;
		ctx.lineCap = this._cap;
		ctx.lineJoin = this._join;
		ctx.miterLimit = this._miterLimit;
		var color=this.optns.color;
		if(color.notColor===undefined){
            var rInt = parseInt(this._colorR),
                gInt = parseInt(this._colorG),
                bInt = parseInt(this._colorB),
                aInt = parseInt(this._alpha * 100) / 100;
            if (this._colorRPrev !== rInt || this._colorGPrev !== gInt || this._colorBPrev !== bInt || this._alphaPrev !== aInt) {
                color.val = this._color = 'rgba(' + rInt + ', ' + gInt + ', ' + bInt + ', ' + aInt + ')';
                this._colorRPrev = rInt;
                this._colorGPrev = gInt;
                this._colorBPrev = bInt;
                this._alphaPrev = aInt;
            }
            else {
                color.val = this._color;
            }
        }
		else
		{
			var notColor=color.notColor;
			var notColorLayer=canvases[notColor.canvas].layers[notColor.layer];
			if(notColorLayer.grdntsnptrns[notColor.level]!==undefined){color.val=notColorLayer.grdntsnptrns[notColor.level].val;}
		}
		if(this._fill) ctx.fillStyle = color.val;
		else ctx.strokeStyle = color.val;
	}
	this.afterDraw=function(optns)
	{
		if(this._fill)
			optns.ctx.fill();
		else
			optns.ctx.stroke();
		proto.shape.prototype.afterDraw.call(this,optns);
	}
	this.base=function(x)
	{
		if(x===undefined)x={};
		if(x.color===undefined)x.color='rgba(0,0,0,1)';
		else
		{
			if(!x.color.charAt && x.color.id===undefined && x.color.r===undefined)
			{
				x.fill=x.color;
				x.color='rgba(0,0,0,1)';
			}
		}
		x=checkDefaults(x,{color:'rgba(0,0,0,1)',fill:0});
		proto.shape.prototype.base.call(this,x);
		this._fill=x.fill;
		this.optns.color={val:x.color,notColor:undefined};
		return this.color(x.color);
	}
	this._colorR=0;
	this._colorG=0;
	this._colorB=0;
	this._alpha=0;
    this._colorRPrev=0;
    this._colorGPrev=0;
    this._colorBPrev=0;
    this._alphaPrev=0;
    this._color = 'rgba(0,0,0,0)';
	this._lineWidth = 1;
	this._cap = 'butt';
	this._join = 'miter';
	this._miterLimit= 1;
}
proto.shape.prototype=new proto.object;