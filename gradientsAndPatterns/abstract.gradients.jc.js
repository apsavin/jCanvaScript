/*
 * @function
 * @type {jCanvaScript.gradients}
 */
jCanvaScript.gradients=jCanvaScript.addObject('gradients',
/*
 * @class jCanvaScript.gradients
 * @extends jCanvaScript.gradientsAndPatterns
 * @requires jCanvaScript.gradientsAndPatterns
 */
function() {
    this.base = function(colors) {
        this.protobase();
        if (colors == undefined)
            return this;
        else
            return this.colorStops(colors);
    };

    /*@private*/
    this.colorStopsCount = 0;

    /*@private*/
    this.paramNames = ['_pos','_colorR','_colorG','_colorB','_alpha'];

    /*
     * @param {Number} pos
     * @param {String} color
     * */
    this.addColorStop = function(pos, color) {
        this.redraw();
        var colorKeeper = parseColor(color);
        var i = this.colorStopsCount;
        this['_pos' + i] = pos;
        this['_colorR' + i] = colorKeeper.r;
        this['_colorG' + i] = colorKeeper.g;
        this['_colorB' + i] = colorKeeper.b;
        this['_alpha' + i] = colorKeeper.a;
        this.colorStopsCount++;
        return this;
    };

    /*
     * @param {Object} parameters
     * @param {Number} duration
     * @param {Object} easing
     * @param {Object} onstep
     * @param {Function} fn
     * */
    this.animate = function(parameters, duration, easing, onstep, fn) {
        for (var key in parameters) {
            if (key.substr(0, 5) == 'color') {
                var i = key.substring(5);
                var colorKeeper = parseColor(parameters[key]);
                parameters['colorR' + i] = colorKeeper.r;
                parameters['colorG' + i] = colorKeeper.g;
                parameters['colorB' + i] = colorKeeper.b;
                parameters['alpha' + i] = colorKeeper.a;
            }
        }
        this.proto().animate.call(this, parameters, duration, easing, onstep, fn);
    };

    /*
     * @param {Number} i
     * */
    this.delColorStop = function(i) {
        this.redraw();
        var colorStops = this.colorStops();
        colorStops.splice(i, 1);
        if (colorStops.length > 0)this.colorStops(colorStops);
        else this.colorStopsCount = 0;
        return this;
    };

    /*
     * @private*/
    this._createColorStops = function() {
        for (var i = 0; i < this.colorStopsCount; i++) {
            this.val.addColorStop(this['_pos' + i], 'rgba(' + parseInt(this['_colorR' + i]) + ',' + parseInt(this['_colorG' + i]) + ',' + parseInt(this['_colorB' + i]) + ',' + this['_colorA' + i] + ')');
        }
    };

    /*
     * @param {Array} array
     * */
    this.colorStops = function(array) {
        var names = this.paramNames;
        if (array === undefined) {
            array = [];
            for (var j = 0; j < this.colorStopsCount; j++) {
                array[j] = [];
                for (var i = 0; i < names.length; i++)
                    array[j][i] = this[names[i] + j];
            }
            return array;
        }
        this.redraw();
        var oldCount = this.colorStopsCount;
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
        this.colorStopsCount = limit;
        return this;
    }
}, 'grdntsnptrn');