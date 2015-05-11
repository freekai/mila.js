/*jslint nomen: true, plusplus: true */
/*global define, Float64Array, window */
(function () {
    "use strict";
    
    var DEFAULT_OFFSET = [0, 0];
    
    /* UTILITY FUNCTIONS */
    
    function _idx2ij(rawIdx, m, n) {
        var i = Math.floor(rawIdx / n),
            j = rawIdx - i * n;
        return [i, j];
    }
    
    /* MATRIX CLASS */
    
    var Matrix = function (m, n, /* the rest is used internally */ size) {
        var i,
            j,
            cval;
        
        if (typeof m === "undefined") {
            throw new Error("Matrix constructor requires an argument");
        }
        
        this.offset = DEFAULT_OFFSET;
        
        if (typeof m === "number" && typeof n === "number") {
        // initialize empty matrix of m by n.
            this._alloc(m, n);
            this.offset = [0, 0];
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
        } else if (m instanceof Matrix && n !== undefined && n instanceof Array && n.length === 2) {
            // TODO: check boundary conditions
            this.ir = m.ir;
            this.step = m.n;
            this.offset = n;
            if (size !== undefined && size instanceof Array && size.length === 2) {
                this.m = size[0];
                this.n = size[1];
            } else {
                this.m = m.m - this.offset[0];
                this.n = m.n - this.offset[1];
            }
        } else {
            throw new Error("Internal error. Matrix cannot be constructed: arguments not understood.", arguments);
        }
        
        return this;
    };

    Matrix.prototype = Object.create(null);
    Matrix.prototype.constructor = Matrix;

    /**
     * Returns element at position [m, n].
     * @return {number}
     */
    Matrix.prototype.$ = function (m, n, val) {
        var i, j;
        if (m instanceof Array && m.length === 2) {
            i = m[0];
            j = m[1];
            val = n;
        } else {
            i = m;
            j = n;
        }
        // FIXME: boundary checks
        var idx = (i + this.offset[0]) * this.step + (j + this.offset[1]);
        if (typeof val === "undefined") {
            return this.ir[idx];
        } else if (typeof val === "number") {
            return (this.ir[idx] = val);
        } else {
            throw new Error("Only number assignments are allowed");
        }
    };
    
    Matrix.prototype._swapRows = function (i, j) {
        if (i === j) {
            return this;
        }
        i = this.offset[0] + i;
        j = this.offset[1] + j;
        // FIXME: allocate max(m, n) more and use it to move bytes within
        var tmpj = this.ir.slice(j * this.n, (j + 1) * this.n),
            tmpi = this.ir.subarray(i * this.n, (i + 1) * this.n);
        tmpi.forEach(function (val, idx) {
            this.ir[j * this.n + idx] = val;
        }.bind(this));
        tmpj.forEach(function (val, idx) {
            tmpi[idx] = val;
        });
        return this;
    };
    
    Matrix.prototype._alloc = function (m, n) {
        if (this.offset !== DEFAULT_OFFSET) {
            // cannot allocate a matrix which is has not default [0, 0] offset
            throw new Error("Internal Error. Offset is not " + DEFAULT_OFFSET);
        }
        if (m < 1 || n < 1) {
            throw new Error("Invalid matrix size");
        }
        if (this.ir) {
            // never allow re-allocating the matrix
            throw new Error("Internal error. IR is already present.");
        }
        if ((this.m && m && this.m !== m) ||
                (this.n && n && this.n !== n)) {
            throw new Error("Matrix size cannot be reset");
        }
        this.m = m;
        this.n = n;
        this.step = n;
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
        for (i = 1; i < this.m; i++) {
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
    
    Matrix.prototype.clone = function () {
        var result = new Matrix(this.m, this.n);
        result.ir = this.ir.slice();
        return result;
    };
    
    Matrix.prototype.equals = function (obj) {
        if (!(obj instanceof Matrix)) {
            throw new Error(obj + " is not comparable to a matrix");
        }
        if (this.m * this.n !== obj.m * obj.n) {
            return false;
        }
        // FIXME: will not work for partition
        return this.every(function (v, i) {
            return obj.$(i) === v;
        }, this);
    };
    
    Matrix.prototype.every = function (callback, tval) {
        var i, j, T, result;
        if (tval === undefined) {
            T = this;
        }
        for (i = 0; i < this.m; i++) {
            for (j = 0; j < this.n; j++) {
                result = callback.call(T, this.$(i, j), [i, j]);
                if (!result) {
                    return false;
                }
            }
        }
        return true;
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
        // FIXME: will not work for partition
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
        
        // TODO: vectorize
        for (i = 0; i < this.m; i++) {
            for (j = 0; j < B.n; j++) {
                for (k = 0; k < this.n; k++) {
                    result.$(i, j, result.$(i, j) + this.$(i, k) * B.$(k, j));
                }
            }
        }
                
        return result;
    };
    
    Matrix.prototype.div = function (scalar) {
        if (typeof scalar !== "number") {
            throw new Error("Only division by scalar is allowed");
        }
        if (scalar === 0) {
            throw new Error("Division by zero");
        }
        this.every(function (v, i) {
            this.$(i, v / scalar);
        });
    };
    
    // FIXME: should not work for partitions
    Matrix.prototype.tr = function () {
        var result = new Matrix(this.n, this.m);
        this.ir.map(function (val, idx) {
            var ij = _idx2ij(idx, this.m, this.n);
            result.$(ij[1], ij[0], val);
        }, this);
        return result;
    };
    
    Matrix.prototype.lu = function () {
        if (this.n !== this.m) {
            throw new Error("Rectangular matrix LU factorization is not implemented");
        }
                
        /* max in [ci:m, cj] */
        function max(A, ci, cj) {
            var i,
                mval,
                r;
            
            for (i = ci + 1, mval = A.$(ci, cj), r = cj; i < A.m; i++) {
                if (A.$(i, cj) > mval) {
                    mval = A.$(i, cj);
                    r = i;
                }
            }
            return r;
        }
        
        var i,
            j,
            k,
            l,
            midx,
            row;
        
        var P = Matrix.I(this.m),
            // the matrix we will be operating on
            A = this.clone();
        
        // FIXME: draft implementation, see fixmes in inside the loop
        for (i = 0; i < this.n - 1; i++) {
            midx = max(A, i, i);
            P = P._swapRows(i, midx);
            A._swapRows(i, midx);
            if (A.$(i, i) !== 0) {
                // FIXME: !!! ugly operations, need matrix regions
                var tmp = i + 1;
                for (j = tmp; j < A.n; j++) {
                    A.$(j, i, A.$(j, i) / A.$(i, i));
                }
                var T = new Matrix(A.n - tmp, A.n - tmp);
                for (j = 0; j < A.n - tmp; j++) {
                    for (k = 0; k < A.n - tmp; k++) {
                        T.$(j, k, T.$(j, k) + A.$(tmp + j, i) * A.$(i, tmp + k));
                    }
                }
                for (j = 0; j < A.n - tmp; j++) {
                    for (k = 0; k < A.n - tmp; k++) {
                        A.$(tmp + j, tmp + k, A.$(tmp + j, tmp + k) - T.$(j, k));
                    }
                }
            } else {
                // FIXME: singular, throw an error
                throw new Error("Singular!");
            }
        }
        
        return [A, P];
        
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
    
    Matrix.tr = function (A) {
        return A.tr();
    };
    
    window.Matrix = Matrix;
    
}());
