/*
 * @function
 * @type {jCanvaScript.gradientsAndPatterns}
 */
jCanvaScript.gradientsAndPatterns=jCanvaScript.addObject('grdntsnptrn',
/*
 * @class jCanvaScript.gradientsAndPatterns
 */
function() {
    /*@constructs*/
    this.base = function() {
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
        var grdntsnptrnsArray = jCanvaScript.canvases[jCanvaScript._lastCanvas].layers[0].grdntsnptrns;
        this._level = grdntsnptrnsArray.length;
        grdntsnptrnsArray[this._level] = this;
        this.redraw();
    };
    /*
     * @param {String} idLayer
     */
    this.layer = function(idLayer) {
        return jCanvaScript.objectlayer(idLayer, this, 'grdntsnptrns');
    };
    /*
     * @param {String} idCanvas
     */
    this.canvas = function(idCanvas) {
        return jCanvaScript.objectCanvas(idCanvas, this, 'grdntsnptrns');
    };

    var protoObject = jCanvaScript.getProtoConstructor('object');
    var tmpObj = new protoObject;
    this.animate = tmpObj.animate;
    this.attr = tmpObj.attr;
    this.id = tmpObj.id;
    this.name = tmpObj.name;
    this.level = tmpObj.level;
    this.proto = tmpObj.proto;
    this.protobase = tmpObj.protobase;
    this.redraw = tmpObj.redraw;
    return this;
}, null);