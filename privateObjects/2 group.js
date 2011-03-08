proto.groups=function()
{
	for(var Class in proto)
	{
		if(Class=='group'||Class=='groups')continue;
		var tmp=new proto[Class];
		for(var key in tmp)
		{
			if(typeof tmp[key]=='function' && this[key]===undefined)
			{
				this[key]=function(){
					for(var i=0;i<this.elements.length;i++)
					{
						var element=this.elements[i];
						if(typeof element[arguments.callee.val]=='function')
						{
							element[arguments.callee.val].apply(element,arguments);
						}
					}
					return this;
				}
				this[key].val=key;
			}
		}
	}
	this.base=function(){
		this.elements=[];
		return this;
	}
}
proto.group=function()
{
	this._proto='group';
};
proto.group.prototype=new proto.groups;
function group()
{
	var group=new proto.group;
	return group.base();
}