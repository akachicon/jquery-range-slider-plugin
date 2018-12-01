export default class Publisher {
  constructor() {
    this.subscribers = {};

    this._publish = this._publish.bind(this); // TODO: consider 'bindThis' syntax
  }

  subscribe(event, cb) {
    const { subscribers } = this;

    if (subscribers[event]) {
      subscribers[event].push(cb);
    } else {
      subscribers[event] = [cb];
    }

    return () => {
      this.unsubscribe(event, cb);
    };
  }

  unsubscribe(event, cb) {
    const { subscribers } = this;
    const cbArr = subscribers[event];

    subscribers[event] = cbArr.filter(s => s !== cb);
  }

  _publish(event, ...data) {
    const { subscribers } = this;

    if (!subscribers[event]) {
      return;
    }

    subscribers[event].forEach(cb => cb(...data));
  }
}
