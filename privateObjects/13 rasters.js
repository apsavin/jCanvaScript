proto.imageData=function()
{
	this.setPixel=function(x,y,color)
	{
		var colorKeeper = parseColor(color);
		var index=(x + y * this._width) * 4;
		this.data[index+0] = colorKeeper.colorR;
		this.data[index+1] = colorKeeper.colorG;
		this.data[index+2] = colorKeeper.colorB;
		this.data[index+3] = colorKeeper.alpha*255;
		redraw(this);
		return this;
	}
	this.getPixel=function(x,y)
	{
		var index=(x + y * this._width) * 4;
		return [this.data[index+0],this.data[index+1],this.data[index+2],this.data[index+3]/255];
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
				this.imgData=ctx.getImageData(this._getX,this._getY,this._width,this._height);
			}catch(e){
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				this.imgData=ctx.getImageData(this._getX,this._getY,this._width,this._height);
		}
		this.data=this.imgData.data;
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
	this.draw=function(ctx)
	{
		if(this.imgData===undefined)
		{
			this.imgData=ctx.createImageData(this._width,this._height);
			for(var i=0;i<this._width*this._height*4;i++)
				this.imgData.data[i]=this.data[i];
			this.data=this.imgData.data;
		}
		if(this._putData)
			ctx.putImageData(this.imgData,this._x,this._y);
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
		this.data=[];
		for(var i=0;i<this._width;i++)
			for(var j=0;j<this._height;j++)
			{
				var index=(i+j*this._width)*4;
				this.data[index+0]=0;
				this.data[index+1]=0;
				this.data[index+2]=0;
				this.data[index+3]=0;
			}
		return this;
	}
	this._putData=false;
	this._proto='imageData';
}
proto.imageData.prototype=new proto.object;
proto.image=function()
{
	this.getRect=function()
	{
		var points=this.position();
		points.width=(this._img.width>this._width)?this._img.width:this._width;
		points.height=(this._img.height>this._height)?this._img.height:this._height;
		return points;
	}
	this.draw=function(ctx)
	{
		if(this._width==false && this._dx==false){ctx.drawImage(this._img,this._x,this._y);}
		else{if(this._dx==false)ctx.drawImage(this._img,this._x,this._y,this._width,this._height);
			else ctx.drawImage(this._img,this._x,this._y,this._width,this._height,this._dx,this._dy,this._dwidth,this._dheight);}
	}
	this.base=function(img,x,y,width,height,dx,dy,dwidth,dheight)
	{
		proto.image.prototype.base.call(this,x,y);
		this._img=img;
		this._width=width||false;
		this._height=height||false;
		this._dx=dx||false;
		this._dy=dy||false;
		this._dwidth=dwidth||false;
		this._dheight=dheight||false;
		return this;
	}
	this._proto='image';
}
proto.image.prototype=new proto.object;