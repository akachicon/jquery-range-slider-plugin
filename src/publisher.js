export default class Publisher {
  constructor() {
    this._subscribers = {};

    this._publish = this._publish.bind(this); // TODO: consider 'bindThis' syntax
  }

  subscribe(event, cb) {
    const { _subscribers } = this;

    if (_subscribers[event]) {
      _subscribers[event].push(cb);
    } else {
      _subscribers[event] = [cb];
    }

    return () => {
      this.unsubscribe(event, cb);
    };
  }

  unsubscribe(event, cb) {
    const { _subscribers } = this;
    const evtSubscribers = _subscribers[event];

    if (!evtSubscribers) return;

    _subscribers[event] = evtSubscribers.filter(s => s !== cb);
  }

  _publish(event, ...data) {
    const { _subscribers } = this;

    if (!_subscribers[event]) {
      return;
    }

    _subscribers[event].forEach(cb => cb(...data));
  }
}
