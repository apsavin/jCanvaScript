function obj(x,y)
{	
	var opacity=function(n)
	{
		if(n === undefined) return this.opacity.val;
		else 
		{
			this.opacity.val=n;
			return this;
		}
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
		return this;
	}
	visible.val=true;
	var droppable=function(fn)
	{
		this.droppable.val=true;
		this.droppable.fn=fn;
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
		if(params!==undefined)
		{
			if(params.shiftX!==undefined){this.draggable.shiftX=params.shiftX;params.shiftX=undefined;}
			else this.draggable.shiftX=0;
			if(params.shiftY!==undefined){this.draggable.shiftY=params.shiftY;params.shiftY=undefined;}
			else this.draggable.shiftY=0;
		}
		else
		{
			this.draggable.shiftX=0;
			this.draggable.shiftY=0;
		}
		if(object!==undefined)
		{
			if(object.id)if(params===undefined)dragObj=object.visible(false);else dragObj=object.animate(params).visible(false);
			if(object=='clone')
			{
				dragObj=this.clone(params).visible(false);
				this.draggable.type='clone';
			}
		}
		this.draggable.val=true;
		this.draggable.x=this.x.val;
		this.draggable.y=this.y.val;
		this.draggable.object=dragObj;
		this.draggable.params=params;
		this.draggable.fn=fn||false;
		var optns=canvases[this.layer.canvas].optns;
		optns.anyObjOnMouseMove.val=true;
		optns.anyObjOnMouseDown.val=true;
		optns.anyObjOnMouseUp.val=true;
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
		clone.animate(params);
		return clone;
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
		if(options.x !== undefined)
		{
			this.shadowX.val=options.x;
		}
		if(options.y !== undefined)
		{
			this.shadowY.val=options.y;
		}
		if(options.blur !== undefined)
		{
			this.shadowBlur.val=options.blur;
		}
		if(options.color !== undefined)
		{
			var colorKeeper = parseColor(options.color);
			this.shadowColor = options.color.val;
			this.shadowColorR = colorKeeper.colorR;
			this.shadowColorG = colorKeeper.colorG;
			this.shadowColorB = colorKeeper.colorB;
			this.shadowColorA = colorKeeper.alpha;
		}
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
		return this;
	},
	down:function(n)
	{						
		if(n == undefined)n=1;
		if(n == 'bottom')n=this.level.val;
		this.level.val-=n;
		canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjLevelChanged = true;
		return this;
	},
	level:function(n)
	{
		if(n == undefined)return this.level.val;
		this.level.val=n;
		canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjLevelChanged = true;
		return this;
	},
	layer:olayer,
	canvas:ocanvas,
	del:function()
	{
		this.draw=false;
		canvases[this.layer.canvas].layers[this.layer.number].optns.anyObjDeleted = true;
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
		if(fn===undefined)this.onclick();
		else this.onclick = fn;
		canvases[this.layer.canvas].optns.anyObjOnMouseClick.val=true;
		return this;
	},
	keypress: function(fn)
	{
		if(fn===undefined)this.onkeypress();
		else this.onkeypress = fn;
		return this;
	},
	keydown: function(fn)
	{
		if(fn===undefined)this.onkeydown();
		else this.onkeydown = fn;
		return this;
	},
	keyup: function(fn)
	{
		if(fn===undefined)this.onkeyup();
		else this.onkeyup = fn;
		return this;
	},
	mousedown: function(fn)
	{
		if(fn===undefined)this.onmousedown();
		else this.onmousedown = fn;
		canvases[this.layer.canvas].optns.anyObjOnMouseDown.val=true;
		return this;
	},
	mouseup: function(fn)
	{
		if(fn===undefined)this.onmouseup();
		else this.onmouseup = fn;
		canvases[this.layer.canvas].optns.anyObjOnMouseUp.val=true;
		return this;
	},
	mousemove: function(fn)
	{
		if(fn===undefined)this.onmousemove();
		else this.onmousemove = fn;
		canvases[this.layer.canvas].optns.anyObjOnMouseMove.val=true;
		return this;
	},
	mouseover: function(fn)
	{
		if(fn===undefined)this.onmouseover();
		else this.onmouseover = fn;
		canvases[this.layer.canvas].optns.anyObjOnMouseMove.val=true;
		return this;
	},
	mouseout: function(fn)
	{
		if(fn===undefined)this.onmouseout();
		else this.onmouseout = fn;
		canvases[this.layer.canvas].optns.anyObjOnMouseMove.val=true;
		return this;
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
			options.colorR=colorKeeper.colorR.val;
			options.colorG=colorKeeper.colorG.val;
			options.colorB=colorKeeper.colorB.val;
			options.alpha=colorKeeper.alpha.val;
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
						else options[key]=parseInt(options[key]);
					}
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
		return this;
	},
	animating:function()
	{
		if (!this.animate.val)return false;
		var i=0;
		var fnlimit=this.fn.length;
		var progress=1;
		for(var key in this)
		{
			if(this.hasOwnProperty(key))
			{
				i++;
				if(this[key]===undefined)continue;
				if(this[key]['from']!==undefined)
				{
					this[key]['step']++;
					progress=this[key]['step']/this[key]['duration'];
					if(this[key]['easing']['type']=='in' || (this[key]['easing']['type']=='inOut' && progress<0.5))this[key]['val']=(this[key]['to']-this[key]['from'])*animateFunctions[this[key]['easing']['fn']](progress,this[key]['easing'])+this[key]['from'];
					if(this[key]['easing']['type']=='out' || (this[key]['easing']['type']=='inOut' && progress>0.5))this[key]['val']=(this[key]['to']-this[key]['from'])*(1-animateFunctions[this[key]['easing']['fn']](1-progress,this[key]['easing']))+this[key]['from'];
					if(this[key]['onstep'])this[key]['onstep'].fn.call(this,this[key]['onstep']);
					if(key=='rotateAngle'){this.rotate(this[key]['val']-this[key]['prev'],this.rotateX.val,this.rotateY.val);this[key]['prev']=this[key]['val'];}
					if(this[key]['step']>this[key]['duration'])
					{
						this[key]['from']=undefined;	
						this[key]['val']=this[key]['to'];
						if(key=='rotateAngle'){this.rotate(this[key]['val']-this[key]['prev'],this.rotateX.val,this.rotateY.val);}
						for(var j=0;j<fnlimit;j++)
							if(this.fn[j][key])
							{
								this.fn[j][key]=false;
								this.fn[j].count--;
							}
					}
				}
				else 
				{
					for(j=0;j<fnlimit;j++)
					{
						if(this['fn'][j]['func'] != 0 && !this['fn'][j]['count'] && this.fn[j].enabled)
						{
							this.fn[j].enabled=false;
							this['fn'][j]['func'].apply(this);
						}
					}
					i--;
				}
			}
		}
		if (i==0)
		{
			this.animate.val=false;
		}
	},
	setMatrix:function(m)
	{
		this.transform11.val=m[0][0];
		this.transform21.val=m[0][1];
		this.transform12.val=m[1][0];
		this.transform22.val=m[1][1];
		this.transformdx.val=m[0][2];
		this.transformdy.val=m[1][2];
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
			clipObject.visible(true);
			clipObject.setOptns(ctx);
			ctx.beginPath();
			clipObject.draw(ctx);
			ctx.clip();
		}
		this.animating();
		this.setOptns(ctx);
		ctx.beginPath();
		return true;
	},
	clip:function(object)
	{
		if(object===undefined)return this.clip.val;
		object.visible(false);
		this.clip.val=object;
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
	}
	return obj;
}