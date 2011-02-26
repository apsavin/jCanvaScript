function obj(x,y)
{	
	var opacity=function(n)
	{
		if(n === undefined) return this.opacity.val;
		this.opacity.val=n;
		redraw(this);
		return this;
	}
	opacity.val=1;	
	var fn = [];
	var name = function(stroke)
	{
		if(stroke===undefined)return this.name.val;
		else this.name.val=stroke;
		return this;
	}
	name.val='';
	var visible=function(visibility)
	{
		if(visibility===undefined)return this.visible.val;
		this.visible.val=visibility;
		redraw(this);
		return this;
	}
	visible.val=true;
	var droppable=function(fn)
	{
		this.droppable.val=true;
		if(fn!==undefined)this.droppable.fn=fn;
		return this;
	}
	droppable.val=false;
	droppable.fn=function(draggedObject){};
	var draggable=function(object,params,fn)
	{
		var dragObj=this;
		if(typeof params==='function')
		{
			fn=params;
			params=undefined;
		}
		if(typeof object=='function')
		{
			fn=object;
			object=undefined;
		}
		this.draggable.shiftX=0;
		this.draggable.shiftY=0;
		if(params!==undefined)
		{
			if(params.shiftX!==undefined){this.draggable.shiftX=params.shiftX;params.shiftX=undefined;}
			if(params.shiftY!==undefined){this.draggable.shiftY=params.shiftY;params.shiftY=undefined;}
		}
		if(object!==undefined)
		{
			if(object.id)dragObj=(params===undefined)? object.visible(false) : object.animate(params).visible(false);
			if(object=='clone')
			{
				dragObj=this.clone(params).visible(false);
				this.draggable.type='clone';
			}
		}
		this.draggable.val=true;
		this.draggable.x=this.x.val;
		this.draggable.y=this.y.val;
		this.draggable.dx=this.transformdx.val;
		this.draggable.dy=this.transformdy.val;
		this.draggable.object=dragObj;
		this.draggable.params=params;
		this.draggable.fn=fn||false;
		var optns=canvases[this.layer.canvas].optns;
		optns.mousemove.val=true;
		optns.mousedown.val=true;
		optns.mouseup.val=true;
		return this;
	}
	draggable.val=false;
	var olayer=function(idLayer)
	{
		return layer(idLayer,this,'objs');
	}
	olayer.val=canvases[0].id.val+'Layer_0';
	olayer.number=layer.canvas=0;
	var ocanvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'objs');
	}
	var focus=function(fn)
	{
		if(fn===undefined)
		{
			this.focus.val=true;
			if(typeof this.onfocus=='function')this.onfocus();
		}
		else this.onfocus=fn;
		return this;
	}
	focus.val=false;
	var obj={
	x:{val:x||0},
	y:{val:y||0},
	opacity:opacity,
	fn:fn,
	id:function(id)
	{
		if(id===undefined)return this.id.val;
		this.id.val=id;
		return this;
	},
	name:name,
	clone:function(params)
	{
		var clone=shapes('rgba(0,0,0,0)');
		for(var key in this)
		{
			if(key=='id' || key=='level' || key=="draggable" || key=="droppable" || key=="click" || key.substr(0,5)=="mouse" || key.substr(0,3)=="key")continue;
			if(!clone.hasOwnProperty(key))
			{
				switch(typeof this[key])
				{
					case 'object':clone[key]={};break;
					default:clone[key]=this[key];
				}
			}
			for(var subKey in this[key])
			{
				clone[key][subKey]=this[key][subKey];
			}
		}
		var limit=canvases[this.layer.canvas].layers[this.layer.number].objs.length;
		clone.level={val:limit,current:limit}
		canvases[this.layer.canvas].layers[this.layer.number].objs[limit]=clone;
		if(params===undefined) return clone;
		return clone.animate(params);
	},
	visible:visible,
	shadowX: {val:0},
	shadowY: {val:0},
	shadowBlur: {val:0},
	shadowColor: {val:'rgba(0,0,0,0)'},
	shadowColorR: {val:0},
	shadowColorG: {val:0},
	shadowColorB: {val:0},
	shadowColorA: {val:0},
	shadow: function(options)
	{
		for(var key in options)
		switch (key)
		{
			case 'x':
				this.shadowX.val=options.x;
				break;
			case 'y':
				this.shadowY.val=options.y;
				break;
			case 'blur':
				this.shadowBlur.val=options.blur;
				break;
			case 'color':
				var colorKeeper = parseColor(options.color);
				this.shadowColor = options.color.val;
				this.shadowColorR = colorKeeper.colorR;
				this.shadowColorG = colorKeeper.colorG;
				this.shadowColorB = colorKeeper.colorB;
				this.shadowColorA = colorKeeper.alpha;
				break;
		}
		redraw(this);
		return this;
	},
	setOptns:function(ctx)
	{
		ctx.globalAlpha = this.opacity.val;
		ctx.shadowOffsetX = this.shadowX.val;  
		ctx.shadowOffsetY = this.shadowY.val;  
		ctx.shadowBlur = this.shadowBlur.val;  
		ctx.shadowColor = 'rgba('+this.shadowColorR.val+','+this.shadowColorG.val+','+this.shadowColorB.val+','+this.shadowColorA.val+')'; 
		ctx.setTransform(this.transform11.val,this.transform12.val,this.transform21.val,this.transform22.val,this.transformdx.val,this.transformdy.val);
		return this;
	},
	up:function(n)
	{						
		if(n === undefined)n=1;
		if(n == 'top')n=canvases[this.layer.canvas].layers[this.layer.number].objs.length-1;
		this.level.val+=n;
		canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	down:function(n)
	{						
		if(n == undefined)n=1;
		if(n == 'bottom')n=this.level.val;
		this.level.val-=n;
		canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	level:function(n)
	{
		if(n == undefined)return this.level.val;
		this.level.val=n;
		canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	layer:olayer,
	canvas:ocanvas,
	del:function()
	{
		this.draw=false;
		canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjDeleted = true;
		redraw(this);
	},
	focus:focus,
	blur:function(fn)
	{
		if(fn===undefined)
		{
			this.focus.val=false;
			if(typeof this.onblur == 'function')this.onblur();
		}
		else this.onblur=fn;
		return this;
	},
	click: function(fn)
	{
		return setMouseEvent.call(this,fn,'click');
	},
	keypress: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeypress');
	},
	keydown: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeydown');
	},
	keyup: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeyup');
	},
	mousedown: function(fn)
	{
		return setMouseEvent.call(this,fn,'mousedown');
	},
	mouseup: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseup');
	},
	mousemove: function(fn)
	{
		return setMouseEvent.call(this,fn,'mousemove');
	},
	mouseover: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseover');
	},
	mouseout: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseout');
	},
	draggable:draggable,
	droppable:droppable,
	attr:function(parameter,value)
	{
		if(typeof parameter==='object')
			var parameters=parameter;
		else
		{
			if(this[parameter]===undefined)return undefined;
			if(value===undefined)
				return this[parameter].val;
			parameters={};
			parameters[parameter]=value;
		}
		return this.animate(parameters);
	},
	stop:function(jumpToEnd,runCallbacks)
	{
		this.animate.val=false;
		for(var key in this)
		{
			if(this[key]['from']!==undefined)
			{
				this[key]['from']=undefined;
				if(jumpToEnd!==undefined)
					if(jumpToEnd)
						this[key]['val']=this[key]['to'];
			}
		}		
		var fnlimit=this.fn.length;
		if(runCallbacks===undefined)runCallbacks=false;
		for(var j=0;j<fnlimit;j++)
		{
			if(this['fn'][j]['func'] != 0 && !this['fn'][j]['count'] && this.fn[j].enabled)
			{
				this.fn[j].enabled=false;
				if(runCallbacks)
					this['fn'][j]['func'].apply(this);
			}
		}
		return this;
	},
	animate:function(options,duration,easing,onstep,fn)
	{
		this.animate.val=true;
		if(duration===undefined)duration=1;
		else
		{
			if(typeof duration == 'function')
			{
				fn=duration;
				duration=1;
			}
			if(typeof duration == 'object')
			{
				easing=duration;
				duration=1;
			}
		}
		if(duration!=1)duration=duration/1000*canvases[this.layer.canvas].fps;
		if (easing===undefined)easing={fn:'linear',type:'in'};
		else
		{
			if(typeof easing == 'function')
			{
				fn=easing;
				easing={fn:'linear',type:'in'};
			}
			if (easing.type===undefined)easing.type='in';
		}
		if(onstep===undefined)onstep=false;
		else
		{
			if(typeof onstep == 'function')
			{
				fn=onstep;
				onstep=false;
			}
		}
		if(options.scale!==undefined)
		{
			if(options.scale.x===undefined && options.scale.y===undefined)
			{
				options.transform11=options.scale;
				options.transform22=options.scale;
				options.transformdx=this.x.val*(-options.scale+1);
				options.transformdy=this.y.val*(-options.scale+1);
			}
			else
			{
				if(options.scale.x!==undefined)
				{
					options.transform11=options.scale.x;
					options.transformdx=this.x.val*(-options.scale.x+1);
				}
				if(options.scale.y!==undefined)
				{
					options.transform22=options.scale.y;
					options.transformdy=this.x.val*(-options.scale.y+1);
				}
			}
		}
		if(options.translate!==undefined)
		{
			if(options.translate.x===undefined && options.translate.y===undefined)
			{
				options.transformdx=options.translate;
				options.transformdy=options.translate;
			}
			else
			{
				if(options.translate.x!==undefined)options.transformdx=options.translate.x;
				if(options.translate.y!==undefined)options.transformdy=options.translate.y;
			}
			options.translate=undefined;
		}
		if(options.rotate!==undefined)
		{
			options.rotateAngle=options.rotate.angle;
			this.rotateAngle.val=this.rotateAngle.prev=0;
			this.rotateX.val=options.rotate.x||0;
			this.rotateY.val=options.rotate.y||0;
			options.rotate=undefined;
		}
		if(options.color !== undefined)
		{
			var colorKeeper=parseColor(options.color);
			if(colorKeeper.color.notColor)
				this.color.notColor=colorKeeper.color.notColor;
			else
			{
				options.colorR=colorKeeper.colorR.val;
				options.colorG=colorKeeper.colorG.val;
				options.colorB=colorKeeper.colorB.val;
				options.alpha=colorKeeper.alpha.val;
			}
			options.color = undefined;
		}
		if(options.shadowColor !== undefined)
		{
			colorKeeper=parseColor(options.shadowColor);
			options.shadowColorR=colorKeeper.colorR.val;
			options.shadowColorG=colorKeeper.colorG.val;
			options.shadowColorB=colorKeeper.colorB.val;
			options.shadowColorA=colorKeeper.alpha.val;
			options.shadowColor = undefined;
		}
		if (fn)
		{
			var fnlimit=this.fn.length;
			this.fn[fnlimit]={func:fn,count:0,enabled:true};
		}
		if (options.level !== undefined)
		{
			canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjLevelChanged = true;
			if(options.level=='top')options.level=canvases[this.layer.canvas].layers[this.layer.number].objs[this.level.val].length-1;
			else
				if (options.level=='bottom')options.level=0;	
		}
		var re = /^[A-z]*$/;
		for(var key in options)
		{
			if(this[key] !== undefined && options[key]!==undefined)
			{
				if(options[key]!=this[key]['val'])
				{
					if(options[key].charAt)
					{
						if(options[key].charAt(1)=='=')
						{
							options[key]=this[key]['val']+parseInt(options[key].charAt(0)+options[key].substr(2));
						}
						else if(re.test(options[key]))options[key]=parseInt(options[key]);
						else this[key]['val']=options[key];
					}
					if(duration==1)this[key]['val']=options[key];
					else
					{
						this[key]['from']=this[key]['val'];
						this[key]['to']=options[key];
						this[key]['duration']=duration;
						this[key]['step']=1;
						this[key]['easing']=easing;
						this[key]['onstep']=onstep;
						if(fn)
						{
							this.fn[fnlimit][key]=true;
							this.fn[fnlimit].count++;
						}
					}
				}
			}
		}
		if(duration==1 && options['rotateAngle'])
			this.rotate(this.rotateAngle.val,this.rotateX.val,this.rotateY.val);
		redraw(this);
		return this;
	},
	setMatrix:function(m)
	{
		this.transform11.val=m[0][0];
		this.transform21.val=m[0][1];
		this.transform12.val=m[1][0];
		this.transform22.val=m[1][1];
		this.transformdx.val=m[0][2];
		this.transformdy.val=m[1][2];
		redraw(this);
	},
	translate:function(x,y)
	{
		var m=multiplyM([[this.transform11.val,this.transform21.val,this.transformdx.val],[this.transform12.val,this.transform22.val,this.transformdy.val]],[[1,0,x],[0,1,y]]);
		this.setMatrix(m);
		return this;
	},
	scale:function(x,y)
	{
		if(y===undefined)y=x;
		var m=multiplyM([[this.transform11.val,this.transform21.val,this.transformdx.val],[this.transform12.val,this.transform22.val,this.transformdy.val]],[[x,0,this.x.val*(1-x)],[0,y,this.y.val*(1-y)]]);
		this.setMatrix(m);
		return this;
	},
	rotateAngle:{val:0},
	rotateX:{val:0},
	rotateY:{val:0},
	rotate:function(x,x1,y1)
	{
		x=Math.PI*x/180;
		var cos=Math.cos(x);
		var sin=Math.sin(x);
		if(x1===undefined){var m=multiplyM([[this.transform11.val,this.transform21.val,this.transformdx.val],[this.transform12.val,this.transform22.val,this.transformdy.val]],[[cos,-sin,0],[sin,cos,0]]);}
		else 
		{
			if(x1=='center')
			{
				var point=getObjectCenter(this);
				if(y1===undefined)
				{
					x1=point.x;
					y1=point.y;
				}
				else
				{
					x1=point.x+y1.x;
					y1=point.y+y1.y;
				}
			}
			m=multiplyM([[this.transform11.val,this.transform21.val,this.transformdx.val],[this.transform12.val,this.transform22.val,this.transformdy.val]],[[cos,-sin,-x1*(cos-1)+y1*sin],[sin,cos,-y1*(cos-1)-x1*sin]]);
		}
		this.setMatrix(m);
		return this;
	},
	transform11:{val:1},
	transform12:{val:0},
	transform21:{val:0},
	transform22:{val:1},
	transformdx:{val:0},
	transformdy:{val:0},
	transform:function(m11,m12,m21,m22,dx,dy,reset)
	{
		if(reset!==undefined)
		{
			this.setMatrix([[m11,m21,dx],[m12,m22,dy]]);
		}
		else
		{
			var m=multiplyM([[this.transform11.val,this.transform21.val,this.transformdx.val],[this.transform12.val,this.transform22.val,this.transformdy.val]],[[m11,m21,dx],[m12,m22,dy]]);
			this.setMatrix(m);
		}
		return this;
	},
	beforeDraw:function(ctx)
	{
		if(!this.visible.val)return false;
		ctx.save();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			animating.call(clipObject.visible(true));
			clipObject.setOptns(ctx);
			ctx.beginPath();
			clipObject.draw(ctx);
			ctx.clip();
		}
		animating.call(this);
		this.setOptns(ctx);
		ctx.beginPath();
		return true;
	},
	clip:function(object)
	{
		if(object===undefined)return this.clip.val;
		object.visible(false);
		this.clip.val=object;
		redraw(this);
		return this;
	},
	afterDraw:function(optns)
	{
		checkEvents(this,optns);
		optns.ctx.closePath(); 
		optns.ctx.restore();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			if(clipObject.afterDrawObj)clipObject.afterDrawObj(optns);			
			clipObject.visible(false);
		}
	},
	isPointIn:function(x,y,global)
	{
		var ctx=canvases[this.layer.canvas].optns.ctx;
		if(global!==undefined)
		{
			x-=canvases[this.layer.canvas].optns.x;
			y-=canvases[this.layer.canvas].optns.y;
		}
		ctx.save();
		ctx.beginPath();
		this.draw(ctx);
		var point=isPointInPath(this,x,y);
		ctx.closePath(); 
		ctx.restore();
		if(point)return true;
		return false;
	}
	}
	if(canvases[lastCanvas]!==undefined && canvases[lastCanvas].layers[0]!==undefined)
	{	
		obj.level.val=obj.level.current=canvases[lastCanvas].layers[0].objs.length;
		canvases[lastCanvas].layers[0].objs[canvases[lastCanvas].layers[0].objs.length]=obj;
		obj.layer.number=0;
		obj.layer.canvas=lastCanvas;
		obj.layer.val=canvases[lastCanvas].layers[0].id.val;
		redraw(obj);
	}
	return obj;
}