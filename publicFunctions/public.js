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