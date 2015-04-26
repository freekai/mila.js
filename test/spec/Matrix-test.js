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
            
            expect(mtx.m).toEqual(initValue.length);
            expect(mtx.n).toEqual(initValue[0].length);
            expect(mtx.$(0, 0)).toEqual(initValue[0][0]);
            expect(mtx.$(1, 1)).toEqual(initValue[1][1]);
            expect(mtx.$(2, 0)).toEqual(initValue[2][0]);
            expect(mtx.$(3, 2)).toEqual(initValue[3][2]);
            expect(mtx.$(4, 1)).toEqual(initValue[4][1]);
        });
        
        it("should throw error if matrix is not square", function () {
            var case1 = function () {
                    return new Matrix([
                        [1, 2],
                        [2]
                    ]);
                },
                case2 = function () {
                    return new Matrix([
                        [1, 2, 3],
                        [4, 5, 6],
                        [8, 9, 10, 11]
                    ]);
                },
                case3 = function () {
                    return new Matrix([
                        [1],
                        [2, 3],
                        [4, 5, 6]
                    ]);
                };
            
            expect(case1).toThrowError("Matrix should be square");
            expect(case2).toThrowError("Matrix should be square");
            expect(case3).toThrowError("Matrix should be square");
            
        });
        
        it("should throw error if matrix contains non-numeric elements", function () {
            var case1 = function () {
                    return new Matrix([
                        [1, 2],
                        [2, true]
                    ]);
                },
                case2 = function () {
                    return new Matrix([
                        ["1", "2"]
                    ]);
                },
                case3 = function () {
                    return new Matrix([
                        [[1, 2], 3],
                        [[4, 5], [6, 7]]
                    ]);
                },
                case4 = function () {
                    return new Matrix([
                        [1, [2, 3]],
                        [[4, 5], 6]
                    ]);
                };
            
            expect(case1).toThrowError("Matrix values must be numbers");
            expect(case2).toThrowError("Matrix values must be numbers");
            expect(case3).toThrowError("Matrix can be initialized either by array or array of arrays");
            expect(case4).toThrowError("Matrix values must be numbers");
            
        });
        
        it("should throw error if matrix size is invalid", function () {
            var positive = function (m, n) {
                return function () {
                    var mtx = new Matrix(m, n);
                };
            };
            
            expect(positive(0, 0)).toThrowError("Invalid matrix size");
            expect(positive(-1, -1)).toThrowError("Invalid matrix size");
            expect(positive(0, -1)).toThrowError("Invalid matrix size");
            expect(positive(-1, 0)).toThrowError("Invalid matrix size");
            expect(positive(1, 0)).toThrowError("Invalid matrix size");
            expect(positive(0, 1)).toThrowError("Invalid matrix size");
            
        });
        
        it("should print matrix in JSON format", function () {
            var expected = "[\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],\n" +
                "    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]\n" +
                "]",
                mtx = new Matrix(10, 20);
            
            expect(String("") + mtx).toEqual(expected);
            
        });
                
    });
    
    describe("Matrix static methods", function () {
        
        it("should construct identity matrices correctly", function () {
            var result,
                expected;
            
            result = Matrix.I(1);
            expected = new Matrix([1]);
            expect(result.equals(expected)).toBe(true);
            
            result = Matrix.I(2);
            expected = new Matrix([
                [1, 0],
                [0, 1]
            ]);
            expect(result.equals(expected)).toBe(true);
            
            result = Matrix.I(3);
            expected = new Matrix([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]);
            expect(result.equals(expected)).toBe(true);
            
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
            
            var positive = function (m, n) {
                return function () {
                    return mtx1.x(new Matrix(m, n));
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
            expect(result.m).toBe(2);
            expect(result.n).toBe(1);
            expect(result.equals(product)).toBe(true);
            
            mtx1 = new Matrix([1]);
            mtx2 = new Matrix([2]);
            product = new Matrix([2]);
            
            result = mtx1.x(mtx2);
            expect(result).toBeDefined();
            expect(result.m).toBe(1);
            expect(result.n).toBe(1);
            expect(result.equals(product)).toBe(true);
            
            mtx1 = new Matrix([
                [ 24.44266152720159, 39.11191113404377, 12.9404743269262, 35.0213329845099, 34.7692298370675, 48.06634649497643, 30.90753115115746, 56.29406571012348, 9.234363396913507, 28.82064587723082, 13.44796858529436, 56.13704392111296, 14.31569700996536, 37.75633861435593, 53.70591699350002, 53.43952974445242, 25.08572873973348, 25.23552737521636, 12.86241155497778, 32.52463569052437 ],
                [ 6.963649596851451, 44.86869806513358, 37.02288087281365, 48.74541402535881, 9.602907151378707, 44.980851334935, 54.98142831066359, 14.45709851449417, 18.95597723840002, 42.96714639121441, 4.336420181761629, 16.63283112206621, 29.13713039086525, 35.0154179932254, 22.24298342011575, 0.6298308876992702, 42.48203812041059, 25.28866738342267, 40.28723141811641, 45.70276954311309 ],
                [ 52.99849731314195, 57.73221234442654, 54.99380217554671, 55.85422411030984, 56.42377192153111, 28.42665000630974, 15.32517255011711, 29.66618812789982, 15.89995461924839, 49.10128335592955, 19.5736423159319, 59.79230615822576, 37.58668014400673, 29.2236964081151, 43.07995839063878, 23.08494890378848, 26.4763203669468, 48.66433678723968, 42.51160713947994, 32.16024855375184 ],
                [ 56.24129177188327, 7.214070687165561, 16.13544057700706, 15.54884937689061, 2.490998179230593, 29.84702822843346, 17.60152197645737, 1.559035403316802, 43.25274707544293, 21.29661504784016, 24.16791421100906, 43.43612996356956, 6.665345138460905, 17.20261076465914, 2.176860610324674, 24.86367906020536, 10.75595056553534, 17.76837603636812, 9.19728351191546, 6.649877991088249 ],
                [ 4.874077230912763, 6.6978914537456, 42.19278166947336, 1.716051406271207, 21.70546544646565, 57.35169135366499, 14.46933858187893, 11.24089096264865, 46.29845888593915, 28.27082016597987, 29.40508869606964, 42.36931929615968, 22.7323938442251, 34.31328976448172, 18.40688154288375, 3.544243497104372, 53.67650417435051, 27.74041507089812, 6.785009338834493, 3.667853989586039 ],
                [ 30.93813839425688, 36.00744595118392, 37.24879797850775, 6.632564431814679, 45.99259274492387, 55.81724027624532, 3.432529668607219, 18.3515403072702, 7.96837785149683, 45.94291002004105, 57.90970754429119, 54.38736024254617, 58.83072057282637, 38.61030980973183, 15.63215095492142, 21.87289721933254, 43.57392442566752, 59.49653281682587, 5.674145386561866, 5.50907620330225 ],
                [ 31.65984063187437, 8.180327130104034, 34.46567009020741, 7.88935542785696, 20.59514289563809, 36.55500568989167, 3.252759672759609, 47.73228862572088, 0.6763393709689618, 36.10596360180994, 2.348745881125727, 53.96843296618577, 45.28292626736418, 12.14222001937602, 25.02920515119841, 8.438764625821072, 10.8759478752676, 50.3178389585962, 26.41186244743803, 13.47388905408973 ],
                [ 2.360096887905601, 35.06295093499178, 41.82660738995406, 34.8627399962275, 56.36043523978359, 19.87700402287335, 19.85536519064843, 29.39772541473732, 16.09719135169904, 56.19283835157943, 31.18442941923453, 2.792749531020465, 49.55610303291255, 30.00788784845162, 19.70792138107399, 58.03513491023052, 46.51197469632058, 25.92261205092099, 52.6423871979364, 23.29256906268907 ],
                [ 36.01839590730855, 50.21567825052138, 39.51366018610811, 36.04004415950244, 4.027606662280023, 5.076916022100355, 10.27803461664117, 26.14673291155315, 37.2074069069586, 30.32320012811416, 28.66251688109061, 21.47131332107489, 13.30828542903636, 11.58873381249782, 9.717876806250384, 10.48335694681198, 1.596264273924258, 19.0858479260893, 8.165100806946894, 55.48291066506685 ],
                [ 4.555950850371713, 0.1264370039905165, 58.12206397717583, 40.30918036182309, 20.6169169474171, 52.64220578192181, 19.40384315037108, 45.3632244280039, 22.64944213736993, 41.92582392705418, 45.13683767067432, 32.197786522862, 39.87414653406093, 43.13037650368153, 55.42207932205798, 13.24007731219163, 43.32720564227692, 17.84820026211154, 36.51489070562238, 31.33223033112472 ]
            ]);
            
            mtx2 = new Matrix([
                [ 33.25167374689386, 53.72195320650381, 52.83649841371724, 11.81072228093762, 91.02943718657818, 32.71707473980134, 74.29629126334137, 71.42150798947117, 54.16094897549301, 84.62139528037575, 19.52224921290309, 91.4072835163163, 14.37950020343946, 10.56102915346594, 24.55501876561674, 35.5503742604562, 74.92079247478372, 21.75616161120677, 84.13045231455163, 16.87246392275908, 74.23821109557164, 33.1400162822635, 81.43264544760773, 76.88714572779737, 65.66681191698316, 84.84269475083227, 76.13927021555237, 55.19377923853881, 27.4694854750991, 72.9857716784808 ],
                [ 23.6625107584786, 59.5350670785821, 32.79965152878731, 5.040590848564001, 44.66977385425619, 42.7739220485425, 5.495184897705633, 59.08265457766527, 8.300149052232236, 37.88779759014848, 62.37008921843752, 7.314511012660178, 74.22688470419261, 41.77804425517391, 26.66458208967277, 8.111229344338904, 39.81787491325485, 70.6683231903433, 3.424595594344508, 13.4513339115243, 78.91712480000488, 43.87002848640574, 74.07675612287701, 69.0458481397113, 90.41628206232963, 8.200529121812632, 85.61273179526655, 61.59868768144663, 64.20346080831983, 43.57289627021465 ],
                [ 19.37836281628729, 99.44942345229958, 12.05991056735821, 95.63323985997346, 9.641331861952288, 29.47470450032315, 5.580111939110259, 13.08747942936532, 58.17765652238651, 39.30066031464541, 25.88647240081179, 5.38256694811156, 55.86666097653013, 40.31473380379851, 29.03673419329142, 58.41765665648892, 63.30836113466371, 30.56854384218932, 9.636227466951611, 20.19061715240158, 73.62927922259479, 46.69223066600889, 77.27947196053422, 93.22257373821373, 21.64970779115164, 85.32223591309854, 46.32289247245795, 75.69572854626611, 15.52174664659559, 96.55622867954649 ],
                [ 26.27178506305627, 75.66606920951931, 78.93747716303147, 85.52914703818472, 82.14629073686217, 64.80364368580271, 4.676474020095782, 36.30851832107177, 5.783130499808169, 85.79197243660634, 40.33478875366522, 44.23379958498476, 25.27413548031402, 61.41067373186912, 23.26539654975576, 86.57620296570798, 29.73980718618245, 82.33681741576902, 60.28976279482592, 30.75473181379342, 73.85259341050683, 84.00645138705598, 83.11944153671817, 66.18937547113347, 22.17892768584264, 49.86857397863466, 63.7033537261164, 52.27360756325171, 19.85630555022374, 35.78453040881222 ],
                [ 72.3576019225378, 14.04417556845851, 52.50934547846256, 74.29389086843904, 76.28783751933253, 39.95549980134784, 97.5928452519877, 71.83293998538922, 24.67025759923665, 32.66672959533953, 31.44878466455967, 99.63686297767809, 8.848218554901271, 69.4838937825965, 12.29856698506014, 55.5761147550834, 23.39293549782328, 77.36081247080462, 7.479618891584021, 24.57546246643594, 27.07866409577301, 46.72439200165815, 35.0084443690103, 14.90569093962251, 34.28719738149087, 86.11335034776425, 19.95920245971415, 90.23179363373056, 21.60919191957114, 45.23689091738439 ],
                [ 77.11541880241529, 1.645132748059313, 5.901929012917844, 8.599489452847656, 60.20401391932459, 72.97595627966604, 49.04908088734778, 99.1960205342875, 29.41323548173063, 75.14158576910887, 45.11943464126677, 61.92386950616878, 23.85009185248872, 24.6897013935959, 61.75486729446376, 53.18286455486417, 9.258104821518124, 86.72709047407479, 38.20999750705339, 21.85681489432369, 61.9962087101465, 91.66894251951257, 66.96756772137502, 57.21190857853408, 79.13786692366668, 0.6734959978865684, 66.35875894329895, 90.92065878894441, 53.55334328563865, 78.4315901967561 ],
                [ 17.0040607465064, 28.34274376956245, 31.14581739635027, 25.06539337327565, 3.041319402590075, 92.76919292357985, 69.40216632222123, 71.54030163992429, 1.004527325232401, 1.975308591753304, 58.71511532614948, 89.82493518666128, 21.58349186423642, 31.6711193373106, 52.57751342750927, 51.64773493239654, 53.15345865054122, 71.89396209856297, 60.58802095604421, 98.70987044963128, 81.81730540330655, 76.8779214586868, 12.20844886862556, 11.20719472095204, 91.4845608187937, 19.64407525377651, 74.60758420767945, 50.6261667985482, 83.05589631600095, 87.76306095794321 ],
                [ 6.112743433301852, 73.1794483618346, 10.41623755600843, 98.56469436095355, 50.61008059364616, 3.892819762262449, 31.59924059778386, 28.5692255447177, 52.91017208458045, 34.67141751132923, 17.74614725095665, 27.27653795101999, 27.80507582833859, 17.28144002768322, 38.19303815862299, 56.91718378718591, 0.1066601149170943, 35.74178060411338, 85.3899638642385, 72.63815686605962, 16.43541875925245, 0.08391512716256377, 54.47439297360538, 43.04301793361557, 17.65956499844886, 77.16493196305365, 69.54443371009368, 59.10031654993416, 85.06272925090731, 89.56706947920036 ],
                [ 74.33472694806453, 15.35530176766863, 3.017083977480999, 58.68086798897957, 55.8075542271954, 11.46759095738097, 32.58117681410805, 16.36701691194398, 83.32144733299154, 9.408805890818721, 72.24114585557452, 55.61068033296708, 81.91170437015673, 25.8883614310575, 63.91864749168496, 6.620960693034799, 83.83434184123114, 59.86686600497231, 15.98591341660365, 5.799232657480406, 17.00572185787315, 45.00099231437063, 84.01665799317689, 78.51761707742764, 83.94474264543587, 1.888834865436577, 0.1769446918190076, 49.68022935599695, 73.17835372717221, 98.044913827785 ],
                [ 10.47791279250973, 62.16094543825393, 77.24960454615827, 38.53987051979335, 27.39091701889313, 61.41253849760987, 80.43628731184675, 14.54955567225709, 94.10631752234173, 99.78957898672476, 99.7905955983358, 44.5175049917115, 5.897456211514678, 67.42392978029997, 4.264284922400001, 40.83789888405238, 62.1617512596282, 39.27707851300977, 73.04199776194109, 93.27011467282105, 61.30227050854984, 9.892401264898092, 79.75584637354726, 65.6952548876455, 35.70300236738048, 79.57200061214628, 70.13066245846878, 66.22166798512767, 89.2169363990523, 53.25332815082076 ],
                [ 53.68170955342732, 32.92978049016956, 95.72877811248406, 79.4208780113719, 97.52670316284751, 10.34028987815916, 81.2154680302172, 58.91404048507258, 75.04081431838007, 78.52665207525521, 60.3439301597213, 92.32494059609778, 43.04731724304096, 83.64568930659195, 9.338320456849186, 91.80497930064122, 58.26590388309817, 54.0427393131572, 30.02619220423837, 72.52374345391605, 40.02589767284464, 96.19716461769914, 12.6604788650511, 86.89346216417914, 21.95881777835867, 15.46239661527716, 73.83148501015356, 92.40637733683256, 92.08114928551542, 82.96110733550248 ],
                [ 99.12557042392307, 16.44246448832268, 71.39390245056582, 8.099767804963413, 30.40646746224847, 60.01950047950238, 32.15271445757885, 8.676907661915294, 34.04024881244621, 53.00764452871023, 3.060311390397312, 88.47904090149909, 9.713461897667957, 90.75076710947904, 5.540773945397352, 55.24513416906468, 83.42141606900134, 88.84429474595407, 14.47988486483731, 31.66089809447957, 64.37903815552666, 47.36098300831927, 28.00466412253827, 15.90963359182536, 50.6220805722343, 42.95488508703802, 24.11948755358274, 94.79022925900364, 48.94398201988171, 35.48163756802818 ],
                [ 30.95356000224043, 67.25464152289575, 98.94310737060661, 68.14073738366629, 58.5379136279934, 92.07846606165977, 85.87800518772958, 13.90674355570391, 22.94980850066366, 88.00201868858046, 91.09988827089838, 30.30717794589417, 99.65510921166938, 20.49331777611956, 0.2489597557372813, 91.23926182332947, 40.13431765175233, 83.00397331290559, 98.13421670489875, 55.65755187712232, 19.66926863963391, 69.44025577026272, 60.83071803683735, 21.41442355300563, 39.99098579295989, 26.35969463722746, 26.53968564169822, 13.04769463794608, 51.22277150798092, 96.5347382037661 ],
                [ 88.08844367507865, 59.64716333262753, 68.36903582789103, 92.82165281380267, 97.66648308199842, 56.70337054057657, 17.59440950394605, 21.83671156355127, 71.17589857997346, 85.050043968263, 81.92168887922861, 66.47496971855684, 44.30224078890048, 22.51569838912488, 65.82118584186784, 79.19924107097177, 6.337405968368885, 60.3638734180125, 93.32663283765108, 75.41158268202891, 2.254087244708041, 37.62412214700119, 4.693519868414324, 87.66107907138033, 7.087574651971089, 21.21226980202884, 46.60611669715048, 65.07926808601817, 53.36056834833833, 39.13755229161757 ],
                [ 80.81877038462804, 32.16263145838299, 95.57213208819473, 39.15420764036961, 75.7443138065947, 79.91747944333396, 51.55550950464169, 53.16976970814953, 83.89766475149355, 11.93654465121152, 64.97734199282347, 85.9732703044001, 95.84419340414479, 61.5149047885747, 47.46097118051388, 80.94495392786773, 76.92422918817577, 77.7389230009484, 38.28732625058698, 71.29380261591804, 89.36290288572528, 82.91142808036176, 35.95065776287478, 94.42437003018543, 37.74193881133795, 77.53247567614582, 54.40045146761808, 19.2462042950383, 27.44982041557612, 64.04510109399406 ],
                [ 13.05830260595762, 32.18804988557606, 15.86707875920686, 79.58118701184877, 24.95725568670017, 31.67995231613648, 66.41264667592249, 39.29723456099095, 50.78576425086819, 24.36666943386017, 55.92936662341315, 33.41697303772166, 10.70484102074631, 10.07043907994352, 95.42583331905442, 13.72474865960866, 44.93818896552293, 0.6695755484679311, 27.78079554896486, 4.367558547960675, 86.2453824694568, 33.26102802068133, 98.15817856213506, 67.90073153664065, 85.93767684287212, 79.04212505675684, 65.10448906290114, 78.41529247956436, 5.855193475874103, 50.03884962576721 ],
                [ 86.61063038135708, 12.29739493746077, 43.30482509293466, 2.992457958606403, 43.01466211746241, 86.39039196286282, 47.70083593221246, 1.40075620829953, 95.47672012770812, 42.48794008740448, 18.65321322341066, 50.93358361145934, 6.105618138975803, 66.05796151838059, 97.00283453503592, 38.79093496327038, 91.00110292244801, 34.26955580776774, 83.40716201055636, 84.25070303101295, 81.18545930966631, 96.40116724863807, 16.1231818086492, 45.98212529998039, 45.27688484494113, 54.1082722306428, 64.95518486169995, 65.16568220545219, 91.31039616503567, 16.29923259346174 ],
                [ 46.21672422877064, 35.06137547174191, 17.24731557671099, 49.57960611251682, 17.41104251058144, 50.33436972286344, 49.94904507352193, 23.41053339953048, 72.13093178660982, 66.71624784281211, 90.23778684960911, 46.38020836029727, 43.82957023190848, 55.54851218103462, 71.5231884272707, 80.11502209227801, 34.12331751302604, 99.28617189776929, 53.80117304399766, 71.24450742144523, 80.15897720942795, 67.13225648330653, 78.59777377724663, 75.12907713736074, 94.75342607466372, 14.68449240085811, 60.32814556267182, 37.29454720136786, 5.414336843450577, 79.83572651866494 ],
                [ 29.02535443669462, 15.2210476896198, 64.55941097247108, 9.71282617476496, 16.14219526891208, 64.70062016603984, 64.74415615086477, 28.10514097786917, 45.92494713781228, 86.30595309276958, 39.42681990439375, 44.98209946315397, 89.21982731681524, 43.93892660555635, 37.82270423085923, 47.45989457419377, 62.64430705410737, 84.24131435606709, 12.82296841877759, 59.34736959839523, 77.68380513710349, 74.17308674780433, 47.45637034937102, 26.16248654798085, 15.66491018875507, 90.6462905153154, 24.06676198896964, 24.87648439394226, 86.72442402730947, 31.95742033379856 ],
                [ 26.37752647937916, 54.07037136032037, 96.00733940446302, 37.48682209756457, 75.99082350662165, 11.77928523525568, 82.91841947517406, 77.99724523562126, 9.747858968501049, 3.143022303606584, 14.10852950298933, 4.083342477799716, 97.20595920801151, 55.53281261997432, 87.97598926380265, 61.93672673148694, 30.52679109725351, 62.41634000401616, 7.297904301395823, 22.28613079264478, 18.5331275830548, 60.69553753921517, 71.37017111478993, 77.31327068200856, 58.42926238218587, 64.79689372787966, 57.56333831224204, 77.35541279431985, 4.373714713804993, 77.60151481065787 ]
            ]);
            
            // octave-generated product
            var octaveProduct = new Matrix([
                [ 30653.70765439116, 26250.59908029143, 32155.82315798815, 30719.9848158747, 33911.09165257596, 32587.91156588868, 31656.24164559575, 27935.67712416885, 29645.44001524031, 31194.36498944762, 29853.35393895845, 35403.01700195304, 24986.82573340184, 28936.11975166035, 28877.79176232655, 34834.0659653798, 28478.04559029641, 39223.48919134948, 28993.78299016612, 29922.11209635954, 37328.28952491284, 34822.20344207892, 35039.47834339273, 37038.57624940503, 33045.62134783823, 32720.21883518983, 36388.16382165231, 41178.89148418976, 30212.81475494974, 38967.85878105742 ],
                [ 25234.24957688088, 25896.32351981485, 30422.93279902824, 24811.07430460635, 27719.26497713717, 33673.30008968122, 27569.72152145447, 23961.79765201966, 25314.89050745911, 30853.79094976765, 29955.98820254178, 27713.93278533265, 27630.02563655362, 26742.35465297697, 26344.76526802495, 32437.46669182938, 27345.58660861036, 38590.45672035773, 26954.20096031728, 30263.87645573809, 34516.02582987955, 36066.91577371296, 31795.54384749937, 33496.06009665092, 29561.65600216461, 26406.07930948088, 32755.47304673079, 34242.7992406886, 31146.13096921977, 36146.24376057832 ],
                [ 35197.59276663397, 35165.59827761231, 41685.02785314386, 36470.30745225454, 40054.79594133551, 39457.15156538912, 38313.45112864496, 30645.46848379713, 36168.15702755326, 43430.85322679479, 37131.42753873813, 40975.03163786668, 33509.68090458914, 37441.73555356567, 28531.6317625522, 43222.05883497882, 38086.41717198398, 49331.66730797153, 33130.89749272127, 34564.39370839826, 46204.3714667036, 42861.53241491368, 45144.08982100891, 45401.11675903397, 37459.07243186768, 41583.96131366194, 41372.1217082889, 47403.96091120495, 35246.98418948651, 47252.89516358926 ],
                [ 19011.47551303239, 14026.62854274315, 17134.51830375712, 15606.92573915069, 19950.54159888621, 17257.03038153459, 19026.49558291105, 15250.0439526016, 19692.84153003546, 21284.59370590259, 17729.04220011469, 23292.53897442239, 13139.13529929522, 15893.3155106082, 15441.30294961826, 18021.87698260497, 21262.32246597064, 21300.4751202787, 16862.67688780037, 14577.53938838891, 21913.34348095337, 20417.89190220919, 22380.37730427293, 23079.86598287572, 21556.19575523376, 16481.56556453988, 19513.43826797503, 24719.00697663606, 18600.31571728888, 24696.68320286865 ],
                [ 28492.34644223049, 16967.55626058767, 21334.59081522346, 21810.65468646701, 23871.21399689228, 25491.34453372411, 22895.78239932191, 16616.73509847015, 27944.23963872389, 25673.61193419318, 24163.48633413809, 27426.40031866351, 18882.17842273401, 23118.69922052382, 21397.55344327576, 26169.84842185396, 25122.90001784411, 30126.79215334825, 21754.45097053616, 23651.75084218883, 25712.27762093783, 29429.15779690861, 23572.38509838184, 28343.36457825606, 23899.7001344722, 19023.82534536104, 23261.54004399614, 31587.4581288628, 26820.20964638899, 31012.03200075309 ],
                [ 33758.09973980347, 26441.99174754769, 33940.71608620038, 31033.42602418441, 34506.73010473162, 33896.5909261026, 35051.36984410806, 24753.35230234766, 34401.89486205646, 39953.24368339785, 34639.48780656857, 36761.19212476104, 24854.75781537708, 31818.73880822244, 23963.70925574601, 38197.02455617491, 30829.64187561067, 41113.1831969116, 31277.39118551159, 32003.12675040693, 35807.56682725064, 37903.57112495718, 34106.40357626673, 37678.43284741828, 32324.36223164807, 28226.55064479683, 35059.93411516799, 42442.17843035826, 32825.01251107194, 41381.1496260666 ],
                [ 21675.8500868104, 21241.35192161062, 23918.41408926333, 22224.71928947363, 22059.31981981047, 24845.06985377551, 24828.25401242201, 16870.71458199287, 23857.07141647377, 28418.92672307843, 22825.72181558863, 24779.1349111882, 20010.32867775422, 21605.91714423684, 16844.72522510172, 28314.05737643812, 22024.1062716643, 30931.38896613938, 23644.16308891188, 23552.88479343678, 26884.60937818822, 24577.43697698399, 27674.85888071888, 25695.00414511725, 22636.81666115591, 25514.80360826267, 24448.3643973722, 28006.68190716271, 22266.95444298715, 31691.54484079852 ],
                [ 26395.82482188428, 28529.34540668835, 33961.9437451066, 34910.62545739589, 31501.10896885643, 33535.03720351142, 35720.80101773175, 23917.67032547785, 32498.04643623603, 35796.66671320739, 34849.65694110299, 31358.98489690105, 28251.74230149363, 29535.08341624939, 27548.12631864628, 35248.62034292952, 30140.30358002839, 37896.49433787494, 29206.05383354325, 32115.94551401951, 36793.21957041536, 36571.89335663863, 36883.34357329577, 36741.60941296774, 29702.2247258577, 35660.79275166272, 34380.11633860399, 39219.95116767732, 33364.16637710124, 39169.33673865241 ],
                [ 16942.40549393936, 23653.30012248181, 23893.34310120009, 22827.32210840289, 24843.63679957427, 17558.8646635142, 20894.85889289394, 18938.20178702514, 20275.67611311921, 22548.64214437019, 21480.32533937668, 19703.53037226033, 22989.48340794364, 20663.43378319295, 17943.11549370659, 23408.87514319374, 22255.06725514668, 26475.22527759106, 17536.95268409381, 17684.23761945404, 24305.97045325398, 23386.5270598813, 29357.0674465593, 30583.18732107878, 23557.01176409077, 21935.35803348085, 25687.34486526666, 28634.95623508086, 20925.41970993316, 31150.13181447762 ],
                [ 32385.3035487317, 29169.53755645439, 36475.11843221801, 35280.87385540656, 35402.14205308511, 34694.41654281801, 32877.78089591833, 24775.43100849922, 35368.43885590768, 36464.03048897594, 32645.4682261967, 35037.52359834142, 30505.52175980135, 31642.1923043799, 27584.01979210665, 40868.48155401839, 31579.28213851637, 41202.23920079038, 31533.78724247346, 34962.35697046199, 35936.10045376225, 40254.3098913526, 33888.04230154106, 40379.37048335643, 27116.80682191685, 33765.3081953682, 34697.35284752318, 40453.64539192818, 35000.30781590434, 43039.11762969186 ]
            ]);
            
            product = new Matrix([
                [ 30653.707654391157, 26250.599080291428, 32155.823157988154, 30719.9848158747, 33911.09165257596, 32587.911565888688, 31656.241645595754, 27935.677124168848, 29645.440015240314, 31194.364989447622, 29853.353938958455, 35403.01700195304, 24986.82573340184, 28936.119751660346, 28877.791762326546, 34834.0659653798, 28478.045590296417, 39223.48919134948, 28993.782990166124, 29922.11209635954, 37328.28952491284, 34822.20344207892, 35039.47834339273, 37038.576249405036, 33045.621347838234, 32720.21883518983, 36388.16382165231, 41178.89148418976, 30212.814754949748, 38967.85878105742 ],
                [ 25234.24957688088, 25896.32351981485, 30422.93279902824, 24811.074304606347, 27719.26497713717, 33673.30008968121, 27569.72152145447, 23961.797652019664, 25314.89050745911, 30853.790949767645, 29955.988202541776, 27713.932785332647, 27630.025636553622, 26742.354652976966, 26344.76526802495, 32437.466691829377, 27345.586608610363, 38590.45672035773, 26954.20096031728, 30263.876455738093, 34516.025829879545, 36066.91577371296, 31795.54384749937, 33496.06009665092, 29561.65600216461, 26406.079309480887, 32755.473046730785, 34242.799240688604, 31146.130969219772, 36146.24376057832 ],
                [ 35197.59276663397, 35165.59827761231, 41685.02785314386, 36470.30745225454, 40054.79594133551, 39457.15156538912, 38313.451128644956, 30645.468483797136, 36168.157027553265, 43430.85322679479, 37131.427538738135, 40975.031637866676, 33509.68090458914, 37441.73555356567, 28531.6317625522, 43222.058834978816, 38086.41717198398, 49331.667307971526, 33130.89749272127, 34564.39370839825, 46204.37146670361, 42861.53241491368, 45144.08982100891, 45401.11675903397, 37459.07243186768, 41583.961313661945, 41372.1217082889, 47403.96091120496, 35246.98418948652, 47252.89516358926 ],
                [ 19011.475513032394, 14026.628542743156, 17134.518303757122, 15606.925739150689, 19950.541598886204, 17257.03038153459, 19026.49558291105, 15250.0439526016, 19692.84153003546, 21284.593705902585, 17729.04220011469, 23292.538974422387, 13139.13529929522, 15893.315510608201, 15441.302949618266, 18021.87698260497, 21262.322465970636, 21300.475120278705, 16862.67688780037, 14577.539388388905, 21913.343480953376, 20417.891902209187, 22380.377304272926, 23079.86598287572, 21556.19575523376, 16481.56556453988, 19513.43826797503, 24719.00697663607, 18600.315717288875, 24696.68320286866 ],
                [ 28492.346442230493, 16967.55626058767, 21334.590815223462, 21810.654686467013, 23871.213996892282, 25491.344533724106, 22895.782399321914, 16616.735098470148, 27944.239638723888, 25673.611934193184, 24163.486334138095, 27426.400318663505, 18882.17842273401, 23118.69922052382, 21397.553443275756, 26169.84842185396, 25122.900017844113, 30126.79215334825, 21754.45097053616, 23651.750842188827, 25712.277620937828, 29429.15779690861, 23572.38509838185, 28343.36457825607, 23899.70013447221, 19023.82534536104, 23261.54004399614, 31587.458128862796, 26820.209646388987, 31012.032000753083 ],
                [ 33758.09973980347, 26441.991747547687, 33940.71608620038, 31033.426024184413, 34506.73010473162, 33896.5909261026, 35051.36984410806, 24753.352302347655, 34401.894862056455, 39953.24368339785, 34639.48780656857, 36761.19212476102, 24854.757815377077, 31818.73880822243, 23963.70925574601, 38197.02455617492, 30829.641875610665, 41113.18319691161, 31277.391185511588, 32003.126750406933, 35807.56682725064, 37903.57112495718, 34106.403576266726, 37678.43284741828, 32324.362231648058, 28226.550644796822, 35059.93411516799, 42442.17843035826, 32825.01251107194, 41381.14962606659 ],
                [ 21675.850086810402, 21241.35192161062, 23918.41408926333, 22224.719289473633, 22059.319819810466, 24845.069853775512, 24828.25401242201, 16870.714581992877, 23857.07141647377, 28418.92672307843, 22825.72181558863, 24779.134911188197, 20010.328677754223, 21605.91714423683, 16844.725225101723, 28314.05737643812, 22024.106271664292, 30931.388966139384, 23644.16308891187, 23552.88479343678, 26884.609378188223, 24577.43697698399, 27674.858880718875, 25695.004145117247, 22636.816661155903, 25514.803608262675, 24448.3643973722, 28006.68190716271, 22266.954442987146, 31691.54484079851 ],
                [ 26395.82482188428, 28529.34540668835, 33961.9437451066, 34910.625457395894, 31501.108968856435, 33535.03720351142, 35720.80101773175, 23917.670325477848, 32498.046436236025, 35796.66671320739, 34849.656941103, 31358.98489690105, 28251.742301493632, 29535.083416249392, 27548.12631864628, 35248.62034292952, 30140.303580028387, 37896.494337874945, 29206.05383354325, 32115.945514019513, 36793.21957041536, 36571.893356638626, 36883.34357329577, 36741.60941296774, 29702.224725857697, 35660.792751662724, 34380.116338604, 39219.95116767732, 33364.16637710123, 39169.33673865242 ],
                [ 16942.405493939365, 23653.300122481814, 23893.343101200095, 22827.3221084029, 24843.63679957427, 17558.864663514203, 20894.858892893943, 18938.201787025144, 20275.676113119207, 22548.642144370195, 21480.325339376683, 19703.53037226033, 22989.48340794364, 20663.433783192955, 17943.11549370659, 23408.87514319374, 22255.06725514667, 26475.225277591064, 17536.952684093816, 17684.23761945404, 24305.97045325398, 23386.5270598813, 29357.06744655931, 30583.18732107878, 23557.011764090767, 21935.35803348085, 25687.344865266652, 28634.956235080856, 20925.41970993317, 31150.13181447763 ],
                [ 32385.303548731703, 29169.537556454394, 36475.11843221802, 35280.87385540656, 35402.14205308511, 34694.41654281801, 32877.78089591833, 24775.431008499225, 35368.43885590768, 36464.030488975935, 32645.468226196706, 35037.52359834141, 30505.521759801348, 31642.192304379907, 27584.01979210665, 40868.4815540184, 31579.282138516366, 41202.23920079038, 31533.787242473467, 34962.35697046199, 35936.10045376226, 40254.3098913526, 33888.04230154106, 40379.370483356426, 27116.806821916845, 33765.308195368205, 34697.35284752317, 40453.645391928185, 35000.30781590434, 43039.11762969185 ]
            ]);
            
            result = mtx1.x(mtx2);
            
            expect(result.equals(product)).toBe(true);
            expect(result.equalsWithPrecision(octaveProduct, 1e-15)).toBe(true);

        });
        
        it("should perform LU factorization correctly", function () {
            var mtx = new Matrix([
                    [  35.97618080955179, 94.57070314249891, 49.98344086675048, 67.33494624141161, 14.63598802946727 ],
                    [  91.44131503552501, 93.57300959959645, 18.51588934612332, 69.26371258936508, 29.06687359825972 ],
                    [  91.21217625620811, 49.43148799778407, 50.76503051832285, 30.22879917057334, 50.69626919721502 ],
                    [  94.41845597679396, 35.68881887614487, 51.18794403510448, 70.83028613215802, 98.56195184258569 ],
                    [  98.68567659306909, 84.37043690374334, 0.2593882104341572, 22.85305413726254, 78.50360511567848 ]
                ]),
                l = new Matrix([
                    [ 1,                  0,                   0,                   0,                  0 ],
                    [ 0.3645532163487085, 1,                   0,                   0,                  0 ],
                    [ 0.9567594734758618, -0.7057067138524908, 1,                   0,                  0 ],
                    [ 0.9242696549806513, -0.4473925697052255, 0.8455948862177756,  1,                  0 ],
                    [ 0.9265915601165076, 0.2412679115623166,  0.07242247557617001, -0.663835514909719, 1 ]
                ]),
                u = new Matrix([
                    [ 98.68567659306909, 84.37043690374334, 0.2593882104341572, 22.85305413726254,   78.50360511567848 ],
                    [ 0,                 63.81318900449351, 49.88888006035377,  59.0037918522814,   -13.98275371042225 ],
                    [ 0,                 0,                 86.14668951263697,  90.60478214138523,   13.58516077456136 ],
                    [ 0,                 0,                 0,                  -41.11066767861502, -39.6055534112669  ],
                    [ 0,                 0,                 0,                  0,                  -67.57575847148999 ]
                ]),
                p = new Matrix([
                    [ 0, 0, 0, 0, 1 ],
                    [ 1, 0, 0, 0, 0 ],
                    [ 0, 0, 0, 1, 0 ],
                    [ 0, 0, 1, 0, 0 ],
                    [ 0, 1, 0, 0, 0 ]
                ]),
                result;
            
            result = mtx.lu();
            
            expect(result).toBeDefined();
            expect(result[0]).toBeDefined();
            expect(result[1]).toBeDefined();
            expect(result[2]).toBeDefined();
            // FIXME: precision is for the draft test
            expect(result[0].equalsWithPrecision(l, 10e-10)).toBe(true);
            expect(result[1].equalsWithPrecision(u, 10e-10)).toBe(true);
            expect(result[2].equalsWithPrecision(p, 10e-10)).toBe(true);
            
        });

    });
});
