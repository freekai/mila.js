/*global describe, it, Matrix, expect */
describe("Matrix unit tests", function () {
    
    "use strict";
    
    describe("Matrix construction", function () {
        
        it("should construct matrix of any size", function () {
            var negative = function () {
                var mtx;
                mtx = new Matrix(10, 10);
                mtx = new Matrix(1, 1);
                mtx = new Matrix(2, 2);
            };
            expect(negative).not.toThrowError();
        });
        
        it("should initialize a square matrix using array of arrays", function () {
            var initValue = [
                    [54, 34, 88],
                    [32, 87, 36],
                    [63, 22, 17],
                    [94, 65, 79],
                    [13, 9, 55]
                ],
                mtx = new Matrix(initValue);
            
            expect(mtx.n).toEqual(initValue.length);
            expect(mtx.m).toEqual(initValue[0].length);
            expect(mtx.$(0, 0)).toEqual(initValue[0][0]);
            expect(mtx.$(1, 1)).toEqual(initValue[1][1]);
            expect(mtx.$(2, 0)).toEqual(initValue[2][0]);
            expect(mtx.$(3, 2)).toEqual(initValue[3][2]);
            expect(mtx.$(4, 1)).toEqual(initValue[4][1]);
        });
        
        it("should throw error if matrix is not square");
        
        it("should throw error if matrix contains non-numeric elements");
        
        it("should throw error if matrix size is invalid", function () {
            var positive = function (n, m) {
                return function () {
                    var mtx = new Matrix(n, m);
                };
            };
            
            expect(positive(0, 0)).toThrowError("Invalid matrix size");
            expect(positive(-1, -1)).toThrowError("Invalid matrix size");
            expect(positive(0, -1)).toThrowError("Invalid matrix size");
            expect(positive(-1, 0)).toThrowError("Invalid matrix size");
            expect(positive(1, 0)).toThrowError("Invalid matrix size");
            expect(positive(0, 1)).toThrowError("Invalid matrix size");
            
        });
    });
    
    describe("Matrix multiplication", function () {
        
        it("should not allow multiplication of non-matrix objects", function () {
            var mtx1 = new Matrix(2, 3);
            
            var positive = function (obj) {
                return function () {
                    return mtx1.x(obj);
                };
            };
            
            expect(positive(undefined)).toThrowError("Only two matrices can be multiplied");
            expect(positive(null)).toThrowError("Only two matrices can be multiplied");
            expect(positive({})).toThrowError("Only two matrices can be multiplied");
            expect(positive(5)).toThrowError("Only two matrices can be multiplied");
            expect(positive(0)).toThrowError("Only two matrices can be multiplied");
            expect(positive(false)).toThrowError("Only two matrices can be multiplied");
            expect(positive("haha")).toThrowError("Only two matrices can be multiplied");
            
        });
        
        it("should not allow multiplication of non-multiplieable matrices", function () {
            
            var mtx1 = new Matrix(10, 20);
            
            var positive = function (n, m) {
                return function () {
                    return mtx1.x(new Matrix(n, m));
                };
            };
            
            expect(positive(1, 1)).toThrowError(/^Matrices cannot be multiplied /);
            expect(positive(2, 2)).toThrowError(/^Matrices cannot be multiplied /);
            expect(positive(10, 20)).toThrowError(/^Matrices cannot be multiplied /);
            expect(positive(19, 20)).toThrowError(/^Matrices cannot be multiplied /);
            expect(positive(21, 20)).toThrowError(/^Matrices cannot be multiplied /);
            
        });
        
        it("should produce correct results when two matrices are multiplied", function () {
            var mtx1,
                mtx2,
                product,
                result;
            
            mtx1 = new Matrix([
                [1, 2],
                [3, 4]
            ]);
            mtx2 = new Matrix([
                [5],
                [6]
            ]);
            product = new Matrix([
                [17],
                [39]
            ]);
            
            result = mtx1.x(mtx2);
            expect(result).toBeDefined();
            expect(result.n).toBe(2);
            expect(result.m).toBe(1);
            expect(result.equals(product)).toBe(true);
            
            mtx1 = new Matrix([1]);
            mtx2 = new Matrix([2]);
            product = new Matrix([2]);
            
            result = mtx1.x(mtx2);
            expect(result).toBeDefined();
            expect(result.n).toBe(1);
            expect(result.m).toBe(1);
            expect(result.equals(product)).toBe(true);
            
            // TODO: more tests for multiplication
            
        });

    });
});