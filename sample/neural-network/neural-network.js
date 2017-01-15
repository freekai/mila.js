/*eslint indent: [ "error", 4, { "outerIIFEBody": 0 }]*/
/*eslint-env browser*/
/*global Matrix: false */
(function () {

var ts;

/* initialization */
function initTheta(outLayerSize, inLayerSize) {
    var epsilon = 0.12;
    return Matrix.rand(outLayerSize, inLayerSize+1).x(2*epsilon).sub(epsilon);
}

function getData(url) {
    return new Promise(function (resolve, reject) { // eslint-disable-line no-unused-vars
        var req = new XMLHttpRequest();
        req.overrideMimeType("application/json; charset=utf-8");
        req.onload = function () {
            var te,
                data;

            if (this.response instanceof Object) {
                data = this.response;
            } else {
                throw new Error("Incorrect data format: " + this.response);
            }

            te = new Date().getTime();

            resolve(data);
        };
        req.open("GET", url, true);
        req.responseType = "json";
        req.send();
    });
}

window.addEventListener("load", function () {
    var te;
    ts = (new Date()).getTime();

    getData('./data-samples.json')
        .then(function (data) {
            var i = 0;
            te = (new Date).getTime();
            function drawNext() {
                if (i === data.length) return;
                drawData(data[i]);
                i++;
                setTimeout(function () {
                    drawNext();
                }, 50);
            }
            drawNext();
        });

});

}());
