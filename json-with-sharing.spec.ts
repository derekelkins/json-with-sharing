import {cse} from "./json-with-sharing"
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
});
