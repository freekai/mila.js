/*jslint nomen: true, plusplus: true */
/*global define, Float64Array, window */
(function () {
    "use strict";
    
    var Matrix = function (m, n) {
        var i,
            j,
            cval;
        
        if (typeof m === "undefined") {
            throw new Error("Matrix constructor requires an argument");
        } else if (typeof m === "number" && typeof n === "number") {
        // initialize empty matrix of m by n.
            this._alloc(m, n);
            return this;
        } else if (m instanceof Array && typeof n === "undefined") {
        // initialize a matrix using array of arrays
        // it is possible to initialize a matrix using an array of arrays
        // or an array (it will be row vector 1 by n)
            if (m[0] instanceof Array) {
                if (typeof m[0][0] === "number") {
        // array of arrays
                    this.m = m.length;
                    this.n = m[0].length;
                } else if (m[0][0] instanceof Array) {
                    throw new Error("Matrix can be initialized either by array" +
                                    " or array of arrays");
                } else {
                    throw new Error("Matrix values must be numbers");
                }
            } else if (typeof m[0] === "number") {
        // row vector
                this.m = 1;
                this.n = m.length;
            }
            this._alloc(this.m, this.n);
            for (i = 0; i < this.m; i++) {
                for (j = 0; j < this.n; j++) {
                    cval = (this.m === 1) ? m[j] : m[i][j];
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
                cval = (this.m === 1) ? m[j] : m[i][j];
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
     * Returns element at position [m, n].
     * @return {number}
     */
    Matrix.prototype.$ = function (m, n, val) {
        // FIXME: boundary checks
        var idx = m * this.n + n;
        if (typeof val === "undefined") {
            return this.ir[idx];
        } else if (typeof val === "number") {
            return (this.ir[idx] = val);
        } else {
            throw new Error("Only number assignments are allowed");
        }
    };
    
    Matrix.prototype._alloc = function (m, n) {
        if (m < 1 || n < 1) {
            throw new Error("Invalid matrix size");
        }
        if ((this.m && m && this.m !== m) ||
                (this.n && n && this.n !== n)) {
            throw new Error("Matrix size cannot be reset");
        }
        this.m = m;
        this.n = n;
        this.ir = new Float64Array(m * n);
    };
    
    Matrix.prototype.toString = function () {
        var result,
            i,
            j,
            indent = "    ";
        
        result = "[\n";
        result += indent + "[ ";
        result += this.$(0, 0);
        for (j = 1; j < this.n; j++) {
            result += ", " + this.$(0, j);
        }
        result += " ]";
        for (i = 0; i < this.m; i++) {
            result += ",\n" + indent + "[ ";
            result += this.$(i, 0);
            for (j = 1; j < this.n; j++) {
                result += ", " + this.$(i, j);
            }
            result += " ]";
        }
        result += "\n]";
        return result;
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
        if (this.n !== B.m) {
            throw new Error("Matrices cannot be multiplied " + this.m + "x" + this.n +
                            " * " + B.m + "x" + B.n);
        }
        
        result = new Matrix(this.m, B.n);
        
        for (i = 0; i < this.m; i++) {
            for (j = 0; j < B.n; j++) {
                result.$(i, j, 0);
                for (k = 0; k < this.n; k++) {
                    result.$(i, j, result.$(i, j) + this.$(i, k) * B.$(k, j));
                }
            }
        }
                
        return result;
    };
    
    Matrix.prototype.lu = function () {
        
    };
    
    /** STATIC FUNCTIONS **/
    
    Matrix.I = function (n) {
        var result = new Matrix(n, n),
            i;
        for (i = 0; i < n; i++) {
            result.$(i, i, 1);
        }
        return result;
    };
    
    window.Matrix = Matrix;
    
}());
