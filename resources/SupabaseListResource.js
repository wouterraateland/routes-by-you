import { supabase, supabaseResourceCache } from "utils/supabase";

import ObservableResource from "./ObservableResource";

export default class SupabaseListResource extends ObservableResource {
  single = false;

  constructor(query) {
    super(
      new Promise((resolve, reject) => {
        query.then(({ error, data }) =>
          error
            ? reject(error)
            : resolve(data.map((row) => ({ deleted: false, ...row })))
        );
      })
    );
    this.query = query;
    this.table = query.url.pathname.replace("/rest/v1/", "");
  }

  onNext(data) {
    super.onNext(data);
    for (let other of supabaseResourceCache.values()) {
      if (
        other !== this &&
        other.table === this.table &&
        other.single &&
        data.some((object) => object.id === other.id)
      ) {
        other.data = {
          ...other.data,
          ...this.data.find((object) => object.id === other.id),
        };
      }
    }
  }

  refresh() {
    this.query
      .then((res) =>
        this.onNext(res.data.map((data) => ({ deleted: false, ...data })))
      )
      .catch(({ error }) => this.onError(error));
  }

  getData() {
    return this.data.filter((object) => !object.deleted);
  }

  async update(objectIds, update) {
    const { error } = await supabase
      .from(this.table)
      .update(update)
      .in("id", objectIds);
    if (error) {
      throw error;
    } else {
      this.onNext(
        this.data.map((object) =>
          objectIds.includes(object.id) ? { ...object, ...update } : object
        )
      );
      return this.data;
    }
  }

  async delete(objectIds) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .in("id", objectIds);
    if (error) {
      throw error;
    } else {
      this.onNext(this.data.filter((object) => !objectIds.includes(object.id)));
      return this.data;
    }
  }
}
