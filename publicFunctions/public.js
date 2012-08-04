jCanvaScript.addFunction=function(name,fn,prototype)
{
	proto[prototype||'object'].prototype[name]=fn;
	return jCanvaScript;
}
jCanvaScript.addObject=function(name,parameters,drawfn,parent)
{
	proto[name]=function(name){
		this.draw=proto[name].draw;
		this.base=proto[name].base;
		this._proto=name;
	};
	var protoItem=proto[name];
	if(parent===undefined)parent='shape';
	protoItem.prototype=new proto[parent];
	protoItem.draw=drawfn;
	protoItem.base=function(name,parameters,args)
	{
		protoItem.prototype.base.call(this,parameters);
		var i=0;
		for(var key in parameters)
		{
			var parameter = (args[i] !== undefined)?args[i]:parameters[key];
			this['_'+key]=parameter;
			if(key=='color')this.color(parameter);
			i++;
		}
		return this;
	};
	(function(name,parameters)
	{
		jCanvaScript[name]=function()
		{
			var object=new proto[name](name);
			return object.base(name,parameters,arguments);
		}
	})(name,parameters);
	return jCanvaScript;
}
jCanvaScript.addAnimateFunction=function(name,fn)
{
	animateFunctions[name]=fn;
	return jCanvaScript;
}
jCanvaScript.addImageDataFilter=function(name,properties)
{
	if(imageDataFilters[name]===undefined)imageDataFilters[name]={};
	if(properties.fn!==undefined)imageDataFilters[name].fn=properties.fn;
	if(properties.matrix!==undefined && properties.type===undefined)imageDataFilters[name].matrix=properties.matrix;
	if(properties.type!==undefined)imageDataFilters[name].matrix[type]=properties.matrix;
	return jCanvaScript;
}
jCanvaScript.clear=function(idCanvas)
{
	if(canvases[0]===undefined)return jCanvaScript;
	if(idCanvas===undefined){canvases[0].clear();return jCanvaScript;}
	jCanvaScript.canvas(idCanvas).clear();
	return jCanvaScript;
}
jCanvaScript.pause=function(idCanvas)
{
	if(idCanvas===undefined){canvases[0].pause();return jCanvaScript;}
	jCanvaScript.canvas(idCanvas).pause();
	return jCanvaScript;
}
jCanvaScript.start=function(idCanvas,isAnimated)
{
	jCanvaScript.canvas(idCanvas).start(isAnimated);
	return jCanvaScript;
}