// import {
//   marks,
// } from './refiners';
//
// describe('refiners', () => {
//   test('\'marks\' should filter props according to provided min/max', () => {
//     let result;
//     let current = {
//       10: 'valid_state'
//     };
//     let next = {
//       marks: {
//         '-15': '0',
//         '-10': '',
//         '-5': '1',
//         excluded: 'property',
//         0: { zero: 'O' },
//         5.15: '5',
//         10: 'mark10',
//         11: 'excluded'
//       },
//       min: -10,
//       max: 10
//     };
//
//     result = marks(next, current);
//
//     expect(result).toEqual({
//       '-10': '',
//       '-5': '1',
//       0: { zero: 'O' },
//       5.15: '5',
//       10: 'mark10',
//     });
//   });
// });
