import View from './view-refactor2';

describe('View', () => {
  describe('should create the dom structure on a passed jQeury element', () => {
    describe('containing an element for the track', () => {
      test('which is a div', () => {

      });

      test('which is a child of the root element', () => {

      });

      test('which has \'track\' in its classList', () => { // TODO: css class mention

      });

      describe('containing an element for filling space between the track start and the greater thumb', () => {
        test('which is a div', () => {

        });

        test('which has \'range-outer\' in its classList', () => { // TODO: css class mention

        });

        describe('containing an element for filling space between the track start and the lesser thumb', () => {
          test('which is a div', () => {

          });

          test('which has \'range-inner\' in its classList', () => { // TODO: css class mention

          });
        });
      });
    });

    describe('containing elements for the thumbs', () => {
      test('which are divs', () => {

      });

      test('which are children of the root element', () => {

      });

      test('which have \'thumb\' in their corresponding classLists', () => { // TODO: css class mention

      });
    });

    describe('containing an element for the marks', () => {
      test('which are divs', () => {

      });

      test('which are children of the root element', () => {

      });

      test('which have \'marks\' in its classLists', () => { // TODO: css class mention

      });
    });
  });

  test('should subscribe on a passed model\'s \'update\' event', () => { // TODO: event mention

  });

  describe('should update the dom structure according to the model\'s update data', () => {
  // The assumption is that the initial state rendering is treated as an update in this test section

    test('when { range: true } two thumbs are displayed', () => {

    });

    test('when { range: false } one thumb is displayed', () => {

    });

    describe('when { orientation: h }', () => {
      describe('when { range: true }', () => {
        test('showed thumbs have equal y', () => {

        });

        test('showed thumbs have \'left\' css property value equal to (values[thumbNumber] - min) / (max - min) * trackWidth', () => {

        });
      });

      describe('when { range: false }', () => {
        test('showed thumb have \'left\' css property value equal to (value - min) / (max - min) * trackWidth', () => {

        });
      });
    });

    describe('when { orientation: v }', () => {
      describe('when { range: true }', () => {
        test('showed thumbs have equal x', () => {

        });

        test('showed thumbs have \'top\' css property value equal to (values[thumbNumber] - min) / (max - min) * trackHeight', () => {

        });
      });

      describe('when { range: false }', () => {
        test('showed thumb have \'top\' css property value equal to (value - min) / (max - min) * trackHeight', () => {

        });
      });
    });

    describe('when the marks update comes', () => {
    // There should go tests for marks, maybe it would be possible to share them
    });

    describe('when the hint update comes', () => {
      describe('when { hint: on }', () => {
        describe('the hint appears', () => {
          test('on a thumb\'s mouseover when not dragging', () => {

          });

          test('on the active thumb change when dragging', () => {

          });
        });

        describe('the hint disappears', () => {
          test('on a thumb\'s mouseout when not dragging', () => {

          });

          test('after dragging if the pointer is not in the thumb', () => {

          });

          test('when dragging if the active thumb changes', () => {

          });
        });

        test('the hint doesn\'t disappear on a thumb\'s mouseout when dragging', () => {

        });
      });

      describe('when { hint: off }', () => {
        test('the hint doesn\'t appear in any cases', () => {

        });
      });
    });
  });

  describe('should check user input and publish an update event with the corresponding data', () => { // TODO: event mention
    describe('when track is clicked', () => {
      test('when { range: false } the input data corresponds to \'value\' update', () => {

      });

      describe('when { range: true }', () => {
        test('when the pointer is closer to the lesser thumb the input data corresponds to \'values[0]\' update', () => {

        });

        test('when the pointer is closer to the greater thumb the input data corresponds to \'values[1]\' update', () => {

        });
      });
    });

    describe('when a thumb is dragged', () => {
      test('when { range: false } the input data corresponds to \'value\' update', () => {

      });

      describe('when { range: true }', () => {
        describe('when the lesser thumb is dragged', () => {
          test('before the greater thumb, the input data corresponds to \'values[0]\' update', () => {

          });

          test('after the greater thumb, the input data corresponds to \'values\' update with the value of [values[1], inputData]', () => {

          });
        });

        describe('when the greater thumb is dragged', () => {
          test('before the lesser thumb, the input data corresponds to \'values[1]\' update', () => {

          });

          test('after the lesser thumb, the input data corresponds to \'values\' update with the value of [inputData, values[0]]', () => {

          });
        });
      });
    });
  });

  // destroy
});
