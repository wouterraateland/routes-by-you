import ObservableResource from "./ObservableResource";

export default class ConstResource extends ObservableResource {
  constructor(value) {
    super();
    this.status = "success";
    this.data = value;
  }
}
