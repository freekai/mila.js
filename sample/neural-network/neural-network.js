/*eslint indent: [ "error", 4, { "outerIIFEBody": 0 }]*/
/*eslint-env browser*/
/*global Matrix: false, drawData: false */
(function () {

var ts;

/* initialization */
function initTheta(outLayerSize, inLayerSize) {
    var epsilon = 0.12;
    return Matrix.rand(outLayerSize, inLayerSize).x(2*epsilon).sub(epsilon);
}

/* sigmoid function */
function sgmd(z) {
    function _sgmd(y) {
        return 1.0 / (1. + Math.exp(y*-1));
    }
    if (z instanceof Matrix) {
        z.each(_sgmd);
        return z;
    } else if (typeof z === "number") {
        return _sgmd(z);
    } else {
        throw new Error("The argument is not a matrix nor a number.");
    }
}

function nnCF(theta, inputLayerSize, hiddenLayerSize, outputLayerSize, input, output, lambda) {
}

function makeCF(inputLayerSize, hiddenLayerSize, outputLayerSize, input, output, lambda) {
    return function (t) {
        return nnCF(t, inputLayerSize, hiddenLayerSize, outputLayerSize, input, output, lambda);
    }
}

function fmincg(cf, start, options) {
}

/* back propagation */
function doBackProp() {
    var solution,
        cf;
    /* FIXME: make nn arch configurable */
    /* nn arch:
     * input: 400 (20x20 images)
     * hidden: 25
     * output: 10 (digits, 0 to 9)
     */
    /* initial point, random close to zero */
    var t1 = initTheta(25, 400),
        t2 = initTheta(10, 25);

    cf = makeCF([t1, t2]);

    /* minimize */
    fmincg(

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
                reject("Incorrect data format: " + this.response);
                return;
            }

            te = new Date().getTime() - ts;

            console.log("Elapsed time: " + (te/1000) + "s");

            resolve(data);
        };
        req.open("GET", url, true);
        req.responseType = "json";
        req.send();
    });
}

window.addEventListener("load", function () {
    ts = (new Date()).getTime();

    getData("./data-samples.json")
        .then(function (data) {
            var i = 0;
            function rotate(d, dim) {
                var k, l, v,
                    i1, i2,
                    result;
                if (d.length !== dim*dim) {
                    throw new Error("Wrong dimension size or unrolled array size.");
                }
                result = new Array(400);
                for (k=0; k < dim; k++) {
                    for (l=0; l < dim; l++) {
                        result[l+k*dim] = d[k+dim*l];
                    }
                }
                return result;
            }
            for (; i < data.length; i++) {
                data[i] = rotate(data[i], 20);
            }
            return data;
        })
        .then(function (data) {
            var i = 0;
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
