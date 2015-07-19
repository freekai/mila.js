/*global XMLHttpRequest:false, window:false, document:false, console:false, Matrix:false */
(function () {
    "use strict";

    var ts,
        output;

    function normalizeFeature(X) {
        var mean = X.mean(),
            stddev = X.std();

        X.sub(mean).div(stddev);

    }

    function Deferred() {
    }

    Deferred.prototype = {
        _next: undefined,
        then: function (next) {
            this._next = next;
        },
        done: function () {
            if (this._next) {
                return this._next();
            }
        }
    };

    function getData(url, callback) {
        var req = new XMLHttpRequest();
        req.overrideMimeType("application/json; charset=utf-8");
        req.onload = function () {
            var json,
                te,
                data;

            if (this.response instanceof Object) {
                data = this.response;
            } else {
                console.error("Incorrect data format: " + this.response);
                return;
            }

            te = new Date().getTime();
            output.innerHTML += " done (in " + (te - ts) + " ms)\n";

            callback(data);
        };
        req.open("GET", url, true);
        req.responseType = "json";
        req.send();
    }

    function doGD(X, y, theta, alpha, iter) {
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

    function linearRegressionMultiVar() {
        var deferred = new Deferred();

        output.innerHTML += "\n\nRunning linear regression for multiple var\n\n";
        output.innerHTML += "Fetching data ...";
        ts = new Date().getTime();

        getData('./data-mv.json', function (data) {
            var M = new Matrix(data),
                Xt = M.range([0, 0], [M.m, M.n - 1]),
                X = new Matrix(M.m, Xt.n + 1),
                Y = M.col(M.n - 1),
                theta = new Matrix(1, X.n),
                alpha = 0.01,
                iter = 400,
                i,
                j;

            output.innerHTML += "Running gradient descent over " + X.m + " samples (" + Xt.n +
                " feature" + (Xt.n === 1 ? "" : "s") + ").\n";
            output.innerHTML += "Learning rate: " + alpha + "\n";
            output.innerHTML += "Iterations: " + iter + "\n";

            // FIXME: no matrix composition, copy manually
            for (i = 0; i < X.m; i++) {
                X.$(i, 0, 1.0);
                for (j = 0; j < Xt.n; j++) {
                    X.$(i, j + 1, Xt.$(i, j));
                }
            }

            for (j = 1; j < X.n; j++) {
                normalizeFeature(X.col(j));
            }

            try {
                theta = doGD(X, Y, theta, alpha, iter);
            } catch (e) {
                console.log("Error", e);
            }

            output.innerHTML += "Computed theta: " + theta;
            deferred.done();
        });

        return deferred;
    }

    function linearRegression() {
        var deferred = new Deferred();

        output.innerHTML += "\n\nRunning linear regression for single var\n\n";
        output.innerHTML += "Fetching data ...";
        ts = new Date().getTime();

        getData("./data.json", function (data) {
            var M = new Matrix(data),
                Xt = M.col(0),
                X = new Matrix(M.m, Xt.n + 1),
                Y = M.col(1),
                theta = new Matrix(1, X.n),
                alpha = 0.01,
                iter = 1500,
                i,
                j;

            output.innerHTML += "Running gradient descent over " + X.m + " samples (" + Xt.n +
                " feature" + (Xt.n === 1 ? "" : "s") + ").\n";
            output.innerHTML += "Learning rate: " + alpha + "\n";
            output.innerHTML += "Iterations: " + iter + "\n";

            // FIXME: no matrix composition, copy manually
            for (i = 0; i < X.m; i++) {
                X.$(i, 0, 1.0);
                for (j = 0; j < Xt.n; j++) {
                    X.$(i, j + 1, Xt.$(i, j));
                }
            }

            try {
                theta = doGD(X, Y, theta, alpha, iter);
            } catch (e) {
                console.log("Error", e);
            }
            output.innerHTML += "Computed theta: " + theta;

            deferred.done();

        });

        return deferred;
    }

    window.addEventListener("load", function () {
        output = document.getElementById("output");

        linearRegression()
            .then(linearRegressionMultiVar);

    });

}());
