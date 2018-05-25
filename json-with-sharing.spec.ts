import {cse, expandCse} from "./json-with-sharing"
import "jest"

describe('cse tests', () => {
    test('trivial number', () => {
        expect(cse(3)).toEqual(3);
        expect(cse(3, false)).toEqual(3);
    });

    test('trivial null', () => {
        expect(cse(null)).toEqual(null);
        expect(cse(null, false)).toEqual(null);
    });

    test('trivial undefined', () => {
        expect(cse(void(0))).toEqual(void(0));
        expect(cse(void(0), false)).toEqual(void(0));
    });

    test('no sharing object', () => {
        expect(cse({foo: 1, bar: 2})).toEqual({foo: 1, bar: 2});
        expect(cse({foo: 1, bar: 2}, false)).toEqual({foo: 1, bar: 2});
    });

    test('no sharing array', () => {
        expect(cse([1, 2])).toEqual([1, 2]);
        expect(cse([1, 2], false)).toEqual([1, 2]);
    });

    test('simple sharing object', () => {
        expect(cse({foo: [1], bar: [1]})).toEqual({_cse: [[1]], _value: {foo: {_r: 0}, bar: {_r: 0}}});
        expect(cse({foo: [1], bar: [1]}, false)).toEqual({_cse: [[1]], _value: {foo: {_r: 0}, bar: {_r: 0}}});
    });

    test('simple sharing array', () => {
        expect(cse([[1], [1]])).toEqual({_cse: [[1]], _value: [{_r: 0}, {_r: 0}]});
        expect(cse([[1], [1]], false)).toEqual({_cse: [[1]], _value: [{_r: 0}, {_r: 0}]});
    });

    test('simple shared object', () => {
        expect(cse([{foo: 1}, {foo: 1}])).toEqual({_cse: [{foo: 1}], _value: [{_r: 0}, {_r: 0}]});
        expect(cse([{foo: 1}, {foo: 1}], false)).toEqual({_cse: [{foo: 1}], _value: [{_r: 0}, {_r: 0}]});
    });

    test('nested sharing object', () => {
        expect(cse([{foo: [1], bar: [1]},{foo: [1], bar: [1]}]))
            .toEqual({_cse: [{foo: {_r: 1}, bar: {_r: 1}},[1]], _value: [{_r: 0}, {_r: 0}]});
        expect(cse([{foo: [1], bar: [1]},{foo: [1], bar: [1]}], false))
            .toEqual({_cse: [{foo: {_r: 1}, bar: {_r: 1}},[1]], _value: [{_r: 0}, {_r: 0}]});
    });

    test('exponential example', () => {
        const x1 = [1,1];
        const x2 = [x1,x1];
        const x3 = [x2,x2];
        const x4 = [x3,x3];
        const x5 = [x4,x4];
        const x6 = [x5,x5];
        const x7 = [x6,x6];
        const x8 = [x7,x7];
        const x9 = [x8,x8];
        const x10 = [x9,x9];
        const x11 = [x10,x10];
        const x12 = [x11,x11];
        const x13 = [x12,x12];
        const x14 = [x13,x13];
        const x15 = [x14,x14];
        const x16 = [x15,x15];
        const x17 = [x16,x16];
        const x18 = [x17,x17];
        const x19 = [x18,x18];
        const x20 = [x19,x19];
        expect(cse(x20))
            .toEqual({_cse: [[{_r: 1}, {_r: 1}], [{_r: 2}, {_r: 2}], [{_r: 3}, {_r: 3}], [{_r: 4}, {_r: 4}], [{_r: 5}, {_r: 5}], [{_r: 6}, {_r: 6}], [{_r: 7}, {_r: 7}], [{_r: 8}, {_r: 8}], [{_r: 9}, {_r: 9}], [{_r: 10}, {_r: 10}], [{_r: 11}, {_r: 11}], [{_r: 12}, {_r: 12}], [{_r: 13}, {_r: 13}], [{_r: 14}, {_r: 14}], [{_r: 15}, {_r: 15}], [{_r: 16}, {_r: 16}], [{_r: 17}, {_r: 17}], [{_r: 18}, {_r: 18}], [1, 1]], _value: [{_r: 0}, {_r: 0}]});
    });

});

