jCanvaScript.addObject('ellipse',function(){
	this.draw=function(ctx)
	{
		 var kappa = .5522848,
		 ox = width / 2 * kappa, // control point offset horiz
		 oy = height / 2 * kappa, // control point offset vert
		 xe = x + width, // x end
		 ye = y + height, // y end
		 xm = x + width / 2, // x middle
		 ym = y + height / 2; // y middle
		 ctx.moveTo(this._x0,this._y0);
		 ctx.push([xm, y, x, ym - oy, xm - ox, y]);
		 points.push([xe, ym, xm + ox, y, xe, ym - oy]);
		 points.push([xm, ye, xe, ym + oy, xm + ox, ye]);
		 points.push([x, ym, xm - ox, ye, x, ym + oy]);
		 points.push([xm, y, x, ym - oy, xm - ox, y]);
		 ellipse.base(points,color,fill);
	}
});