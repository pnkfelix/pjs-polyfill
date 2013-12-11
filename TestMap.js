function load_lib(n) { load(typeof(libdir)==="undefined" ? n : libdir+"/"+n); }
load_lib("Util.js");

// Test name format:

// map<N>DimArrayOf<G1>sTo<G2>s where <N> is a positive integer (or its
// equivalent word in English) and <G1> and <G2> are both grain types
// (potentially an array themselves.)

function mapOneDimArrayOfUint8() {
  var type = uint8.array(4);
  var i1 = type.build(i => i);
  var r1 = i1.mapPar(j => j*200);
  var r2 = i1.mapPar(1, j => j*200);
  assertTypedEqual(type, r1, new type([0, 200, 400 % 256, 600 % 256]));
  assertTypedEqual(type, r1, r2);
}

function mapOneDimArrayOfUint32() {
  var type = uint32.array(4);
  var i1 = type.build(i => i);
  var r1 = i1.mapPar(j => j*200);
  var r2 = i1.mapPar(1, j => j*200);
  assertTypedEqual(type, r1, new type([0, 200, 400, 600]));
  assertTypedEqual(type, r1, r2);
}

function mapTwoDimArrayOfUint8() {
  var type = uint8.array(4).array(4);
  var i1 = new type([[10, 11, 12, 13],
                     [20, 21, 22, 23],
                     [30, 31, 32, 33],
                     [40, 41, 42, 43]]);

  var r1 = i1.mapPar(2, x => x*2);
  var r2 = i1.mapPar(1, a => a.mapPar(1, x => x*2));
  var r3 = i1.mapPar(1, a => a.mapPar(1, (x, j, c, out) => Handle.set(out, x*2)));
  var r4 = i1.mapPar(1, (a, j, c, out) => { out[0] = a[0]*2;
                                            out[1] = a[1]*2;
                                            out[2] = a[2]*2;
                                            out[3] = a[3]*2; });
  assertTypedEqual(type, r1, new type([[20, 22, 24, 26],
                                       [40, 42, 44, 46],
                                       [60, 62, 64, 66],
                                       [80, 82, 84, 86]]));
  assertTypedEqual(type, r1, r2);
  assertTypedEqual(type, r1, r3);
  assertTypedEqual(type, r1, r4);
}

function mapTwoDimArrayOfUint32() {
  var type = uint32.array(4).array(4);
  var i1 = new type([[10, 11, 12, 13],
                     [20, 21, 22, 23],
                     [30, 31, 32, 33],
                     [40, 41, 42, 43]]);

  var r1 = i1.mapPar(2, x => x*2);
  var r2 = i1.mapPar(1, a => a.mapPar(1, x => x*2));
  var r3 = i1.mapPar(1, a => a.mapPar(1, (x, j, c, out) => Handle.set(out, x*2)));
  var r4 = i1.mapPar(1, (a, j, c, out) => { out[0] = a[0]*2;
                                            out[1] = a[1]*2;
                                            out[2] = a[2]*2;
                                            out[3] = a[3]*2; });
  assertTypedEqual(type, r1, new type([[20, 22, 24, 26],
                                       [40, 42, 44, 46],
                                       [60, 62, 64, 66],
                                       [80, 82, 84, 86]]));
  assertTypedEqual(type, r1, r2);
  assertTypedEqual(type, r1, r3);
  assertTypedEqual(type, r1, r4);
}

var Grain = new StructType({f: uint32});
function wrapG(v) { return new Grain({f: v}); }
function doubleG(g) { return new Grain({f: g.f * 2}); }
function tenG(x, y) { return new Grain({f: x * 10 + y}); }

function mapOneDimArrayOfStructs() {
  var type = Grain.array(4);
  var i1 = type.build(wrapG);
  var r1 = i1.mapPar(doubleG);
  var r2 = i1.mapPar(1, doubleG);
  var r3 = i1.mapPar(1, (g, j, c, out) => { out.f = g.f * 2; });
  assertTypedEqual(type, r1, new type([{f:0}, {f:2},
                                       {f:4}, {f:6}]));
  assertTypedEqual(type, r1, r2);
  assertTypedEqual(type, r1, r3);
}

function mapTwoDimArrayOfStructs() {
  var rowtype = Grain.array(2);
  var type = rowtype.array(2);
  var i1 = type.build(2, tenG);
  var r1 = i1.mapPar(2, doubleG);
  var r2 = i1.mapPar(1, (m) => m.mapPar(1, doubleG));
  var r3 = i1.mapPar(1, (m, j, c, out) => { out[0].f = m[0].f * 2; out[1].f = m[1].f * 2; });
  assertTypedEqual(type, r1, new type([[{f:00}, {f:02}],
                                       [{f:20}, {f:22}]]));
  assertTypedEqual(type, r1, r2);
  assertTypedEqual(type, r1, r3);
}

try {

  mapOneDimArrayOfUint8();
  mapOneDimArrayOfUint32();

  mapTwoDimArrayOfUint8();
  mapTwoDimArrayOfUint32();

  mapOneDimArrayOfStructs();

  mapTwoDimArrayOfStructs();

} catch (e) {
  print(e.name);
  print(e.message);
  print(e.stack);
  throw e;
}
