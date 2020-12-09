export default class BaseResource {
  data = undefined;
  status = "pending";
  error = undefined;
  promise = null;

  read() {
    switch (this.status) {
      case "pending":
        throw this.promise;
      case "error":
        throw this.error;
      default:
        return this.data;
    }
  }
}
