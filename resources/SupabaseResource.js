import AsyncResource from "./AsyncResource";

export default class SupabaseResource extends AsyncResource {
  constructor(query) {
    super(
      new Promise((resolve, reject) => {
        query.then(resolve).catch(reject);
      })
    );
  }
}
