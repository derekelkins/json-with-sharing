## JSON with sharing

`cse(someJson)` performs common subexpression elimination producing a new JSON object with a `_cse` field
holding an array of JSON objects or arrays. Non-atomic subexpressions that are used multiple times are replaced
with a `{"_r": n}` object where `n` is an index into the `_cse` array.

`expandCse(someJson)` creates a JavaScript object corresponding to the JSON object with all subexpressions
inlined, but it maintains the sharing represented by the common subexpressions. That is, each object or array
in the `_cse` field is represented by a single JavaScript object.

`expandCse(cse(someJson))` is structurally identical to `someJson` but may require exponentially
less space. In particular, `stringify`-ing the result of `cse(someJson)` may be exponentially smaller
than `stringify`-ing `someJson`.
