import BaseResource from "./BaseResource";

export default class AsyncResource extends BaseResource {
  constructor(promise) {
    super();
    this.promise = promise
      .then((data) => {
        this.status = "success";
        this.data = data;
      })
      .catch((error) => {
        this.status = "error";
        this.error = error;
      });
  }
}
