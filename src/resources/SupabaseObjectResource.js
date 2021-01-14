import { supabase, supabaseResourceCache } from "utils/supabase";

import ObservableResource from "./ObservableResource";

export default class SupabaseObjectResource extends ObservableResource {
  single = true;
  constructor(query) {
    super(
      new Promise((resolve, reject) => {
        query.then(({ error, data }) => {
          if (error) {
            reject(error);
          } else {
            if (!this.id) {
              this.id = data[0]?.id;
            }
            resolve({ deleted: false, ...data[0] });
          }
        });
      })
    );
    this.query = query;
    this.table = query.url.pathname.replace("/rest/v1/", "");

    this.id = query.url.search
      .replace(/^\?/i, "")
      .split("&")
      .find((s) => s.startsWith("id="))
      ?.replace("id=eq.", "");
  }

  onNext(data) {
    super.onNext(data);
    for (let other of supabaseResourceCache.values()) {
      if (
        other !== this &&
        other.table === this.table &&
        !other.single &&
        other.data.some((object) => object.id === this.id)
      ) {
        other.data = other.data.map((object) =>
          object.id === this.id ? { ...object, ...data } : object
        );
      }
    }
  }

  async update(update) {
    const { error } = await supabase
      .from(this.table)
      .update(update)
      .eq("id", this.id);
    if (error) {
      throw error;
    } else {
      this.onNext({ ...this.data, ...update });
      return this.data;
    }
  }

  async delete() {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", this.id);
    if (error) {
      throw error;
    } else {
      this.onNext({ ...this.data, deleted: true });
      return this.data;
    }
  }

  refresh() {
    this.query.then(({ data, error }) =>
      error ? this.onError(error) : this.onNext({ deleted: false, ...data[0] })
    );
  }
}
