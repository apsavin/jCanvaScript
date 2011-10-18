jCanvaScript.Proto.Gradients = function(colors) {
    /*@private*/
    this._colorStopsCount = 0;
    /*@private*/
    this._paramNames = ['_pos','_colorR','_colorG','_colorB','_colorA'];
    jCanvaScript.Proto.GradientsAndPatterns.call(this);
    if (colors == undefined)
        return this;
    else
        return this.colorStops(colors);
};

jCanvaScript.inherite(jCanvaScript.Proto.Gradients, jCanvaScript.Proto.GradientsAndPatterns);
/*
 * @param {Number} pos
 * @param {String} color
 * */
jCanvaScript.Proto.Gradients.prototype.addColorStop = function(pos, color) {
    this.redraw();
    var colorKeeper = jCanvaScript.parseColor(color);
    var i = this._colorStopsCount;
    this['_pos' + i] = pos;
    this['_colorR' + i] = colorKeeper.r;
    this['_colorG' + i] = colorKeeper.g;
    this['_colorB' + i] = colorKeeper.b;
    this['_colorA' + i] = colorKeeper.a;
    this._colorStopsCount++;
    return this;
};

/*
 * @param {Object} parameters
 * @param {Number} duration
 * @param {Object} easing
 * @param {Object} onstep
 * @param {Function} fn
 * */
jCanvaScript.Proto.Gradients.prototype.animate = function(parameters, duration, easing, onstep, fn) {
    for (var key in parameters) {
        if (key.substr(0, 5) == 'color') {
            var i = key.substring(5);
            var colorKeeper = jCanvaScript.parseColor(parameters[key]);
            parameters['colorR' + i] = colorKeeper.r;
            parameters['colorG' + i] = colorKeeper.g;
            parameters['colorB' + i] = colorKeeper.b;
            parameters['colorA' + i] = colorKeeper.a;
        }
    }
    jCanvaScript.Proto.GradientsAndPatterns.animate.call(this, parameters, duration, easing, onstep, fn);
};

/*
 * @param {Number} i
 * */
jCanvaScript.Proto.Gradients.prototype.delColorStop = function(i) {
    this.redraw();
    var colorStops = this.colorStops();
    colorStops.splice(i, 1);
    if (colorStops.length > 0)this.colorStops(colorStops);
    else this._colorStopsCount = 0;
    return this;
};

/*
 * @private*/
jCanvaScript.Proto.Gradients.prototype._createColorStops = function() {
    for (var i = 0; i < this._colorStopsCount; i++) {
        this.val.addColorStop(this['_pos' + i], 'rgba(' + parseInt(this['_colorR' + i]) + ',' + parseInt(this['_colorG' + i]) + ',' + parseInt(this['_colorB' + i]) + ',' + this['_colorA' + i] + ')');
    }
};

/*
 * @param {Array} array
 * */
jCanvaScript.Proto.Gradients.prototype.colorStops = function(array) {
    var names = this._paramNames;
    if (array === undefined) {
        array = [];
        for (var j = 0; j < this._colorStopsCount; j++) {
            array[j] = [];
            for (var i = 0; i < names.length; i++)
                array[j][i] = this[names[i] + j];
        }
        return array;
    }
    this.redraw();
    var oldCount = this._colorStopsCount;
    var limit = array.length;
    if (array[0].length == 2)
        for (j = 0; j < limit; j++)
            this.addColorStop(array[j][0], array[j][1]);
    else
        for (j = 0; j < limit; j++)
            for (i = 0; i < names.length; i++)
                this[names[i] + j] = array[j][i];
    for (j = limit; j < oldCount; j++)
        for (i = 0; i < names.length; i++)
            this[names[i] + j] = undefined;
    this._colorStopsCount = limit;
    return this;
}