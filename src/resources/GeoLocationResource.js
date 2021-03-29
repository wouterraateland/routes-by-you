import ObservableResource from "./ObservableResource";

export default class GeoLocationResource extends ObservableResource {
  resolve = null;
  reject = null;

  constructor() {
    super(undefined);

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    if (typeof window !== "undefined") {
      if (!navigator.geolocation) {
        this.onNext({ permission: "denied", position: null });
        this.resolve();
      } else {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permission) => {
            if (permission.state === "granted") {
              this.refresh().then(() => this.resolve());
            } else {
              this.onNext({ permission: permission.state, position: null });
              this.resolve();
            }
          });
      }
    }
  }

  async refresh() {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      this.onNext({ permission: "granted", position });
    } catch (error) {
      console.log(error);
      if (error.code === error.PERMISSION_DENIED) {
        this.onNext({ permission: "denied", position: null });
      }
    }
  }

  async grant() {
    await this.refresh();
  }

  deny() {
    this.onNext({ permission: "denied", position: null });
  }
}

export const geoLocationResource = new GeoLocationResource();
