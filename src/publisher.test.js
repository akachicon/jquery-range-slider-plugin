import Publisher from './publisher';

describe('Publisher', () => {
  test('allows to subscribe to an event via subscribe(event, callback)', () => {
    new Publisher().subscribe('event', () => {});
  });

  test('invokes a subscriber\'s callback whenever _publish(event) is called', () => {
    const publisher = new Publisher();
    const cb1 = jest.fn();
    const cb2 = jest.fn();

    publisher.subscribe('event_1', cb1);
    publisher.subscribe('event_1', cb2);
    publisher.subscribe('event_2', cb2);

    publisher._publish('event_1');
    publisher._publish('event_2');

    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(2);
  });

  test('method _publish() can be called without context', () => {
    const publisher = new Publisher();
    const cb = jest.fn();
    const { _publish } = publisher;

    publisher.subscribe('event', cb);

    _publish('event');

    expect(cb).toHaveBeenCalledTimes(1);
  });

  describe('allows to unsubscribe from the event', () => {
    test('via unsubscribe(event, callback)', () => {
      const publisher = new Publisher();
      const cb1 = jest.fn();
      const cb2 = jest.fn();

      publisher.subscribe('event', cb1);
      publisher.subscribe('event', cb2);

      publisher.unsubscribe('event', cb1);

      publisher._publish('event');

      expect(cb1).toHaveBeenCalledTimes(0);
      expect(cb2).toHaveBeenCalledTimes(1);
    });

    test('via subscribe() method\'s returned value', () => {
      const publisher = new Publisher();
      const cb1 = jest.fn();
      const cb2 = jest.fn();

      const unsubscribeCb1 = publisher.subscribe('event', cb1);

      publisher.subscribe('event', cb2);

      unsubscribeCb1();

      publisher._publish('event');

      expect(cb1).toHaveBeenCalledTimes(0);
      expect(cb2).toHaveBeenCalledTimes(1);
    });
  });
});
