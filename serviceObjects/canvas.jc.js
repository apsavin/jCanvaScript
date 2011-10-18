jCanvaScript.Proto.Canvas = function(idCanvas){
    var limit = jCanvaScript.canvases.length;
    jCanvaScript.canvases[limit] = this;
    jCanvaScript._lastCanvas = limit;
    this.cnv = document.getElementById(idCanvas);
    if ('\v' == 'v') {
        if (typeof G_vmlCanvasManager !== 'undefined')
            G_vmlCanvasManager.initElement(this.cnv);
        if (typeof FlashCanvas !== 'undefined')
            FlashCanvas.initElement(this.cnv);
    }
    this.optns =
    {
        id:idCanvas,
        number:jCanvaScript._lastCanvas,
        ctx: this.cnv.getContext('2d'),
        width: this.cnv.offsetWidth || this.cnv.width,
        height: this.cnv.offsetHeight || this.cnv.height,
        anyLayerDeleted: false,
        anyLayerLevelChanged:false,
        keydown:{val:false,code:false},
        keyup:{val:false,code:false},
        keypress:{val:false,code:false},
        mousemove:{val:false,x:false,y:false,object:false},
        click:{val:false,x:false,y:false,objects:[]},
        dblclick:{val:false,x:false,y:false,objects:[]},
        mouseup:{val:false,x:false,y:false,objects:[]},
        mousedown:{val:false,x:false,y:false,objects:[]},
        drag:{object:false,x:0,y:0},
        gCO: 'source-over',
        redraw:1
    };
    this.layers = [];
    this.interval = 0;
    this._proto = 'Canvas';
    jCanvaScript.layer(idCanvas+'_default').canvas(idCanvas);
}

jCanvaScript.Proto.Canvas.prototype.width = function(width){
	if(width === undefined)
		return this.cnv.width;
	this.optns.width = this.cnv.width = width;
	this.cnv.style.width = width + 'px';
	this.optns.redraw = 1;
	return this;
};
jCanvaScript.Proto.Canvas.prototype.height = function(height){
	if(height === undefined)
		return this.cnv.height;
	this.optns.heigth = this.cnv.height = height;
	this.cnv.style.height = height + 'px';
	this.optns.redraw = 1;
	return this;
};
jCanvaScript.Proto.Canvas.prototype.id = jCanvaScript.Proto.Object.prototype.id
jCanvaScript.Proto.Canvas.prototype.toDataURL = function() {
    return canvas.cnv.toDataURL.apply(canvas.cnv, arguments);
};

