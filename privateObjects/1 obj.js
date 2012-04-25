proto.object=function()
{
	this.getCenter=function(type){
		var rect=this.getRect('poor'),
		point = {
					x:(rect.x*2+rect.width)/2,
					y:(rect.y*2+rect.height)/2
				};
		return getCenter(this,point,type);
	}
	this.position=function(){
		return multiplyPointM(this._x,this._y,multiplyM(this.matrix(),objectLayer(this).matrix()));
	}
	this.buffer=function(doBuffering){
		var bufOptns=this.optns.buffer;
		if(doBuffering===undefined)
			if(bufOptns.val)return bufOptns.cnv;
			else return false;
		if(bufOptns.val===doBuffering)return this;
		if(doBuffering)
		{
			var cnv=bufOptns.cnv=document.createElement('canvas'),
				ctx=bufOptns.ctx=cnv.getContext('2d'),
				rect=bufOptns.rect=this.getRect(),
				oldM=this.transform();
			cnv.setAttribute('width',rect.width);
			cnv.setAttribute('height',rect.height);
			bufOptns.x=this._x;
			bufOptns.y=this._y;
			bufOptns.dx=this._transformdx;
			bufOptns.dy=this._transformdy;
			this._x=this._y=0;
			this.transform(1, 0, 0, 1, -rect.x+bufOptns.dx, -rect.y+bufOptns.dy,true);
			this.setOptns(ctx);
			take(bufOptns.optns={},objectCanvas(this).optns);
			bufOptns.optns.ctx=ctx;
			this.draw(bufOptns.optns);
			this._x=bufOptns.x;
			this._y=bufOptns.y;
			this.transform(oldM[0][0], oldM[1][0], oldM[0][1], oldM[1][1], rect.x, rect.y,true);
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
		take(clone.optns.transformMatrix,this.optns.transformMatrix);
		take(clone.optns.translateMatrix,this.optns.translateMatrix);
		take(clone.optns.scaleMatrix,this.optns.scaleMatrix);
		take(clone.optns.rotateMatrix,this.optns.rotateMatrix);
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
				this._shadowColorR = colorKeeper.r;
				this._shadowColorG = colorKeeper.g;
				this._shadowColorB = colorKeeper.b;
				this._shadowColorA = colorKeeper.a;
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
        var rInt = parseInt(this._shadowColorR),
            gInt = parseInt(this._shadowColorG),
            bInt = parseInt(this._shadowColorB),
            aInt = parseInt(this._shadowColorA * 100) / 100;
        if (this._shadowColorRPrev !== rInt || this._shadowColorGPrev !== gInt || this._shadowColorBPrev !== bInt || this._shadowColorAPrev !== aInt) {
            ctx.shadowColor = this._shadowColor = 'rgba(' + rInt + ', ' + gInt + ', ' + bInt + ', ' + aInt+ ')';
            this._shadowColorRPrev = rInt;
            this._shadowColorGPrev = gInt;
            this._shadowColorBPrev = bInt;
            this._shadowColorAPrev = aInt;
        }
        else {
            ctx.shadowColor = this._shadowColor;
        }
		ctx.transform(this._transform11,this._transform12,this._transform21,this._transform22,this._transformdx,this._transformdy);
		return this;
	}
	this.up=function(n)
	{
		if(n === undefined)n=1;
		if(n=='top')this.level(n);
		else {
			var next=objectLayer(this).objs[this.optns.number+n];
			if(next!==undefined)
			{
				n=next._level+1-this._level;
			}
			this.level(this._level+n);
		}
		return this;
	}
	this.down=function(n)
	{
		if(n == undefined)n=1;
		if(n == 'bottom')this.level(n);
		else {
			var previous=objectLayer(this).objs[this.optns.number-n];
			if(previous!==undefined)
			{
				n=this._level-(previous._level-1);
			}
			this.level(this._level-n);
		}
		return this;
	}
	this.level=function(n)
	{
		if(n == undefined)return this._level;
		var layer=objectLayer(this);
		if(n=='bottom')
		{
			if(this.optns.number==0)n=this._level;
			else n=layer.objs[0]._level-1;
		}
		if(n=='top')
		{
			if(this.optns.number==layer.objs.length)n=this._level;
			else n=layer.objs[layer.objs.length-1]._level+1;
		}
		this._level=n;
		layer.optns.anyObjLevelChanged = true;
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
	this.queue=function(){
		var animateQueueLength=this.animateQueue.length, queue,i,j,duration=0,longFn=0,fn,args=arguments;
		for (i=0;i<args.length;i++)
		{
			if(typeof args[i]=='function'){
				args[i].apply(this);
				args[i]=false;
				i++;
				if(this.animateQueue.length>animateQueueLength)
				{
					for (j=animateQueueLength;j<this.animateQueue.length;j++)
					{
						queue=this.animateQueue[j];
						if(queue.duration!==undefined){
							if(queue.duration>duration)
							{
								duration=queue.duration;
								longFn=j;
							}
							break;
						}
					}
					if(duration){
						queue=this.animateQueue[longFn];
						if(queue.animateFn){
							fn=queue.animateFn;
							queue.animateFn=function(){
								fn.apply(this);
								this.queue.apply(this,args)
							}
						}
						else queue.animateFn=function(){this.queue.apply(this,args)};
						break;
					}
				}
			}
		}
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
		if(options.translateTo!==undefined)
		{
			var point=this.position();
			this._translateToX=point.x;
			this._translateToY=point.y;
			if(typeof options.translateTo!='object')
			{
				options.translateToX=options.translateToY=options.translateTo;
			}
			else
			{
				options.translateToX=options.translateTo.x||0;
				options.translateToY=options.translateTo.y||0;
			}
			options.translateTo=undefined;
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
				options.colorR=colorKeeper.r;
				options.colorG=colorKeeper.g;
				options.colorB=colorKeeper.b;
				options.alpha=colorKeeper.a;
			}
			options.color = undefined;
		}
		if(options.shadowColor !== undefined)
		{
			colorKeeper=parseColor(options.shadowColor);
			options.shadowColorR=colorKeeper.r;
			options.shadowColorG=colorKeeper.g;
			options.shadowColorB=colorKeeper.b;
			options.shadowColorA=colorKeeper.a;
			options.shadowColor = undefined;
		}
		if(duration>1)
		{
			var queue=this.animateQueue[this.animateQueue.length]={animateKeyCount:0};
			queue.animateFn=fn||false;
			this.optns.animated=true;
			queue.duration=duration;
			queue.step=0;
			queue.easing=easing;
			queue.onstep=onstep;
		}
		for(var key in options)
		{
			if(this['_'+key] !== undefined && options[key]!==undefined)
			{
				var keyValue=options[key],privateKey='_'+key;
				if(keyValue!=this[privateKey])
				{
					if(keyValue.charAt)
					{
						if(key=='string')this._string=keyValue;
						else if(keyValue.charAt(1)=='=')
						{
							keyValue=this[privateKey]+parseInt(keyValue.charAt(0)+'1')*parseInt(keyValue.substr(2));
						}
						else if(!regHasLetters.test(keyValue))keyValue=parseInt(keyValue);
						else this[privateKey]=keyValue;
					}
					if(duration==1)this[privateKey]=keyValue;
					else
					{
						queue[privateKey]={
							from:this[privateKey],
							to:keyValue,
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
			if(options['translateToX']||options['translateToY'])
				this.translate(this._translateToX,this._translateToY);
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
		if(duration!==undefined)
			return this.animate({translateTo:{x:newX,y:newY}},duration,easing,onstep,fn);
		var point=this.position(),
			x=0,y=0;
		if(newX!==undefined)
			x=newX-point.x;
		if(newY!==undefined)
			y=newY-point.y;
		return this.translate(x,y);
	}
	this.translate=function(x,y,duration,easing,onstep,fn)
	{
		if(duration!==undefined)
			return this.animate({translate:{x:x,y:y}},duration,easing,onstep,fn);
		this.optns.translateMatrix=multiplyM(this.optns.translateMatrix,[[1,0,x],[0,1,y]]);
		changeMatrix(this);
		return this;
	}
	this.scale=function(x,y,duration,easing,onstep,fn)
	{
		if(duration!==undefined)
			return this.animate({scale:{x:x,y:y}},duration,easing,onstep,fn);
		if(y===undefined)y=x;
		this.optns.scaleMatrix=multiplyM(this.optns.scaleMatrix,[[x,0,this._x*(1-x)],[0,y,this._y*(1-y)]]);
		changeMatrix(this);
		return this;
	}
	this.rotate=function(x,x1,y1,duration,easing,onstep,fn)
	{
		if(duration!==undefined)
			return this.animate({rotate:{angle:x,x:x1,y:y1}},duration,easing,onstep,fn);
		x=x/radian;
		var cos=m_cos(x),
			sin=m_sin(x),
			translateX=0,
			translateY=0;
		if(x1!==undefined)
		{
			if(x1=='center')
			{
				var point=this.getCenter('poor');
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
			translateX=-x1*(cos-1)+y1*sin;
			translateY=-y1*(cos-1)-x1*sin;
		}
		this.optns.rotateMatrix=multiplyM(this.optns.rotateMatrix,[[cos,-sin,translateX],[sin,cos,translateY]]);
		changeMatrix(this);
		return this;
	}
	this.transform=function(m11,m12,m21,m22,dx,dy,reset)
	{
		if(m11===undefined)return this.matrix();
		var optns=this.optns;
		if(reset!==undefined)
		{
			optns.transformMatrix=[[m11,m21,dx],[m12,m22,dy]];
			optns.rotateMatrix=[[1,0,0],[0,1,0]];
			optns.scaleMatrix=[[1,0,0],[0,1,0]];
			optns.translateMatrix=[[1,0,0],[0,1,0]];
		}
		else
		{
			optns.transformMatrix=multiplyM(optns.transformMatrix,[[m11,m21,dx],[m12,m22,dy]]);
		}
		changeMatrix(this);
		return this;
	}
	this.beforeDraw=function(canvasOptns)
	{
		if(!this._visible)return false;
		var ctx=canvasOptns.ctx;
		ctx.save();
		if(this.optns.clipObject)
		{
			var clipObject=this.optns.clipObject;
			clipObject._visible=true;
			if (clipObject.optns.animated)animating.call(clipObject,canvasOptns);
			clipObject.setOptns(ctx);
			ctx.beginPath();
			clipObject.draw(ctx);
			ctx.clip();
		}
		this.setOptns(ctx);
		if (this.optns.animated)animating.call(this,canvasOptns);
		ctx.beginPath();
		return true;
	}
	this.clip=function(object)
	{
		if(object===undefined)return this.optns.clipObject;
		objectLayer(this).objs.splice(object.optns.number,1);
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
		var canvasOptns=objectCanvas(this).optns,
			ctx=canvasOptns.ctx,
			thisAnimated=false,
			optns=this.optns,
			clipAnimated=false;
		if(global!==undefined)
		{
			x-=canvasOptns.x;
			y-=canvasOptns.y;
		}
		if(optns.animated)thisAnimated=true;
		optns.animated=false;
		if(optns.clipObject)
		{
			var clipObject=optns.clipObject,
				clipOptns=clipObject.optns;
			if(clipOptns.animated)
			{
				clipAnimated=true;
				clipOptns.animated=false;
			}
		}
		objectLayer(this).setOptns(ctx);
		this.beforeDraw(canvasOptns);
		this.draw(ctx);
		var point=isPointInPath(this,x,y);
		ctx.closePath();
		ctx.restore();
		ctx.setTransform(1,0,0,1,0,0);
		optns.animated=thisAnimated;
		if(clipAnimated)
		{
			clipOptns.animated=clipAnimated;
		}
		return point;
	}
	this.layer=function(idLayer)
	{
		return layer(idLayer,this,'objs');
	}
	this.canvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'objs');
	}
	this.draggable=function(object,params,drag)
	{
		if(params===undefined && typeof object=='object' && object.optns===undefined)
		{
			params=object.params;
			drag=object.drag;
			var start=object.start,
				stop=object.stop,
				disabled=object.disabled;
			object=object.object;
		}
		var dragObj=this;
		var dragOptns=this.optns.drag;
		if(typeof params==='function')
		{
			drag=params;
			params=undefined;
		}
		if(typeof object=='function')
		{
			drag=object;
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
		dragOptns.drag=drag||false;
		dragOptns.start=start||false;
		dragOptns.stop=stop||false;
		dragOptns.disabled=disabled||false;
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
    this.hasName = function(name){
        var namesArray = this.attr('name').split(' '), i = 0;
        while(i < namesArray.length){
            if(namesArray[i] === name){
                return true;
            }
            i++;
        }
        return false;
    }
    this.addName = function(name)
    {
        var namesArray = this.attr('name').split(' '), i = 0;
        while(i < namesArray.length){
            if(namesArray[i] === name){
                return this;
            }
            i++;
        }
        namesArray.push(name);
        return this.attr('name', namesArray.join(' '));
    }
    this.removeName = function(name)
    {
        var namesArray = this.attr('name').split(' '), i = 0;
        while(i < namesArray.length){
            if(namesArray[i] === name){
                namesArray.splice(i, 1);
                return this.attr('name', namesArray.join(' '));
            }
            i++;
        }
        return this;
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
	this.instanceOf=function(name)
	{
		if(name===undefined)return this._proto;
		return this instanceof proto[name];
	}
	this.base=function(x,y,service)
	{
		if(typeof x == 'object'){
			x=checkDefaults(x,{x:0,y:0,service:false});
			service=x.service;
			y=x.y;
			x=x.x;
		}
		else{if(service===undefined)service=false;}
		var canvasItem=canvases[lastCanvas];
		this.optns={
			animated:false,
			clipObject:false,
			drop:{val:false,fn:function(){}},
			drag:{val:false},
			layer:{id:canvasItem.optns.id+"Layer0",number:0},
			canvas:{number:0},
			focused:false,
			buffer:{val:false},
			rotateMatrix:[[1,0,0],[0,1,0]],
			scaleMatrix:[[1,0,0],[0,1,0]],
			translateMatrix:[[1,0,0],[0,1,0]],
			transformMatrix:[[1,0,0],[0,1,0]]
		}
		this.animateQueue = [];
		this._x=x;
		this._y=y;
		if(service==false && canvasItem!==undefined && canvasItem.layers[0]!==undefined)
		{
			this.optns.layer.number=0;
			this.optns.canvas.number=lastCanvas;
			var layer=objectLayer(this),
			limit=layer.objs.length;
			this.optns.number=limit;
			this._level=limit?(layer.objs[limit-1]._level+1):0;
			layer.objs[limit]=this;
			this.optns.layer.id=layer.optns.id;
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
    this._shadowColorRPrev= 0;
    this._shadowColorGPrev= 0;
    this._shadowColorBPrev= 0;
    this._shadowColorAPrev= 0;
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
	this._matrixChanged=false;
}
proto.object.prototype=new proto.object();