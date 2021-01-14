import BaseResource from "./BaseResource";

export default class ObservableResource extends BaseResource {
  observers = [];

  constructor(promise) {
    super();
    this.promise = promise
      ? promise
          .then((data) => this.onNext(data))
          .catch((error) => this.onError(error))
      : undefined;
  }

  onNext(data) {
    this.status = "success";
    this.data = data;
    this.observers.forEach(
      ({ onNext }) => typeof onNext === "function" && onNext(this.data)
    );
  }

  onError(error) {
    this.status = "error";
    this.error = error;
    this.observers.forEach(
      ({ onError }) => typeof onError === "function" && onError(this.error)
    );
  }

  observe(onNext, onError) {
    const observer = { onNext, onError };
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((other) => other !== observer);
    };
  }
}
