jCanvaScript.addFunction = function(name, fn, prototype) {
    proto[prototype || 'object'].prototype[name] = fn;
    return this;
};
jCanvaScript.addObject = function(parameters) {
 /*   var parent = parameters.parent || 'shape',
        name = parameters.name,
        protoObject = parameters.proto,
        abstraction = parameters.abstraction;

    proto[name] = function(){};
    if (typeof parent !== 'object'){
        proto[name].prototype = Object.create(proto[parent].prototype);
        proto[name].proto = parent;
    }
    else{
        for(var key in parent)
        {
            if(!parent.hasOwnProperty(key))continue;
            proto[name].prototype[key]=proto[key].prototype[parent[key]];
        }
    }
    for(var key in protoObject){
        if(!protoObject.hasOwnProperty(key))continue;
        proto[name].prototype[key]=protoObject[key];
    }
    proto[name].prototype._proto = name;
    if (!abstraction) {
        (function(name) {
            jCanvaScript[name] = function() {
                var object = Object.create(proto[name].prototype);
                return object.base.apply(object, arguments);
            }
        })(name);
    }
    return jCanvaScript[name];*/
};
jCanvaScript.addAnimateFunction = function(name, fn) {
    animateFunctions[name] = fn;
    return this;
};
jCanvaScript.addImageDataFilter = function(name, properties) {
    if (imageDataFilters[name] === undefined)imageDataFilters[name] = {};
    if (properties.fn !== undefined)imageDataFilters[name].fn = properties.fn;
    if (properties.matrix !== undefined && properties.type === undefined)imageDataFilters[name].matrix = properties.matrix;
    if (properties.type !== undefined)imageDataFilters[name].matrix[type] = properties.matrix;
    return jCanvaScript;
};
jCanvaScript.getProto = function(name) {
    return proto[name].prototype;
};
jCanvaScript.getProtoConstructor = function(name) {
    return proto[name];
};
jCanvaScript.getCenter = getCenter;
jCanvaScript.getRect = getRect;
jCanvaScript.checkDefaults = checkDefaults;
jCanvaScript.parseColor = parseColor;
jCanvaScript.imageDataFilters = imageDataFilters;
jCanvaScript.multiplyPointM = multiplyPointM;
jCanvaScript.multiplyM = multiplyM;
jCanvaScript.canvases = canvases;
jCanvaScript.animating = animating;
jCanvaScript._lastCanvas = 0;
jCanvaScript.objectCanvas = canvas;
jCanvaScript.objectLayer = layer;
jCanvaScript.constants = {
    PIx2: Math.PI * 2,
    radian: 180 / Math.PI,
    regNumsWithMeasure: /\d.\w\w/
};
jCanvaScript.clear = function(idCanvas) {
    if (canvases[0] === undefined)return jCanvaScript;
    if (idCanvas === undefined) {
        canvases[0].clear();
        return jCanvaScript;
    }
    jCanvaScript.canvas(idCanvas).clear();
    return jCanvaScript;
};
jCanvaScript.pause = function(idCanvas) {
    if (idCanvas === undefined) {
        canvases[0].pause();
        return jCanvaScript;
    }
    jCanvaScript.canvas(idCanvas).pause();
    return jCanvaScript;
};
jCanvaScript.start = function(idCanvas, isAnimated) {
    jCanvaScript.canvas(idCanvas).start(isAnimated);
    return jCanvaScript;
};