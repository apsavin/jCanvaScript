jCanvaScript.addObject=function(name,parameters,drawfn)
{
	proto[name]=function(name){
		this.draw=proto[name].draw;
		this.base=proto[name].base;
		this._proto=name;
	};
	proto[name].prototype=new proto.shape;
	proto[name].draw=drawfn;
	proto[name].base=function(name,parameters,args)
	{
		proto[name].prototype.base.call(this,parameters.x||0,parameters.y||0,parameters.color||"rgba(0,0,0,0)",parameters.fill||1);
		var i=0;
		for(var key in parameters)
		{
			this['_'+key]=args[i]||parameters[key];
			if(key=='color')this.color(args[i]||parameters[key]);
			i++;
		}
		return this;
	}
	jCanvaScript[name]=function()
	{
		var name=arguments.callee.val;
		var object=new proto[name](name);
		return object.base(name,arguments.callee.parameters,arguments);
	}
	jCanvaScript[name].val=name;
	jCanvaScript[name].parameters=parameters;
}
jCanvaScript.addAnimateFunction=function(name,fn)
{
	animateFunctions[name]=fn;
}
jCanvaScript.clear=function(idCanvas)
{
	if(canvases[0]===undefined)return;
	if(idCanvas===undefined){canvases[0].clear();return;}
	jCanvaScript.canvas(idCanvas).clear();
}
jCanvaScript.pause=function(idCanvas)
{
	if(idCanvas===undefined){canvases[0].pause();return;}
	jCanvaScript.canvas(idCanvas).pause();
}
jCanvaScript.start=function(idCanvas,fps)
{
	jCanvaScript.canvas(idCanvas).start(fps);
}