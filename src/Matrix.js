/*jslint nomen: true, plusplus: true */
/*global define, Float64Array, window */
(function () {
    "use strict";
    
    var Matrix = function (n, m) {
        var i,
            j,
            cval;
        
        if (typeof n === "undefined") {
            throw new Error("Matrix constructor requires an argument");
        } else if (typeof n === "number" && typeof m === "number") {
        // initialize empty matrix of n by m.
            this._alloc(n, m);
            return this;
        } else if (n instanceof Array && typeof m === "undefined") {
        // initialize a matrix using array of arrays
        // it is possible to initialize a matrix using an array of arrays
        // or an array (it will be row vector 1 by m)
            if (n[0] instanceof Array) {
                if (typeof n[0][0] === "number") {
        // array of arrays
                    this.n = n.length;
                    this.m = n[0].length;
                } else if (n[0][0] instanceof Array) {
                    throw new Error("Matrix can be initialized either by array" +
                                    " or array of arrays");
                } else {
                    throw new Error("Matrix values must be numbers");
                }
            } else if (typeof n[0] === "number") {
        // row vector
                this.n = 1;
                this.m = n.length;
            }
            this._alloc(this.n, this.m);
            for (i = 0; i < this.n; i++) {
                for (j = 0; j < this.m; j++) {
                    cval = (this.n === 1) ? n[j] : n[i][j];
                    if (typeof cval === "undefined") {
                        this.ir = null;
                        throw new Error("Matrix should be square");
                    }
                    if (typeof cval === "number") {
                        this.$(i, j, cval);
                    } else {
                        this.ir = null;
                        throw new Error("Matrix values must be numbers");
                    }
                }
                cval = (this.n === 1) ? n[j] : n[i][j];
                if (typeof cval !== "undefined") {
                    this.ir = null;
                    throw new Error("Matrix should be square");
                }
            }
        }
    };

    Matrix.prototype = Object.create(null);
    Matrix.prototype.constructor = Matrix;

    /**
     * Returns element at position [n, m].
     * @return {number}
     */
    Matrix.prototype.$ = function (n, m, val) {
        // FIXME: boundary checks
        var idx = n * this.m + m;
        if (typeof val === "undefined") {
            return this.ir[idx];
        } else if (typeof val === "number") {
            return (this.ir[idx] = val);
        } else {
            throw new Error("Only number assignments are allowed");
        }
    };
    
    Matrix.prototype._alloc = function (n, m) {
        if (n < 1 || m < 1) {
            throw new Error("Invalid matrix size");
        }
        if ((this.n && n && this.n !== n) ||
                (this.m && m && this.m !== m)) {
            throw new Error("Matrix size cannot be reset");
        }
        this.n = n;
        this.m = m;
        this.ir = new Float64Array(n * m);
    };
    
    Matrix.prototype.equals = function (obj) {
        var i,
            j;
        if (!(obj instanceof Matrix)) {
            throw new Error(obj + " is not comparable to a matrix");
        }
        if (this.ir.length !== obj.ir.length) {
            return false;
        }
        return this.ir.every(function (v, i) {
            return obj.ir[i] === v;
        });
    };
    
    Matrix.prototype.equalsWithPrecision = function (obj, epsilon) {
        var i,
            j;
        if (!(obj instanceof Matrix)) {
            throw new Error(obj + " is not comparable to a matrix");
        }
        if (this.ir.length !== obj.ir.length) {
            return false;
        }
        return this.ir.every(function (v, i) {
            var denom = Math.max(Math.abs(v), Math.abs(obj.ir[i]));
            return Math.abs(obj.ir[i] - v) / denom < epsilon;
        });
    };
    
    Matrix.prototype.x = function (B) {
        var i,
            j,
            k,
            tmp,
            result;
        
        if (typeof B === "undefined" || !(B instanceof Matrix)) {
            throw new Error("Only two matrices can be multiplied");
        }
        if (this.m !== B.n) {
            throw new Error("Matrices cannot be multiplied " + this.n + "x" + this.m +
                            " * " + B.n + "x" + B.m);
        }
        
        result = new Matrix(this.n, B.m);
        
        for (i = 0; i < this.n; i++) {
            for (j = 0; j < B.m; j++) {
                result.$(i, j, 0);
                for (k = 0; k < this.m; k++) {
                    result.$(i, j, result.$(i, j) + this.$(i, k) * B.$(k, j));
                }
            }
        }
                
        return result;
    };
    
    Matrix.prototype.toString = function () {
        var result,
            i,
            j,
            indent = "    ";
        
        result = "[\n";
        result += indent + "[ ";
        result += this.$(0, 0);
        for (j = 1; j < this.m; j++) {
            result += ", " + this.$(0, j);
        }
        result += " ]";
        for (i = 0; i < this.n; i++) {
            result += ",\n" + indent + "[ ";
            result += this.$(i, 0);
            for (j = 1; j < this.m; j++) {
                result += ", " + this.$(i, j);
            }
            result += " ]";
        }
        result += "\n]";
        return result;
    };
    
    window.Matrix = Matrix;
    
}());
