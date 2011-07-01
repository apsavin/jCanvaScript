proto.imageData=function()
{
	this.filter=function(filterName,filterType)
	{
		var filter=imageDataFilters[filterName];
		filter.fn.call(this,this._width,this._height,filter.matrix,filterType);
		return this;
	};
	this.setPixel=function(x,y,color)
	{
		var colorKeeper,index=(x + y * this._width) * 4;
		if (color.r !== undefined) colorKeeper=color;
		else if (color[0] !== undefined) colorKeeper={r:color[0],g:color[1],b:color[2],a:color[3]};
		else colorKeeper = parseColor(color);
		this._data[index+0] = colorKeeper.r;
		this._data[index+1] = colorKeeper.g;
		this._data[index+2] = colorKeeper.b;
		this._data[index+3] = colorKeeper.a*255;
		redraw(this);
		return this;
	}
	this.getPixel=function(x,y)
	{
		var index=(x + y * this._width) * 4;
		return [this._data[index+0],this._data[index+1],this._data[index+2],this._data[index+3]/255];
	}
	this._getX=0;
	this._getY=0;
	this.getData=function(x,y,width,height)
	{
		this._getX=x;
		this._getY=y;
		this._width=width;
		this._height=height;
		var ctx=objectCanvas(this).optns.ctx;
		try{
				this._imgData=ctx.getImageData(this._getX,this._getY,this._width,this._height);
			}catch(e){
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				this._imgData=ctx.getImageData(this._getX,this._getY,this._width,this._height);
		}
		this._data=this._imgData.data;
		redraw(this);
		return this;
	}
	this.putData=function(x,y)
	{
		if(x!==undefined)this._x=x;
		if(y!==undefined)this._y=y;
		this._putData=true;
		redraw(this);
		return this;
	}
	this.clone=function(){
		var clone=proto.imageData.prototype.clone.call(this);
		clone._imgData=undefined;
		return clone;
	}
	this.draw=function(ctx)
	{
		if(this._imgData===undefined)
		{
			this._imgData=ctx.createImageData(this._width,this._height);
			for(var i=0;i<this._width*this._height*4;i++)
				this._imgData.data[i]=this._data[i];
			this._data=this._imgData.data;
		}
		if(this._putData)
			ctx.putImageData(this._imgData,this._x,this._y);
	}
	this.base=function(width,height)
	{
		proto.imageData.prototype.base.call(this);
		if(height===undefined)
		{
			var oldImageData=width;
			width=oldImageData._width;
			height=oldImageData._height;
		}
		this._width=width;
		this._height=height;
		this._data=[];
		for(var i=0;i<this._width;i++)
			for(var j=0;j<this._height;j++)
			{
				var index=(i+j*this._width)*4;
				this._data[index+0]=0;
				this._data[index+1]=0;
				this._data[index+2]=0;
				this._data[index+3]=0;
			}
		return this;
	}
	this._putData=false;
	this._proto='imageData';
}
proto.imageData.prototype=new proto.object;
proto.image=function()
{
	this.getRect=function(type)
	{
		var points={x:this._x,y:this._y,width:this._width,height:this._height};
		return getRect(this,points,type);
	}
	this.draw=function(ctx)
	{
		if(!this._swidth)ctx.drawImage(this._img,this._x,this._y,this._width,this._height);
			else ctx.drawImage(this._img,this._sx,this._sy,this._swidth,this._sheight,this._x,this._y,this._width,this._height);
	}
	this.base=function(img,x,y,width,height,sx,sy,swidth,sheight)
	{
		proto.image.prototype.base.call(this,x,y);
		this._img=img;
		this._width=width||img.width;
		this._height=height||img.height;
		this._sx=sx||0;
		this._sy=sy||0;
		this._swidth=swidth||0;
		this._sheight=sheight||0;
		return this;
	}
	this._proto='image';
}
proto.image.prototype=new proto.object;