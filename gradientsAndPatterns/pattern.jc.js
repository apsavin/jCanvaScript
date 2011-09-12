/*
 * @function jCanvaScript.pattern
 * @type {jCanvaScript.pattern}
 * @param {Image} image
 * @param {String} [type]
 */
jCanvaScript.pattern=jCanvaScript.addObject('pattern',
/*
 * @class jCanvaScript.pattern
 * @extends jCanvaScript.gradientsAndPatterns
 * @requires jCanvaScript.gradientsAndPatterns
 */
function() {
    /*@constructs*/
    this.base = function(image, type) {
        var options = image;
        if (options.src)
            options = {image: image, type: type};
        options = jCanvaScript.checkDefaults(options, {type: 'repeat'});
        this.protobase();
        this._img = options.image;
        this._type = options.type;
        return this;
    };
    /*@private*/
    this.create = function(canvasOptions) {
        if (this.optns.animated) jCanvaScript.animating.call(this, canvasOptions);
        this.val = canvasOptions.ctx.createPattern(this._img, this._type);
    };

    this._proto = 'pattern';
}, 'grdntsnptrn');