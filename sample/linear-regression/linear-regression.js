/*eslint indent: [ "error", 4, { "outerIIFEBody": 0 }]*/
/*global XMLHttpRequest:false, window:false, document:false, console:false, Matrix:false, Promise: false */
(function () {
"use strict";

var ts;

function addPre(id) {
    return function () {
        var result = document.createElement("pre");
        result.setAttribute("id", id);
        document.body.appendChild(result);
        return Promise.resolve(result);
    };
}

function normalizeFeature(X) {
    var mean = X.mean(),
        stddev = X.std();

    X.sub(mean).div(stddev);

}

function getData(url, output) {
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
            output.innerHTML += " done (in " + (te - ts) + " ms)\n";

            resolve(data);
        };
        req.open("GET", url, true);
        req.responseType = "json";
        req.send();
    });
}

function doGD(X, y, theta, alpha, iter, output) {
    var te,
        m = X.m,
        delta,
        inc,
        i,
        j;
    ts = new Date().getTime();

    for (i = 0; i < iter; i++) {
        delta = new Matrix(1, X.n);
        for (j = 0; j < m; j++) {
            inc = y.$(j, 0) - theta.x(X.row(j).tr()).$(0, 0);
            inc = X.row(j).clone().x(inc);
            delta.add(inc);
        }
        theta.add(delta.x(alpha).div(m));
    }

    te = new Date().getTime();
    output.innerHTML += "Gradient descent completed in " + (te - ts) + " ms.\n";
    return theta;
}

function linearRegressionMultiVar(output) {

    output.innerHTML += "\n\nRunning linear regression for multiple var\n\n";
    output.innerHTML += "Fetching data ...";
    ts = new Date().getTime();

    return getData("./data-mv.json", output)
        .then(function (data) {
            var M = new Matrix(data),
                Xt = M.range([0, 0], [M.m, M.n - 1]),
                X = Matrix.join(Matrix.ones(M.m, 1), Xt),
                Y = M.col(M.n - 1),
                theta = new Matrix(1, X.n),
                alpha = 0.01,
                iter = 400,
                j;

            output.innerHTML += "Running gradient descent over " + X.m + " samples (" + Xt.n +
                " feature" + (Xt.n === 1 ? "" : "s") + ").\n";
            output.innerHTML += "Learning rate: " + alpha + "\n";
            output.innerHTML += "Iterations: " + iter + "\n";

            for (j = 1; j < X.n; j++) {
                normalizeFeature(X.col(j));
            }

            theta = doGD(X, Y, theta, alpha, iter, output);

            output.innerHTML += "Computed theta: " + theta;
        });
}

function linearRegression(output) {

    output.innerHTML += "\n\nRunning linear regression for single var\n\n";
    output.innerHTML += "Fetching data ...";
    ts = new Date().getTime();

    return getData("./data.json", output)
        .then(function (data) {
            var M = new Matrix(data),
                Xt = M.col(0),
                X = Matrix.join(Matrix.ones(M.m, 1), Xt),
                Y = M.col(1),
                theta = new Matrix(1, X.n),
                alpha = 0.01,
                iter = 1500;

            output.innerHTML += "Running gradient descent over " + X.m + " samples (" + Xt.n +
                " feature" + (Xt.n === 1 ? "" : "s") + ").\n";
            output.innerHTML += "Learning rate: " + alpha + "\n";
            output.innerHTML += "Iterations: " + iter + "\n";

            theta = doGD(X, Y, theta, alpha, iter, output);

            output.innerHTML += "Computed theta: " + theta;
        });
}

window.addEventListener("load", function () {
    addPre("singleVar")()
        .then(linearRegression)
        .then(addPre("multiVar"))
        .then(linearRegressionMultiVar);
});

}());
