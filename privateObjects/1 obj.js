proto.object=function()
{
	this.buffer=function(doBuffering){
		var bufOptns=this.optns.buffer;
		if(doBuffering===undefined)
			if(bufOptns.val)return bufOptns.cnv;
			else return false;
		if(bufOptns.val===doBuffering)return this;
		if(doBuffering)
		{
			var cnv=bufOptns.cnv=document.createElement('canvas');
			var ctx=bufOptns.ctx=cnv.getContext('2d');
			var rect=bufOptns.rect=this.getRect();
			cnv.setAttribute('width',rect.width);
			cnv.setAttribute('height',rect.height);
			var oldM=this.transform();
			bufOptns.x=this._x;
			bufOptns.y=this._y;
			bufOptns.dx=this._transformdx;
			bufOptns.dy=this._transformdy;
			this._x=this._y=0;
			this.transform(1, 0, 0, 1, -rect.x+bufOptns.dx, -rect.y+bufOptns.dy,true);
			this.setOptns(ctx);
			take(bufOptns.optns={},objectCanvas(this).optns);
			bufOptns.optns.ctx=ctx;
			this.draw(ctx);
			this._x=bufOptns.x;
			this._y=bufOptns.y;
			oldM[0][2]=rect.x;
			oldM[1][2]=rect.y;
			this.matrix(oldM);
			bufOptns.val=true;
		}
		else
		{
			this.translate(-bufOptns.rect.x+bufOptns.dx,-bufOptns.rect.y+bufOptns.dy);
			this.optns.buffer={val:false};
		}
		return this;
	}
	this.clone=function(params)
	{
		var clone=new proto[this._proto];
		proto[this._proto].prototype.base.call(clone);
		take(clone,this);
		clone.layer(objectLayer(this).optns.id);
		if(params===undefined) return clone;
		return clone.animate(params);
	}
	this.shadow= function(options)
	{
		for(var key in options)
		switch (key)
		{
			case 'x':
				this._shadowX=options.x;
				break;
			case 'y':
				this._shadowY=options.y;
				break;
			case 'blur':
				this._shadowBlur=options.blur;
				break;
			case 'color':
				var colorKeeper = parseColor(options.color);
				this._shadowColor = options.color.val;
				this._shadowColorR = colorKeeper.colorR;
				this._shadowColorG = colorKeeper.colorG;
				this._shadowColorB = colorKeeper.colorB;
				this._shadowColorA = colorKeeper.alpha;
				break;
		}
		redraw(this);
		return this;
	}
	this.setOptns=function(ctx)
	{
		ctx.globalAlpha = this._opacity;
		ctx.shadowOffsetX = this._shadowX;
		ctx.shadowOffsetY = this._shadowY;
		ctx.shadowBlur = this._shadowBlur;
		ctx.globalCompositeOperation=this._composite;
		ctx.shadowColor = 'rgba('+this._shadowColorR+','+this._shadowColorG+','+this._shadowColorB+','+this._shadowColorA+')';
		if(this.scaleMatrix)
		{
			this.matrix(multiplyM(this.matrix(),this.scaleMatrix));
			this.scaleMatrix=false;
		}
		if(this.rotateMatrix)
		{
			this.matrix(multiplyM(this.matrix(),this.rotateMatrix));
			this.rotateMatrix=false;
		}
		ctx.transform(this._transform11,this._transform12,this._transform21,this._transform22,this._transformdx,this._transformdy);
		return this;
	}
	this.up=function(n)
	{
		if(n === undefined)n=1;
		if(n == 'top')n=objectLayer(this).objs.length-1;
		this._level+=n;
		objectLayer(this).optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	}
	this.down=function(n)
	{
		if(n == undefined)n=1;
		if(n == 'bottom')n=this._level;
		this._level-=n;
		objectLayer(this).optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	}
	this.del=function()
	{
		this.optns.deleted=true;
		objectLayer(this).optns.anyObjDeleted = true;
		redraw(this);
	}
	this.focus=function(fn)
	{
		if(fn===undefined)
		{
			this.optns.focused=true;
			if(typeof this.onfocus=='function')this.onfocus();
		}
		else this.onfocus=fn;
		return this;
	}
	this.blur=function(fn)
	{
		if(fn===undefined)
		{
			this.optns.focused=false;
			if(typeof this.onblur == 'function')this.onblur();
		}
		else this.onblur=fn;
		return this;
	}
	this.click= function(fn)
	{
		return setMouseEvent.call(this,fn,'click');
	}
	this.dblclick = function(fn)
	{
		return setMouseEvent.call(this,fn,'dblclick');
	}
	this.keypress= function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeypress');
	}
	this.keydown= function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeydown');
	}
	this.keyup= function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeyup');
	}
	this.mousedown= function(fn)
	{
		return setMouseEvent.call(this,fn,'mousedown');
	}
	this.mouseup= function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseup');
	}
	this.mousemove= function(fn)
	{
		return setMouseEvent.call(this,fn,'mousemove');
	}
	this.mouseover= function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseover');
	}
	this.mouseout= function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseout');
	}
	this.attr=function(parameter,value)
	{
		if(typeof parameter==='object')
			var parameters=parameter;
		else
		{
			if(value===undefined)
				return this['_'+parameter];
			parameters={};
			parameters[parameter]=value;
		}
		return this.animate(parameters);
	}
	this.stop=function(jumpToEnd,runCallbacks)
	{
		this.optns.animated=false;
		if(runCallbacks===undefined)runCallbacks=false;
		if(jumpToEnd===undefined)jumpToEnd=false;
		for(var q=0;q<this.animateQueue.length;q++)
		{
			var queue=this.animateQueue[q];
			if(runCallbacks)queue.animateFn.call(this);
			if(jumpToEnd)
			for(var key in queue)
			{
				if(queue[key]['from']!==undefined)
				{
					this[key]=queue[key]['to'];
					animateTransforms(key,this,queue);
				}
			}
		}
		this.animateQueue=[];
		return this;
	}
	this.animate=function(options,duration,easing,onstep,fn)
	{
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
		if(duration!=1)duration=duration/1000*objectCanvas(this).fps;
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
			this._scaleX=this._scaleY=1;
			if(typeof options.scale!='object')
			{
				options.scaleX=options.scaleY=options.scale;
			}
			else
			{
				options.scaleX=options.scale.x||1;
				options.scaleY=options.scale.y||1;
			}
		}
		if(options.translate!==undefined)
		{
			this._translateX=this._translateY=0;
			if(typeof options.translate!='object')
			{
				options.translateX=options.translateY=options.translate;
			}
			else
			{
				options.translateX=options.translate.x||0;
				options.translateY=options.translate.y||0;
			}
			options.translate=undefined;
		}
		if(options.rotate!==undefined)
		{
			options.rotateAngle=options.rotate.angle;
			this._rotateAngle=0;
			this._rotateX=options.rotate.x||0;
			this._rotateY=options.rotate.y||0;
			options.rotate=undefined;
		}
		if(options.color !== undefined)
		{
			var colorKeeper=parseColor(options.color);
			if(colorKeeper.color.notColor)
				this.optns.color.notColor=colorKeeper.color.notColor;
			else
			{
				options.colorR=colorKeeper.colorR;
				options.colorG=colorKeeper.colorG;
				options.colorB=colorKeeper.colorB;
				options.alpha=colorKeeper.alpha;
			}
			options.color = undefined;
		}
		if(options.shadowColor !== undefined)
		{
			colorKeeper=parseColor(options.shadowColor);
			options.shadowColorR=colorKeeper.colorR;
			options.shadowColorG=colorKeeper.colorG;
			options.shadowColorB=colorKeeper.colorB;
			options.shadowColorA=colorKeeper.alpha;
			options.shadowColor = undefined;
		}
		if(duration>1)
		{
			var queue=this.animateQueue[this.animateQueue.length]={animateKeyCount:0};
			if (fn) queue.animateFn=fn;
			this.optns.animated=true;
		}
		for(var key in options)
		{
			if(this['_'+key] !== undefined && options[key]!==undefined)
			{
				if(options[key]!=this['_'+key])
				{
					if(options[key].charAt)
					{
						if(options[key].charAt(1)=='=')
						{
							options[key]=this['_'+key]+parseInt(options[key].charAt(0)+options[key].substr(2));
						}
						else if(!regHasLetters.test(options[key]))options[key]=parseInt(options[key]);
						else this['_'+key]=options[key];
					}
					if(duration==1)this['_'+key]=options[key];
					else
					{
						queue['_'+key]={
							from:this['_'+key],
							to:options[key],
							duration:duration,
							step:1,
							easing:easing,
							onstep:onstep,
							prev:0
						}
						queue.animateKeyCount++;
					}
				}
			}
		}
		if(duration==1)
		{
			if(options['rotateAngle'])
				this.rotate(this._rotateAngle,this._rotateX,this._rotateY);
			if(options['translateX']||options['translateY'])
				this.translate(this._translateX,this._translateY);
			if(options['scaleX']||options['scaleY'])
				this.scale(this._scaleX,this._scaleY);
		}
		redraw(this);
		return this;
	}
	this.matrix=function(m)
	{
		if(m===undefined)return [[this._transform11,this._transform21,this._transformdx],[this._transform12,this._transform22,this._transformdy]];
		this._transform11=m[0][0];
		this._transform21=m[0][1];
		this._transform12=m[1][0];
		this._transform22=m[1][1];
		this._transformdx=m[0][2];
		this._transformdy=m[1][2];
		return this;
	}
	this.translateTo=function(newX,newY,duration,easing,onstep,fn)
	{
		var oldX=this._x+this._transformdx,
			oldY=this._y+this._transformdy,
			x=newX-oldX,y=newY-oldY;
		return this.translate(x,y,duration,easing,onstep,fn);
	}
	this.translate=function(x,y,duration,easing,onstep,fn)
	{
		if(duration!==undefined)
			return this.animate({translate:{x:x,y:y}},duration,easing,onstep,fn);
		this.matrix(multiplyM(this.matrix(),[[1,0,x],[0,1,y]]));
		redraw(this);
		return this;
	}
	this.scale=function(x,y,duration,easing,onstep,fn)
	{
		if(duration!==undefined)
			return this.animate({scale:{x:x,y:y}},duration,easing,onstep,fn);
		if(y===undefined)y=x;
		if(this.scaleMatrix)
			this.scaleMatrix=multiplyM(this.scaleMatrix,[[x,0,this._x*(1-x)],[0,y,this._y*(1-y)]]);
		else
			this.scaleMatrix=[[x,0,this._x*(1-x)],[0,y,this._y*(1-y)]];
		redraw(this);
		return this;
	}
	this.rotate=function(x,x1,y1,duration,easing,onstep,fn)
	{
		if(duration!==undefined)
			return this.animate({rotate:{angle:x,x:x1,y:y1}},duration,easing,onstep,fn);
		redraw(this);
		x=x/radian;
		var cos=Math.cos(x);
		var sin=Math.sin(x);
		var matrix=[];
		if(x1===undefined)
		{
			matrix=[[cos,-sin,0],[sin,cos,0]];
		}
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
			matrix=[[cos,-sin,-x1*(cos-1)+y1*sin],[sin,cos,-y1*(cos-1)-x1*sin]];
		}
		if(this.rotateMatrix)
				this.rotateMatrix=multiplyM(this.rotateMatrix,matrix);
			else
				this.rotateMatrix=matrix;
		return this;
	}
	this.transform=function(m11,m12,m21,m22,dx,dy,reset)
	{
		if(m11===undefined)return this.matrix();
		if(reset!==undefined)
		{
			this.matrix([[m11,m21,dx],[m12,m22,dy]]);
		}
		else
		{
			var m=multiplyM(this.matrix(),[[m11,m21,dx],[m12,m22,dy]]);
			this.matrix(m);
		}
		redraw(this);
		return this;
	}
	this.beforeDraw=function(ctx)
	{
		if(!this._visible)return false;
		ctx.save();
		if(this.optns.clipObject)
		{
			var clipObject=this.optns.clipObject;
			clipObject._visible=true;
			if (clipObject.optns.animated)animating.call(clipObject);
			clipObject.setOptns(ctx);
			ctx.beginPath();
			clipObject.draw(ctx);
			ctx.clip();
		}
		this.setOptns(ctx);
		if (this.optns.animated)animating.call(this);
		ctx.beginPath();
		return true;
	}
	this.clip=function(object)
	{
		if(object===undefined)return this.optns.clipObject;
		objectLayer(this).objs.splice(object._level,1);
		this.optns.clipObject=object;
		return this;
	}
	this.afterDraw=function(optns)
	{
		optns.ctx.closePath();
		checkEvents(this,optns);
		optns.ctx.restore();
		if(this.optns.clipObject)
		{
			proto.shape.prototype.afterDraw.call(this.optns.clipObject,optns);
		}
	}
	this.isPointIn=function(x,y,global)
	{
		var canvasOptns=objectCanvas(this).optns;
		var ctx=canvasOptns.ctx;
		if(global!==undefined)
		{
			x-=canvasOptns.x;
			y-=canvasOptns.y;
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
	this.layer=function(idLayer)
	{
		return layer(idLayer,this,'objs');
	}
	this.canvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'objs');
	}
	this.draggable=function(object,params,fn)
	{
		var dragObj=this;
		var dragOptns=this.optns.drag;
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
		dragOptns.shiftX=0;
		dragOptns.shiftY=0;
		if(params!==undefined)
		{
			if(params.shiftX!==undefined){dragOptns.shiftX=params.shiftX;params.shiftX=undefined;}
			if(params.shiftY!==undefined){dragOptns.shiftY=params.shiftY;params.shiftY=undefined;}
		}
		if(object!==undefined)
		{
			if(object.id)dragObj=(params===undefined)? object.visible(false) : object.animate(params).visible(false);
			if(object=='clone')
			{
				dragObj=this.clone(params).visible(false);
				dragOptns.type='clone';
			}
		}
		dragOptns.val=true;
		dragOptns.x=this._x;
		dragOptns.y=this._y;
		dragOptns.dx=this._transformdx;
		dragOptns.dy=this._transformdy;
		dragOptns.object=dragObj;
		dragOptns.params=params;
		dragOptns.fn=fn||false;
		var optns=objectCanvas(this).optns;
		optns.mousemove.val=true;
		optns.mousedown.val=true;
		optns.mouseup.val=true;
		return this;
	}
	this.droppable=function(fn)
	{
		this.optns.drop.val=true;
		if(fn!==undefined)this.optns.drop.fn=fn;
		return this;
	}
	this.name = function(name)
	{
		return this.attr('name',name);
	}
	this.visible=function(visibility)
	{
		return this.attr('visible',visibility);
	}
	this.composite=function(composite)
	{
		return this.attr('composite',composite);
	}
	this.id=function(id)
	{
		if(id===undefined)return this.optns.id;
		this.optns.id=id;
		return this;
	}
	this.opacity=function(n)
	{
		return this.attr('opacity',n);
	}
	this.fadeIn=function(duration,easing,onstep,fn)
	{
		return this.fadeTo(1,duration,easing,onstep,fn);
	}
	this.fadeOut=function(duration,easing,onstep,fn)
	{
		return this.fadeTo(0,duration,easing,onstep,fn);
	}
	this.fadeTo=function(val,duration,easing,onstep,fn)
	{
		if(duration===undefined)duration=600;
		return this.animate({opacity:val},duration,easing,onstep,fn);
	}
	this.fadeToggle=function(duration,easing,onstep,fn)
	{
		if(this._opacity)
			this.fadeOut(duration,easing,onstep,fn);
		else
			this.fadeIn(duration,easing,onstep,fn);
		return this;
	}
	this.level=function(n)
	{
		if(n == undefined)return this._level;
		this._level=n;
		objectLayer(this).optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	}
	this.instanceOf=function(name)
	{
		if(name===undefined)return this._proto;
		return this instanceof proto[name];
	}
	this.base=function(x,y,service)
	{
		var canvasItem=canvases[lastCanvas];
		this.optns={
			animated:false,
			clipObject:false,
			drop:{val:false,fn:function(){}},
			drag:{val:false},
			layer:{id:canvasItem.optns.id+"Layer0",number:0},
			canvas:{number:0},
			focused:false,
			buffer:{val:false}
		}
		this.animateQueue = [];
		this._x=x||0;
		this._y=y||0;
		if(service===undefined && canvasItem!==undefined && canvasItem.layers[0]!==undefined)
		{
			this.optns.layer.number=0;
			this.optns.canvas.number=lastCanvas;
			this._level=objectLayer(this).objs.length;
			objectLayer(this).objs[this._level]=this;
			this.optns.layer.id=objectLayer(this).optns.id;
			redraw(this);
		}
		return this;
	}
	this._visible=true;
	this._composite='source-over';
	this._name="";
	this._opacity=1;
	this._shadowX=0;
	this._shadowY=0;
	this._shadowBlur= 0;
	this._shadowColor= 'rgba(0,0,0,0)';
	this._shadowColorR= 0;
	this._shadowColorG= 0;
	this._shadowColorB= 0;
	this._shadowColorA= 0;
	this._translateX=0;
	this._translateY=0;
	this._scaleX=1;
	this._scaleY=1;
	this._rotateAngle=0;
	this._rotateX=0;
	this._rotateY=0;
	this._transform11=1;
	this._transform12=0;
	this._transform21=0;
	this._transform22=1;
	this._transformdx=0;
	this._transformdy=0;
	this.rotateMatrix=this.scaleMatrix=false;
}