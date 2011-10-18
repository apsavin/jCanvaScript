/*
 * @function jCanvaScript.pattern
 * @type {jCanvaScript.pattern}
 * @param {Image} image
 * @param {String} [type]
 */
jCanvaScript.Proto.Pattern = function(image, type) {
    var options = image;
    if (options.src)
        options = {image: image, type: type};
    options = jCanvaScript.checkDefaults(options, {type: 'repeat'});
    jCanvaScript.Proto.GradientsAndPatterns.call(this);
    this._img = options.image;
    this._type = options.type;
    this._proto = 'pattern';
    return this;
};
jCanvaScript.inherite(jCanvaScript.Proto.Pattern, jCanvaScript.Proto.GradientsAndPatterns);
/*@private*/
jCanvaScript.Proto.Pattern.prototype.draw = function(canvasOptions) {
    if (this.optns.animated) jCanvaScript._helpers.animating.call(this, canvasOptions);
    this.val = canvasOptions.ctx.createPattern(this._img, this._type);
};

jCanvaScript.pattern = function(image, type) {
    return new jCanvaScript.Proto.Pattern(image, type);
}