export default class {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, cb) {
    const { subscribers } = this;

    if (subscribers[event]) {
      subscribers.push(cb);
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

  publish(event, data) {
    this.subscribers[event].forEach(cb => cb(data));
  }
}