describe('expandCse tests', () => {
    test('trivial number', () => {
        expect(expandCse(3)).toEqual(3);
    });

    test('trivial null', () => {
        expect(expandCse(null)).toEqual(null);
    });

    test('trivial undefined', () => {
        expect(expandCse(void(0))).toEqual(void(0));
    });

    test('no sharing object', () => {
        expect(expandCse({foo: 1, bar: 2})).toEqual({foo: 1, bar: 2});
    });

    test('no sharing array', () => {
        expect(expandCse([1, 2])).toEqual([1, 2]);
    });

    test('simple sharing object', () => {
        expect(expandCse({_cse: [[1]], _value: {foo: {_r: 0}, bar: {_r: 0}}})).toEqual({foo: [1], bar: [1]});
    });

    test('simple sharing array', () => {
        expect(expandCse({_cse: [[1]], _value: [{_r: 0}, {_r: 0}]})).toEqual([[1], [1]]);
    });

    test('simple shared object', () => {
        expect(expandCse({_cse: [{foo: 1}], _value: [{_r: 0}, {_r: 0}]})).toEqual([{foo: 1}, {foo: 1}]);
    });

    test('nested sharing object', () => {
        expect(expandCse({_cse: [[1],{foo: {_r: 0}, bar: {_r: 0}}], _value: [{_r: 1}, {_r: 1}]}))
            .toEqual([{foo: [1], bar: [1]},{foo: [1], bar: [1]}]);
    });

    test('object identity', () => {
        const t = expandCse({_cse: [[1],{foo: {_r: 0}, bar: {_r: 0}}], _value: [{_r: 1}, {_r: 1}]});
        expect(t[0]).toBe(t[1]);
    });

    test('exponential example', () => {
        const x1 = [1,1];
        const x2 = [x1,x1];
        const x3 = [x2,x2];
        const x4 = [x3,x3];
        const x5 = [x4,x4];
        const x6 = [x5,x5];
        const x7 = [x6,x6];
        const x8 = [x7,x7];
        const x9 = [x8,x8];
        const x10 = [x9,x9];
        const x11 = [x10,x10];
        const x12 = [x11,x11];
        const x13 = [x12,x12];
        const x14 = [x13,x13];
        const x15 = [x14,x14];
        const x16 = [x15,x15];
        const x17 = [x16,x16];
        const x18 = [x17,x17];
        const x19 = [x18,x18];
        const x20 = [x19,x19];

        // The time is taken up by the object equality comparison. Running the test with only this line, runs instantly.
        //expandCse({_cse: [[{_r: 1}, {_r: 1}], [{_r: 2}, {_r: 2}], [{_r: 3}, {_r: 3}], [{_r: 4}, {_r: 4}], [{_r: 5}, {_r: 5}], [{_r: 6}, {_r: 6}], [{_r: 7}, {_r: 7}], [{_r: 8}, {_r: 8}], [{_r: 9}, {_r: 9}], [{_r: 10}, {_r: 10}], [{_r: 11}, {_r: 11}], [{_r: 12}, {_r: 12}], [{_r: 13}, {_r: 13}], [{_r: 14}, {_r: 14}], [{_r: 15}, {_r: 15}], [{_r: 16}, {_r: 16}], [{_r: 17}, {_r: 17}], [{_r: 18}, {_r: 18}], [1, 1]], _value: [{_r: 0}, {_r: 0}]});

        expect(expandCse({_cse: [[{_r: 1}, {_r: 1}], [{_r: 2}, {_r: 2}], [{_r: 3}, {_r: 3}], [{_r: 4}, {_r: 4}], [{_r: 5}, {_r: 5}], [{_r: 6}, {_r: 6}], [{_r: 7}, {_r: 7}], [{_r: 8}, {_r: 8}], [{_r: 9}, {_r: 9}], [{_r: 10}, {_r: 10}], [{_r: 11}, {_r: 11}], [{_r: 12}, {_r: 12}], [{_r: 13}, {_r: 13}], [{_r: 14}, {_r: 14}], [{_r: 15}, {_r: 15}], [{_r: 16}, {_r: 16}], [{_r: 17}, {_r: 17}], [{_r: 18}, {_r: 18}], [1, 1]], _value: [{_r: 0}, {_r: 0}]}))
            .toEqual(x20);
    });

});
