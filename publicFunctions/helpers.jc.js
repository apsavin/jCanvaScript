jCanvaScript._helpers = {};
jCanvaScript._helpers.updateColor = function (object, color, prefix)
{
	if(color.notColor===undefined)
		color.val='rgba('+parseInt(object['_'+prefix+'ColorR'])+','+parseInt(object['_'+prefix+'ColorG'])+','+parseInt(object['_'+prefix+'ColorB'])+','+parseInt(object['_'+prefix+'ColorA']*100)/100+')';
	else
	{
		var notColor=color.notColor;
		var notColorLayer=jCanvaScript.canvases[notColor.canvas].layers[notColor.layer];
		if(notColorLayer.grdntsnptrns[notColor.level]!==undefined){color.val=notColorLayer.grdntsnptrns[notColor.level].val;}
	}
	return color;
}
jCanvaScript._helpers.animating = function(canvasOptions)
{
	var timeDiff=canvasOptions.timeDiff,
		progress=1;
	for(var q=0;q<this.animateQueue.length;q++)
	{
		var queue=this.animateQueue[q],
			duration=queue['duration'],
			easing=queue['easing'],
			step=queue.step,
			onstep=queue['onstep'],
			easingIn=easing['type']=='in' || (easing['type']=='inOut' && progress<0.5),
			easingOut=easing['type']=='out' || (easing['type']=='inOut' && progress>0.5);
			queue['step']+=timeDiff;
			progress=step/duration;
		for(var key in queue)
		{
			if(this[key]!==undefined && queue[key])
			{
				var property=queue[key],
					to=property['to'],
					from=property['from'];
				jCanvaScript._helpers.animateTransforms(key,this,queue);
				if(easingIn)this[key]=(to-from)*jCanvaScript.animateFunctions[easing['fn']](progress,easing)+from;
				if(easingOut)this[key]=(to-from)*(1-jCanvaScript.animateFunctions[easing['fn']](1-progress,easing))+from;
				if(onstep)onstep.fn.call(this,onstep);
				if(step>=duration)
				{
					this[key]=to;
					jCanvaScript._helpers.animateTransforms(key,this,queue);
					queue[key]=false;
					queue.animateKeyCount--;
					if(!queue.animateKeyCount)
					{
						if(queue.animateFn)queue.animateFn.apply(this);
						this.animateQueue.splice(q,1);
						q--;
					}
				}
			}
		}
	}
	if (this.animateQueue.length)this.redraw();
	else this.optns.animated=false;
	return this;
}
jCanvaScript._helpers.animateTransforms = function(key,object,queue)
{
	var val=object[key];
	var prev=queue[key]['prev'];
	switch(key)
	{
		case '_rotateAngle':
			object.rotate(val-prev,object._rotateX,object._rotateY);
			break;
		case '_translateX':
			object.translate(val-prev,0);
			break;
		case '_translateY':
			object.translate(0,val-prev);
			break;
		case '_translateToX':
			object.translateTo(val,undefined);
			break;
		case '_translateToY':
			object.translateTo(undefined,val);
			break;
		case '_scaleX':
			if(!prev)prev=1;
			object.scale(val/prev,1);
			break;
		case '_scaleY':
			if(!prev)prev=1;
			object.scale(1,val/prev);
			break;
		default:
			return;
	}
	queue[key]['prev']=val;
}

jCanvaScript._helpers.getRect = function(object, rect, type)
{
	if(type == 'poor')return rect;
	var
        min = {x: rect.x, y: rect.y},
        max = {x: rect.x + rect.width,
               y: rect.y + rect.height},
        m = jCanvaScript.Matrix.multiplyMatrixAndMatrix(object.matrix(), object.layer().matrix()),
        lt = jCanvaScript.Matrix.multiplyPointMatrix(min.x, min.y, m),
        rt = jCanvaScript.Matrix.multiplyPointMatrix(max.x, min.y, m),
        lb = jCanvaScript.Matrix.multiplyPointMatrix(min.x, max.y, m),
        rb = jCanvaScript.Matrix.multiplyPointMatrix(max.x, max.y, m),
        coordinates = [
            [lt.x, lt.y], [rt.x, rt.y],
            [lb.x, lb.y], [rb.x, rb.y]
        ];
	if(type == 'coords')return coordinates;
	var minX, minY,
	    maxX = minX = lt.x,
	    maxY = minY = lt.y;
	for(var i = 0; i < 4; i++)
	{
		if(maxX < coordinates[i][0])maxX = coordinates[i][0];
		if(maxY < coordinates[i][1])maxY = coordinates[i][1];
		if(minX > coordinates[i][0])minX = coordinates[i][0];
		if(minY > coordinates[i][1])minY = coordinates[i][1];
	}
	return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
}

jCanvaScript._helpers.getCenter = function(object, point, type)
{
	if(type=='poor') return point;
	return jCanvaScript.Matrix.multiplyPointMatrix(point.x, point.y, jCanvaScript.Matrix.multiplyMatrixAndMatrix(object.matrix(), object.layer().matrix()));
}
