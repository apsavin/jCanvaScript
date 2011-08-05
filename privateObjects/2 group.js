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
				(function(group,key)
				{
				group[key]=function(){
					var argumentsClone=[];
					var args=[];
					var i=0;
					while(arguments[i]!==undefined)
						args[i]=arguments[i++];
					for(i=0;i<this.elements.length;i++)
					{
						var element=this.elements[i];
						take(argumentsClone,args);
						if(typeof element[key]=='function')
						{
							element[key].apply(element,argumentsClone);
						}
					}
					return this;
				}
				})(this,key);
			}
		}
	}
	this.reverse=function(){
		var tmpArray=this.elements;
		this.elements=this.unmatchedElements;
		this.unmatchedElements=tmpArray;
		return this;
	}
	this.end=function(n){
		if(this.previousGroup===undefined || n===0)return this;
		if(n!==undefined)n--;
		return this.previousGroup.end(n);
	}
	this.find=function(map){
		var subgroup=group(),
			attrs=map.attrs,
			fns=map.fns||[],
			i,j,
			element,rel,fn,value1,value2;
		subgroup.previousGroup=this;
		for(i=0;i<this.elements.length;i++)
		{
			subgroup.elements[i]=this.elements[i];
		}
		if(attrs!==undefined)
		{
			for(j in attrs)
			{
				if(attrs.hasOwnProperty(j))
				{
					if(typeof attrs[j]!='object')
					{
						attrs[j]={val:attrs[j],rel:'=='};
					}
					fns[fns.length]={
						fn:'attr',
						args:[j],
						val:attrs[j].val,
						rel:attrs[j].rel
					};
				}
			}
		}
		if(fns.length)
		{
			for(i=0;i<subgroup.elements.length;i++)
			{
				element=subgroup.elements[i];
				for(j=0;j<fns.length;j++)
				{
					fn=fns[j];
					value2=fn.val;
					rel=fn.rel;
					if(typeof element[fn.fn]=='function')
						value1=element[fn.fn].apply(element,fn.args);
					else rel='del';
					switch(rel)
					{
						case '!=':
							if(!(value1!=value2))rel='del';
							break;
						case '!==':
							if(!(value1!==value2))rel='del';
							break;
						case '==':
							if(!(value1==value2))rel='del';
							break;
						case '===':
							if(!(value1===value2))rel='del';
							break;
						case '>=':
							if(!(value1>=value2))rel='del';
							break;
						case '<=':
							if(!(value1<=value2))rel='del';
							break;
						case '>':
							if(!(value1>value2))rel='del';
							break;
						case '<':
							if(!(value1<value2))rel='del';
							break;
						case 'typeof':
							if(!(typeof value1==value2))rel='del';
							break;
					}
					if(rel=='del')
					{
						subgroup.unmatchedElements[subgroup.unmatchedElements.length]=element;
						subgroup.elements.splice(i,1);
						i--;
						break;
					}
				}
			}
		}
		return subgroup;
	}
	this.base=function(){
		this.elements=[];
		this.unmatchedElements=[];
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