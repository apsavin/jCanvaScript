proto.lines=function()
{
	this.addPoint=function(){
		redraw(this);
		var names=this.pointNames;
		for(var i=0;i<names.length;i++)
				this[names[i]+this.shapesCount]=arguments[i];
		this.shapesCount++;
		return this;
	}
	this.delPoint=function(x,y,radius){
		redraw(this);
		if(y===undefined)
		{
			var points=this.points();
			points.splice(x,1)
			this.points(points);
		}
		else{
			radius=radius||0;
			for(var j=0;j<this.shapesCount;j++)
				if(this['_x'+j]<x+radius && this['_x'+j]>x-radius && this['_y'+j]<y+radius && this['_y'+j]<y+radius)
				{
					this.delPoint(j);
					j--;
				}
		}
		return this;
	}
	this.points=function(points)
	{
		var names=this.pointNames;
		if(points===undefined){
			points=[];
			for(var j=0;j<this.shapesCount;j++)
			{
				points[j]=[];
				for(var i=0;i<names.length;i++)
					points[j][i]=this[names[i]+j];
			}
			return points;
		}
		redraw(this);
		var oldCount=this.shapesCount;
		this.shapesCount=points.length;
		for(j=0;j<this.shapesCount;j++)
			for(i=0;i<names.length;i++)
				this[names[i]+j]=points[j][i];
		for(j=this.shapesCount;j<oldCount;j++)
			for(i=0;i<names.length;i++)
				this[names[i]+j]=undefined;
		return this;
	}
	this.base=function(color,fill)
	{
		proto.lines.prototype.base.call(this,0,0,color,fill);
		this.shapesCount=0;
		return this;
	}
}
proto.lines.prototype=new proto.shape;