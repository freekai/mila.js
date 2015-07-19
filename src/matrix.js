/*jslint nomen: true, plusplus: true */
/*global define, Float64Array, window */
(function () {
    "use strict";

    var DEFAULT_OFFSET = [0, 0];

    /* UTILITY FUNCTIONS */

    function _sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : 0 : NaN;
    }

    /* MATRIX CLASS */

    var Matrix = function (pivot, a, b) {
        var i,
            j;

        if (typeof pivot === "undefined") {
            throw new Error("Matrix constructor requires an argument");
        }

        this.offset = DEFAULT_OFFSET;
        /* LU factorized representation and transformation */
        this._LU = null;
        this._P = null;

        if (typeof pivot === "number") {
            var m = pivot,  // number of rows
                n = a;      // number of columns
            if (typeof n === "number") {
        // initialize empty matrix of m by n.
                this._alloc(m, n);
                this.offset = [0, 0];
                return;
            }
        } else if (pivot instanceof Array && arguments.length === 1) {
            var data = pivot, // 2d javascript array
                cval;
        // initialize a matrix using array of arrays
        // it is possible to initialize a matrix using an array of arrays
        // or an array (it will be row vector 1 by n)
            if (data[0] instanceof Array) {
                if (typeof data[0][0] === "number") {
        // array of arrays
                    this.m = data.length;
                    this.n = data[0].length;
                } else if (data[0][0] instanceof Array) {
                    throw new Error("Matrix can be initialized either by array" +
                                    " or array of arrays");
                } else {
                    throw new Error("Matrix values must be numbers");
                }
            } else if (typeof data[0] === "number") {
        // row vector
                this.m = 1;
                this.n = data.length;
            }
            this._alloc(this.m, this.n);
            for (i = 0; i < this.m; i++) {
                for (j = 0; j < this.n; j++) {
                    cval = (this.m === 1) ? data[j] : data[i][j];
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
                cval = (this.m === 1) ? data[j] : data[i][j];
                if (typeof cval !== "undefined") {
                    this.ir = null;
                    throw new Error("Matrix should be square");
                }
            }
            return;
        } else if (pivot instanceof Matrix) {
        // Matrix range
            var M = pivot,  // base matrix
                offset = a, // offset, array of 2 numbers in form [n, m]
                size = b;   // size, array of 2 numbers in form [n, m]
            this.ir = M.ir;
            this.step = M.n;
            // check validity of the second argument
            if (typeof offset === "undefined" || (offset instanceof Array && offset.length === 2)) {
                this.offset = offset || DEFAULT_OFFSET;
                // check validity of the third argument
                if (typeof size === "undefined" || (size instanceof Array && size.length === 2)) {
                    if (!size) {
                        this.m = M.m - this.offset[0];
                        this.n = M.n - this.offset[1];
                    } else {
                        this.m = size[0];
                        this.n = size[1];
                    }
                    return;
                }
            }
        }
        // if we get to this point, it's an error. it should have returned earlier
        throw new Error("Internal error. Matrix cannot be constructed: arguments not understood.", arguments);
    };

    Matrix.prototype = Object.create(null);
    Matrix.prototype.constructor = Matrix;

    function Lower(M) {
        if (M instanceof Matrix) {
            this.ir = M.ir;
            this.m = M.m;
            this.n = M.n;
            this.step = M.n;
            this.offset = M.offset;
            this._LU = M._LU;
        } else {
            throw new Error("Invalid argument");
        }
    }

    Lower.prototype = Object.create(Matrix.prototype);
    Lower.prototype.constructor = Lower;

    Lower.prototype.$ = function (m, n, val) {
        if (typeof val !== "undefined") {
            throw new Error("This matrix is read-only");
        }
        var i, j;
        if (m instanceof Array && m.length === 2) {
            i = m[0];
            j = m[1];
        } else {
            i = m;
            j = n;
        }
        switch (_sign(j - i)) {
        case -1:
            return Matrix.prototype.$.call(this, m, n);
        case 1:
            return 0;
        case 0:
            return 1;
        default:
            throw new Error("Internal error. Sign returned " + _sign(i - j) + " for i " + i + " and j " + j);
        }
    };

    function Upper(M) {
        if (M instanceof Matrix) {
            this.ir = M.ir;
            this.m = M.m;
            this.n = M.n;
            this.step = M.n;
            this.offset = M.offset;
            this._LU = M._LU;
        } else {
            throw new Error("Invalid argument");
        }
    }

    Upper.prototype = Object.create(Matrix.prototype);
    Upper.prototype.constructor = Upper;

    Upper.prototype.$ = function (m, n, val) {
        if (typeof val !== "undefined") {
            throw new Error("This matrix is read-only");
        }
        var i, j;
        if (m instanceof Array && m.length === 2) {
            i = m[0];
            j = m[1];
        } else {
            i = m;
            j = n;
        }
        switch (_sign(i - j)) {
        case -1: // fall-through
        case 0:
            return Matrix.prototype.$.call(this, m, n);
        case 1:
            return 0;
        default:
            throw new Error("Internal error. Sign returned " + _sign(i - j) + " for i " + i + " and j " + j);
        }
    };

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
            // cannot allocate a matrix which has not default [0, 0] offset
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
        this.every(function (v, i) {
            result.$(i, v);
            return true;
        });
        return result;
    };

    Matrix.prototype.equals = function (obj) {
        if (!(obj instanceof Matrix)) {
            throw new Error(obj + " is not comparable to a matrix");
        }
        if (this.m * this.n !== obj.m * obj.n) {
            return false;
        }
        // FIXME: will not work for partitioned matrix
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
        // FIXME: will not work for partitioned matrix
        return this.ir.every(function (v, i) {
            var denom = Math.max(Math.abs(v), Math.abs(obj.ir[i]));
            return Math.abs(obj.ir[i] - v) / denom < epsilon;
        });
    };

    Matrix.prototype.mul = function (M) {
        var i,
            j,
            k,
            tmp,
            result;

        if (typeof M === "undefined" || (!(M instanceof Matrix) && typeof M !== "number")) {
            throw new Error("Only two matrices or matrix by scalar can be multiplied");
        }

        if (typeof M === "number") {
            this.every(function (v, j) {
                this.$(j, v * M);
                return true;
            });
            return this;
        }

        if (this.n !== M.m) {
            throw new Error("Matrices cannot be multiplied " + this.m + "x" + this.n +
                            " * " + M.m + "x" + M.n);
        }

        result = new Matrix(this.m, M.n);

        // TODO: vectorize
        for (i = 0; i < this.m; i++) {
            for (j = 0; j < M.n; j++) {
                for (k = 0; k < this.n; k++) {
                    result.$(i, j, result.$(i, j) + this.$(i, k) * M.$(k, j));
                }
            }
        }

        return result;
    };

    Matrix.prototype.x = Matrix.prototype.mul;

    Matrix.prototype.div = function (scalar) {
        if (typeof scalar !== "number") {
            throw new Error("Only division by scalar is allowed");
        }
        if (scalar === 0) {
            throw new Error("Division by zero");
        }
        this.every(function (v, i) {
            this.$(i, v / scalar);
            return true;
        });
        return this;
    };

    Matrix.prototype.add = function (M) {
        var isScalar = false;
        if (typeof M === "number") {
            isScalar = true;
        } else if (M instanceof Matrix) {
            if (this.m !== M.m && this.n !== M.n) {
                throw new Error("Cannot add matrices of different sizes");
            }
        } else {
            throw new Error("Invalid argument");
        }
        this.every(function (v, i) {
            this.$(i, v + (!isScalar ? M.$(i) : M));
            return true;
        });
        return this;
    };

    Matrix.prototype.sub = function (M) {
        var isScalar = false;
        if (typeof M === "number") {
            isScalar = true;
        } else if (M instanceof Matrix) {
            if (this.m !== M.m && this.n !== M.n) {
                throw new Error("Cannot add matrices of different sizes");
            }
        } else {
            throw new Error("Invalid argument");
        }
        this.every(function (v, i) {
            this.$(i, v - (!isScalar ? M.$(i) : M));
            return true;
        });
        return this;
    };

    // FIXME: should not work for partitions
    Matrix.prototype.tr = function () {
        var result = new Matrix(this.n, this.m);
        this.every(function (val, idx) {
            result.$(idx[1], idx[0], val);
            return true;
        });
        return result;
    };

    Matrix.prototype.range = function (offset, size) {
        return new Matrix(this, offset, size);
    };

    // FIXME: should also accept range of indices as rowOffset
    Matrix.prototype.col = function (n, rowOffset) {
        if (typeof rowOffset === "undefined") {
            rowOffset = 0;
        }
        return new Matrix(this, [rowOffset, n], [this.m - rowOffset, 1]);
    };

    // FIXME: should also accept range of indices as colOffset
    Matrix.prototype.row = function (m, colOffset) {
        if (typeof colOffset === "undefined") {
            colOffset = 0;
        }
        return new Matrix(this, [m, colOffset], [1, this.n - colOffset]);
    };

    Matrix.prototype.l = function () {
        if (this._LU === null) {
            this.lu();
        }
        return new Lower(this._LU);
    };

    Matrix.prototype.u = function () {
        if (this._LU === null) {
            this.lu();
        }
        return new Upper(this._LU);
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

        var P = Matrix.eye(this.m),
            // clone the matrix we will be operating on
            A = this.clone();

        for (i = 0; i < this.n - 1; i++) {
            midx = max(A, i, i);
            P = P._swapRows(i, midx);
            A._swapRows(i, midx);
            if (A.$(i, i) !== 0) {
                A.col(i, i + 1).div(A.$(i, i));
                A.range([i + 1, i + 1]).sub(A.col(i, i + 1).x(A.row(i, i + 1)));
            } else {
                throw new Error("Matrix " + this + " is singular.");
            }
        }
        this._LU = A;
        this._P = P;

        return [this.l(), this.u(), this._P];

    };

    Matrix.prototype.mean = function () {
        // FIXME: a naïve implementation of mean
        var sum = 0,
            c = this.m * this.n;
        this.every(function (val) {
            sum += val;
            return true;
        });
        return sum / c;
    };

    Matrix.prototype.std = function () {
        // FIXME: a naïve implementation of std
        var sum = 0,
            c = this.m * this.n,
            mean = this.mean();
        if (c === 1 || c < 0) {
            return NaN;
        }
        this.every(function (val) {
            sum += Math.pow(val - mean, 2);
            return true;
        });
        return Math.sqrt(sum / (c - 1));
    };

    /** STATIC FUNCTIONS **/

    Matrix.eye = function (n) {
        var result = new Matrix(n, n),
            i;
        for (i = 0; i < n; i++) {
            result.$(i, i, 1);
        }
        return result;
    };

    Matrix.tr = function (M) {
        return M.tr();
    };

    window.Matrix = Matrix;

}());
