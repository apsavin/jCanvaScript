jCanvaScript.imageDataFilters = {
    color:{
        fn: function(width, height, matrix, type) {
            var old,i,j;
            matrix = matrix[type];
            for (i = 0; i < width; i++)
                for (j = 0; j < height; j++) {
                    old = this.getPixel(i, j);
                    old[matrix[0]] = old[matrix[0]] * 2 - old[matrix[1]] - old[matrix[2]];
                    old[matrix[1]] = 0;
                    old[matrix[2]] = 0;
                    old[matrix[0]] = old[matrix[0]] > 255 ? 255 : old[matrix[0]];
                    this.setPixel(i, j, old);
                }
        },
        matrix:
        {
            red:[0,1,2],
            green:[1,0,2],
            blue:[2,0,1]
        }
    },
    linear:{
        fn:function(width, height, matrix, type) {
            var newMatrix = [],old,i,j,k,m,n;
            matrix = matrix[type];
            m = matrix.length;
            n = matrix[0].length;
            for (i = 0; i < width; i++) {
                newMatrix[i] = [];
                for (j = 0; j < height; j++) {
                    newMatrix[i][j] = [0,0,0,1];
                    for (m = 0; m < 3; m++)
                        for (n = 0; n < 3; n++) {
                            old = this.getPixel(i - parseInt(m / 2), j - parseInt(n / 2));
                            for (k = 0; k < 3; k++) {
                                newMatrix[i][j][k] += old[k] * matrix[m][n];
                            }
                        }
                }
            }
            for (i = 0; i < width; i++) {
                for (j = 0; j < height; j++)
                    this.setPixel(i, j, newMatrix[i][j]);
            }
        },
        matrix:{
            sharp:[
                [-0.375,-0.375,-0.375],
                [-0.375,4,-0.375],
                [-0.375,-0.375,-0.375]
            ],
            blur:[
                [0.111,0.111,0.111],
                [0.111,0.111,0.111],
                [0.111,0.111,0.111]
            ]
        }
    }
};

jCanvaScript.addImageDataFilter = function(name, properties) {
    if (jCanvaScript.imageDataFilters[name] === undefined)jCanvaScript.imageDataFilters[name] = {};
    if (properties.fn !== undefined)jCanvaScript.imageDataFilters[name].fn = properties.fn;
    if (properties.matrix !== undefined && properties.type === undefined)jCanvaScript.imageDataFilters[name].matrix = properties.matrix;
    if (properties.type !== undefined)jCanvaScript.imageDataFilters[name].matrix[type] = properties.matrix;
    return jCanvaScript;
};