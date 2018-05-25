import {cse, expandCse} from "./json-with-sharing"
import "jest"

describe('cse tests', () => {
    test('trivial number', () => {
        expect(cse(3)).toEqual(3);
    });

    test('trivial null', () => {
        expect(cse(null)).toEqual(null);
    });

    test('trivial undefined', () => {
        expect(cse(void(0))).toEqual(void(0));
    });

    test('no sharing object', () => {
        expect(cse({foo: 1, bar: 2})).toEqual({foo: 1, bar: 2});
    });

    test('no sharing array', () => {
        expect(cse([1, 2])).toEqual([1, 2]);
    });

    test('simple sharing object', () => {
        expect(cse({foo: [1], bar: [1]})).toEqual({_cse: [[1]], _value: {foo: {_r: 0}, bar: {_r: 0}}});
    });

    test('simple sharing array', () => {
        expect(cse([[1], [1]])).toEqual({_cse: [[1]], _value: [{_r: 0}, {_r: 0}]});
    });

    test('simple shared object', () => {
        expect(cse([{foo: 1}, {foo: 1}])).toEqual({_cse: [{foo: 1}], _value: [{_r: 0}, {_r: 0}]});
    });

    test('nested sharing object', () => {
        expect(cse([{foo: [1], bar: [1]},{foo: [1], bar: [1]}]))
            .toEqual({_cse: [{foo: {_r: 1}, bar: {_r: 1}},[1]], _value: [{_r: 0}, {_r: 0}]});
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

});
