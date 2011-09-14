jCanvaScript.Matrix = {
    multiplyMatrixAndMatrix: function(m1, m2)
    {
        return [
            [(m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0]), (m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1]), (m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2])],
            [(m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0]), (m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1]), (m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2])]
        ];
    },
    multiplyMatrix: function(){
        var result = arguments[0];
        for(var i = 1; i< arguments.length; i++){
            result = this.multiplyMatrixAndMatrix(result, arguments[i]);
        }
        return result;
    },
    multiplyPointMatrix: function(x, y, matrix)
    {
        return {
            x: (x * matrix[0][0] + y * matrix[0][1] + matrix[0][2]),
            y: (x * matrix[1][0] + y * matrix[1][1] + matrix[1][2])
        }
    },
    transformPoint: function(x, y, matrix)
    {
        return{
            x: (x * matrix[1][1] - y * matrix[0][1] + matrix[0][1] * matrix[1][2] - matrix[1][1] * matrix[0][2]) / (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]),
            y: (y * matrix[0][0] - x * matrix[1][0] - matrix[0][0] * matrix[1][2] + matrix[1][0] * matrix[0][2]) / (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1])
        }
    }
}