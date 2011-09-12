/*
 * @function
 * @type {jCanvaScript.gradientsAndPatterns}
 */
jCanvaScript.Proto.GradientsAndPatterns = function() {
    this.animateQueue = [];
    this.optns = {
        animated: false,
        name: "",
        layer: {id: jCanvaScript.canvases[0].optns.id + 'Layer_0', number: 0},
        canvas: {number: 0},
        visible: true
    };
    this.optns.layer.id = jCanvaScript.canvases[jCanvaScript._lastCanvas].optns.id + 'Layer_0';
    this.optns.layer.number = 0;
    this.optns.canvas.number = jCanvaScript._lastCanvas;
    var gradientsAndPatternsArray = jCanvaScript.canvases[jCanvaScript._lastCanvas].layers[0].grdntsnptrns;
    this._level = gradientsAndPatternsArray.length;
    gradientsAndPatternsArray[this._level] = this;
    this.redraw();
};
/*
 * @param {String} idLayer
 */
jCanvaScript.Proto.GradientsAndPatterns.prototype.layer = function(idLayer) {
    return jCanvaScript.objectlayer(idLayer, this, 'grdntsnptrns');
};
/*
 * @param {String} idCanvas
 */
jCanvaScript.Proto.GradientsAndPatterns.prototype.canvas = function(idCanvas) {
    return jCanvaScript.objectCanvas(idCanvas, this, 'grdntsnptrns');
};
jCanvaScript.Proto.GradientsAndPatterns.prototype.animate = jCanvaScript.Proto.Object.prototype.animate;
jCanvaScript.Proto.GradientsAndPatterns.prototype.attr = jCanvaScript.Proto.Object.prototype.attr;
jCanvaScript.Proto.GradientsAndPatterns.prototype.id = jCanvaScript.Proto.Object.prototype.id;
jCanvaScript.Proto.GradientsAndPatterns.prototype.name = jCanvaScript.Proto.Object.prototype.name;
jCanvaScript.Proto.GradientsAndPatterns.prototype.level = jCanvaScript.Proto.Object.prototype.level;
jCanvaScript.Proto.GradientsAndPatterns.prototype.proto = jCanvaScript.Proto.Object.prototype.proto;
jCanvaScript.Proto.GradientsAndPatterns.prototype.redraw = jCanvaScript.Proto.Object.prototype.redraw;