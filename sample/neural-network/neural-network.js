/*global Matrix: false */
(function () {
    /* initialization */
    function initTheta(outLayerSize, inLayerSize) {
        var epsilon = 0.12;
        return Matrix.rand(outLayerSize, inLayerSize+1).x(2*epsilon).sub(epsilon);
    }
}());
