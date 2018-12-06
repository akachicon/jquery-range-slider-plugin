import {
  min,
  max,
  step,
  orientation,
  value,
  values,
  marks
} from './refiners';

describe('refiners', () => {
  test('min', () => {
    expect(min(
      { min: -10, max: 10 },
      { min: 0, max: 5 }
    )).toBe(-10);

    expect(min(
      { min: 1, max: 10 },
      { min: 0, max: 5 }
    )).toBe(1);

    expect(min(
      { min: 1 },
      { min: 0, max: 5 }
    )).toBe(1);

    expect(min(
      { min: 6, max: 10 },
      { min: 0, max: 5 }
    )).toBe(6);

    expect(min(
      { min: 6 },
      { min: 0, max: 5 }
    )).toBe(null);

    ['x', undefined, null, false, {}, Symbol(1), () => {}].forEach((type) => {
      expect(min(
        { min: type },
        { min: 0, max: 5 }
      )).toBe(null);
    });
  });

  test('max', () => {
    expect(max(
      { min: -10, max: 10 },
      { min: 0, max: 5 }
    )).toBe(10);

    expect(max(
      { min: -10, max: 4 },
      { min: 0, max: 5 }
    )).toBe(4);

    expect(max(
      { max: 4 },
      { min: 0, max: 5 }
    )).toBe(4);

    expect(max(
      { min: -5, max: -1 },
      { min: 0, max: 5 }
    )).toBe(-1);

    expect(max(
      { max: -1 },
      { min: 0, max: 5 }
    )).toBe(null);

    ['x', undefined, null, false, {}, Symbol(1), () => {}].forEach((type) => {
      expect(max(
        { max: type },
        { min: 0, max: 5 }
      )).toBe(null);
    });
  });

  test('step', () => {
    expect(step(
      { step: 2 },
      { step: 1 }
    )).toBe(2);

    expect(step(
      { step: -1 },
      { step: 1 }
    )).toBe(null);

    ['x', undefined, null, false, {}, Symbol(1), () => {}].forEach((type) => {
      expect(step(
        { step: type },
        { step: 1 }
      )).toBe(null);
    });
  });

  test('orientation', () => {
    expect(orientation(
      { orientation: 'h' },
      { orientation: 'v' }
    )).toBe('h');

    expect(orientation(
      { orientation: 'v' },
      { orientation: 'h' }
    )).toBe('v');

    ['x', undefined, null, false, {}, Symbol(1), () => {}].forEach((type) => {
      expect(orientation(
        { orientation: type },
        { orientation: 'h' }
      )).toBe(null);
    });
  });

  test('value', () => {
    ['x', undefined, null, false, {}, Symbol(1), () => {}].forEach((type) => {
      expect(value(
        {
          value: type,
          min: -10,
          max: 10,
          step: 1
        },
        { value: 0 }
      )).toBe(0);

      expect(value(
        {
          value: type,
          min: -10,
          max: 10,
          step: 1
        },
        { value: -11 }
      )).toBe(-10);

      expect(value(
        {
          value: type,
          min: -10,
          max: 10,
          step: 1
        },
        { value: 11 }
      )).toBe(10);
    });

    expect(value(
      {
        value: 5,
        min: -10,
        max: 10,
        step: 1
      },
      { value: 0 },
    )).toBe(5);

    expect(value(
      {
        value: -11,
        min: -10,
        max: 10,
        step: 1
      },
      { value: 0 },
    )).toBe(-10);

    expect(value(
      {
        value: 11,
        min: -10,
        max: 10,
        step: 1
      },
      { value: 0 }
    )).toBe(10);

    expect(value(
      {
        value: 2.5,
        min: -10,
        max: 10,
        step: 0.5
      },
      { value: 0 }
    )).toBe(2.5);

    expect(value(
      {
        value: 2.7,
        min: -10,
        max: 10,
        step: 0.5
      },
      { value: 0 }
    )).toBe(2.5);

    expect(value(
      {
        value: 2.8,
        min: -10,
        max: 10,
        step: 0.5
      },
      { value: 0 }
    )).toBe(3);

    expect(value(
      {
        value: 2.5,
        min: -10,
        max: 10,
        step: 100
      },
      { value: 0 }
    )).toBe(-10);
  });

  test('values', () => {
    let incoming;
    let current;
    let executed;

    ['x', undefined, null, false, {}, [], Symbol(1), () => {}].forEach((type) => {
      incoming = [type, 5];
      current = [0, 0];
      executed = values(
        {
          values: incoming,
          min: -10,
          max: 10,
          step: 1
        },
        { values: current }
      );

      expect(executed).toEqual([0, 5]);
      expect(executed).not.toBe(incoming);
      expect(executed).not.toBe(current);

      incoming = [-5, type];
      current = [0, 0];
      executed = values(
        {
          values: incoming,
          min: -10,
          max: 10,
          step: 1
        },
        { values: current }
      );

      expect(executed).toEqual([-5, 0]);
      expect(executed).not.toBe(incoming);
      expect(executed).not.toBe(current);

      incoming = [type, type];
      current = [-1, 1];
      executed = values(
        {
          values: incoming,
          min: -10,
          max: 10,
          step: 1
        },
        { values: current }
      );

      expect(executed).toEqual([-1, 1]);
      expect(executed).not.toBe(incoming);
      expect(executed).not.toBe(current);

      incoming = type;
      current = [-11, 1];
      executed = values(
        {
          values: incoming,
          min: -10,
          max: 10,
          step: 1
        },
        { values: current }
      );

      expect(executed).toEqual([-10, 1]);
      expect(executed).not.toBe(incoming);
      expect(executed).not.toBe(current);
    });

    incoming = 2;
    current = [-11, 1];
    executed = values(
      {
        values: incoming,
        min: -10,
        max: 10,
        step: 1
      },
      { values: current }
    );

    expect(executed).toEqual([-10, 1]);
    expect(executed).not.toBe(current);

    incoming = [-11, 11];
    current = [0, 0];
    executed = values(
      {
        values: incoming,
        min: -10,
        max: 10,
        step: 1
      },
      { values: current }
    );

    expect(executed).toEqual([-10, 10]);
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);

    incoming = [5, -5];
    current = [0, 0];
    executed = values(
      {
        values: incoming,
        min: -10,
        max: 10,
        step: 1
      },
      { values: current }
    );

    expect(executed).toEqual([-5, 5]);
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);

    incoming = [5, 12];
    current = [0, 0];
    executed = values(
      {
        values:
        incoming,
        min: -10,
        max: 10,
        step: 1
      },
      { values: current }
    );

    expect(executed).toEqual([5, 10]);
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);

    incoming = [5.2, 5.3];
    current = [0, 0];
    executed = values(
      {
        values:
        incoming,
        min: -10,
        max: 10,
        step: 0.5
      },
      { values: current }
    );

    expect(executed).toEqual([5, 5.5]);
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);

    incoming = [-1.3, -1.2];
    current = [0, 0];
    executed = values(
      {
        values:
        incoming,
        min: -10,
        max: 10,
        step: 0.5
      },
      { values: current }
    );

    expect(executed).toEqual([-1.5, -1]);
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);

    incoming = [-1.2, -1.3];
    current = [0, 0];
    executed = values(
      {
        values:
        incoming,
        min: -10,
        max: 10,
        step: 0.5
      },
      { values: current }
    );

    expect(executed).toEqual([-1.5, -1]);
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);
  });

  test('marks', () => {
    let incoming;
    let current;
    let executed;

    ['x', undefined, null, false, 2, Symbol(1), () => {}].forEach((type) => {
      incoming = type;
      current = {};
      executed = marks(
        { marks: incoming, min: -10, max: 10 },
        { marks: current }
      );

      expect(executed).toEqual({});
      expect(executed).not.toBe(incoming);
      expect(executed).not.toBe(current);
    });

    incoming = {
      '-11': 'a',
      '-5': 'b',
      0: 'c',
      5: 'd',
      11: 'e'
    };
    current = {};
    executed = marks(
      { marks: incoming, min: -10, max: 10 },
      { marks: current }
    );

    expect(executed).toEqual({
      '-5': 'b',
      0: 'c',
      5: 'd'
    });
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);

    const nested = { some: 'data' };

    incoming = {
      0: nested
    };
    current = {};
    executed = marks(
      { marks: incoming, min: -10, max: 10 },
      { marks: current }
    );

    expect(executed).toEqual({
      0: {
        some: 'data'
      }
    });
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);
    expect(executed.nested).not.toBe(nested);

    incoming = {
      '-1.05': 'negative',
      0.5: 'fractional'
    };
    current = {};
    executed = marks(
      { marks: incoming, min: -10, max: 10 },
      { marks: current }
    );

    expect(executed).toEqual({
      '-1.05': 'negative',
      0.5: 'fractional'
    });
    expect(executed).not.toBe(incoming);
    expect(executed).not.toBe(current);
  });
});