jCanvaScript.Proto.Canvas.prototype.start = function(isAnimated) {
    jCanvaScript._lastCanvas = this.optns.number;
    if (isAnimated) {
        if (this.interval)return this;
        this.isAnimated = isAnimated;
        var offset = jCanvaScript.getOffset(this.cnv);
        this.optns.x = offset.left + (parseInt(this.cnv.style.borderTopWidth) || 0);
        this.optns.y = offset.top + (parseInt(this.cnv.style.borderLeftWidth) || 0);
        var canvas = canvases[this.optns.number],
            optns = canvas.optns;
        this.cnv.onclick = function(e) {
            mouseEvent(e, 'click', optns);
        };
        this.cnv.ondblclick = function(e) {
            mouseEvent(e, 'dblclick', optns);
            var tmp = optns.mousemove.val;
            optns.mousemove.val = true;
            setTimeout(function() {
                optns.mousemove.val = tmp;
            }, 3000);
        };
        this.cnv.onmousedown = function(e) {
            mouseEvent(e, 'mousedown', optns);
        };
        this.cnv.onmouseup = function(e) {
            mouseEvent(e, 'mouseup', optns);
        };
        this.cnv.onkeyup = function(e) {
            keyEvent(e, 'keyup', optns);
        };
        this.cnv.onkeydown = function(e) {
            keyEvent(e, 'keydown', optns);
        };
        this.cnv.onkeypress = function(e) {
            keyEvent(e, 'keypress', optns);
        };
        this.cnv.onmouseout = this.cnv.onmousemove = function(e) {
            mouseEvent(e, 'mousemove', optns);
        };
        optns.timeLast = new Date();
        this.interval = requestAnimFrame(function(time) {
                canvas.interval = canvas.interval || 1;
                canvas.frame(time);
            },
            this.cnv);
    }
    else return this.frame();
    return this;
};
jCanvaScript.Proto.Canvas.prototype.pause = function() {
    cancelRequestAnimFrame(this.interval);
    this.interval = 0;
};
jCanvaScript.Proto.Canvas.prototype.del = function() {
    cancelRequestAnimFrame(this.interval);
    this.layers = [];
    canvases.splice(this.optns.number, 1);
    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i],
            layers = canvas.layers,
            limitL = layers.length;
        canvas.optns.number = i;
        for (var j = 0; j < limitL; j++) {
            var layer = layers[j];
            layer.optns.canvas.number = i;
            setLayerAndCanvasToArray(layer.objs, layer.optns.id, layer.optns.number, canvas.optns.id, canvas.optns.number);
            setLayerAndCanvasToArray(layer.grdntsnptrns, layer.optns.id, layer.optns.number, canvas.optns.id, canvas.optns.number);
        }
    }
    if (this.cnv.parentNode)this.cnv.parentNode.removeChild(this.cnv);
    jCanvaScript._lastCanvas = 0;
    return false;
};
jCanvaScript.Proto.Canvas.prototype.clear = function() {
    cancelRequestAnimFrame(this.interval);
    this.interval = 0;
    this.layers = [];
    jCanvaScript.layer(this.optns.id + 'Layer_0').canvas(this.optns.id);
    this.optns.ctx.clearRect(0, 0, this.optns.width, this.optns.height);
    this.optns.redraw++;
    return this;
};
jCanvaScript.Proto.Canvas.prototype.frame = function(time) {
    var optns = this.optns,thisCanvas = this;
    time = time || (new Date());
    optns.timeDiff = time - optns.timeLast;
    optns.timeLast = time;
    if (this.interval) {
        this.interval = requestAnimFrame(function(time) {
            thisCanvas.frame(time);
        }, thisCanvas.cnv);
        this.interval = this.interval || 1;
    }
    if (!optns.redraw)return this;
    optns.redraw--;
    optns.ctx.clearRect(0, 0, optns.width, optns.height);
    if (this.layers.length == 0)return this;
    limit = this.layers.length;
    if (optns.anyLayerLevelChanged)
        limit = levelChanger(this.layers);
    if (optns.anyLayerDeleted)
        limit = objDeleter(this.layers);
    if (optns.anyLayerLevelChanged || optns.anyLayerDeleted) {
        optns.anyLayerLevelChanged = optns.anyLayerDeleted = false;
        for (var i = 0; i < limit; i++) {
            var layer = this.layers[i],layerOptns = layer.optns;
            setLayerAndCanvasToArray(layer.objs, layerOptns.id, layerOptns.number, this.optns.id, this.optns.number);
            setLayerAndCanvasToArray(layer.grdntsnptrns, layerOptns.id, layerOptns.number, idCanvas, this.optns.number);
        }
    }
    for (i = 0; i < limit; i++) {
        var object = this.layers[i];
        if (typeof (object.draw) == 'function')
            if (object.beforeDraw(optns)) {
                if (typeof (object.draw) == 'function') {
                    object.draw(optns);
                    object.afterDraw(optns);
                }
            }
    }
    var mm = optns.mousemove;
    var mouseDown = optns.mousedown;
    var mouseUp = optns.mouseup;
    var click = this.optns.click;
    var dblClick = this.optns.dblclick;
    if (mm.x != false) {
        if (optns.drag.object != false) {
            var drag = optns.drag,
                dobject = drag.object;
            dobject.translate(mm.x - drag.x, mm.y - drag.y);
            drag.x = mm.x;
            drag.y = mm.y;
            if (drag.drag)drag.drag.call(dobject, {x:mm.x,y:mm.y});
        }
        var point = this.optns.point || {};
        point.event = mm.event;
        if (mm.object != false) {
            var mousemoveObject = mm.object;
            if (underMouse === mousemoveObject) {
                if (typeof mousemoveObject.onmousemove == 'function')
                    mousemoveObject.onmousemove(point);
            }
            else {
                if (underMouse != false)
                    if (typeof underMouse.onmouseout == 'function')
                        underMouse.onmouseout(point);
                if (typeof mousemoveObject.onmouseover == 'function')
                    mousemoveObject.onmouseover(point);
                underMouse = mousemoveObject;
            }
        }
        else {
            if (underMouse !== false) {
                if (typeof underMouse.onmouseout == 'function') {
                    underMouse.onmouseout(point);
                }
                underMouse = false;
            }
        }
        optns.mousemove.object = false;
    }
    if (mouseDown.objects.length) {
        mdCycle:
            for (i = mouseDown.objects.length - 1; i > -1; i--) {
                var mouseDownObjects = [mouseDown.objects[i],mouseDown.objects[i].layer()], mdObject;
                for (var j = 0; j < 2; j++) {
                    mdObject = mouseDownObjects[j];
                    if (mdObject.optns.drag.val && !mdObject.optns.drag.disabled) {
                        drag = optns.drag;
                        dobject = drag.object = mdObject.optns.drag.object.visible(true);
                        drag.drag = mdObject.optns.drag.drag;
                        drag.init = mdObject;
                        var initoptns = drag.init.optns;
                        if (initoptns.drag.params !== undefined)dobject.animate(initoptns.drag.params);
                        drag.x = drag.startX = mouseDown.x;
                        drag.y = drag.startY = mouseDown.y;
                        if (dobject != drag.init && initoptns.drag.type != 'clone') {
                            point = transformPoint(mouseDown.x, mouseDown.y, dobject.matrix());
                            dobject.translate(point.x - dobject._x, point.y - dobject._y);
                        }
                        dobject.translate(initoptns.drag.shiftX, initoptns.drag.shiftY);
                        if (typeof initoptns.drag.start == 'function')
                            initoptns.drag.start.call(dobject, {x:mouseDown.x,y:mouseDown.y});
                    }
                    if (typeof mdObject.onmousedown == 'function')
                        if (mdObject.onmousedown({x:mouseDown.x,y:mouseDown.y,event:mouseDown.event}) === false)
                            break mdCycle;
                }
            }
        mouseDown.objects = [];
    }
    if (mouseUp.objects.length) {
        muCycle:
            for (i = mouseUp.objects.length - 1; i > -1; i--) {
                var mouseUpObjects = [mouseUp.objects[i],mouseUp.objects[i].layer()],muObject;
                drag = optns.drag;
                for (j = 0; j < 2; j++) {
                    muObject = mouseUpObjects[j];
                    if (optns.drag.init !== undefined) {
                        if (muObject.optns.drop.val) {

                            if (drag.init == drag.object)
                                drag.init.visible(true);
                            if (typeof muObject.optns.drop.fn == 'function')
                                muObject.optns.drop.fn.call(muObject, drag.init);
                        }
                        else {
                            drag.object.visible(false);
                            drag.init.visible(true);
                            drag.init.optns.translateMatrix[0][2] = drag.object.optns.translateMatrix[0][2];
                            drag.init.optns.translateMatrix[1][2] = drag.object.optns.translateMatrix[1][2];
                            changeMatrix(drag.init);
                            if (drag.object != drag.init)drag.object.visible(false);
                            if (typeof drag.init.optns.drag.stop == 'function')
                                drag.init.optns.drag.stop.call(drag.init, {x:mouseUp.x,y:mouseUp.y});
                        }
                        if (drag.x != drag.startX || drag.y !== drag.startY)click.objects = [];
                    }
                    if (typeof muObject.onmouseup == 'function')
                        if (muObject.onmouseup({x:mouseUp.x,y:mouseUp.y,event:mouseUp.event}) === false)
                            break muCycle;
                }
            }
        this.optns.drag = {object:false,x:0,y:0};
        mouseUp.objects = [];
    }
    if (click.objects.length) {
        cCycle:
            for (i = click.objects.length - 1; i > -1; i--) {
                var mouseClickObjects = [click.objects[i],click.objects[i].layer()];
                for (j = 0; j < 2; j++) {
                    if (typeof mouseClickObjects[j].onclick == 'function')
                        if (mouseClickObjects[j].onclick({x:click.x,y:click.y,event:click.event}) === false)
                            break cCycle;
                }
            }
        click.objects = [];
    }
    if (dblClick.objects.length) {
        dcCycle:
            for (i = dblClick.objects.length - 1; i > -1; i--) {
                var mouseDblClickObjects = [dblClick.objects[i],dblClick.objects[i].layer()];
                for (j = 0; j < 2; j++) {
                    if (typeof mouseDblClickObjects[j].ondblclick == 'function')
                        if (mouseDblClickObjects[j].ondblclick({x:dblClick.x,y:dblClick.y, event:dblClick.event}) === false)
                            break dcCycle;
                }
            }
        dblClick.objects = [];
    }
    optns.keyup.code = optns.keydown.code = optns.keypress.code = click.x = dblClick.x = mouseUp.x = mouseDown.x = mm.x = false;
    return this;
};
jCanvaScript.canvas = function(idCanvas) {
    if (idCanvas === undefined)return canvases[0];
    var limit = canvases.length;
    for (var i = 0; i < limit; i++)
        if (canvases[i].optns)
            if (canvases[i].optns.id == idCanvas)return canvases[i];
    return new jCanvaScript.Proto.Canvas(idCanvas);
};