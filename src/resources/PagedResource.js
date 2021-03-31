import ObservableResource from "./ObservableResource";

export default class PagedResource extends ObservableResource {
  hasNext = true;

  constructor(limit, createPromise) {
    super(
      createPromise(0, limit).then(({ data, hasNext }) => {
        this.hasNext = hasNext;
        return data;
      })
    );

    this.limit = limit;
    this.createPromise = createPromise;
  }

  async fetchNextPage() {
    const { data, hasNext } = await this.createPromise(
      this.data?.length ?? 0,
      this.limit
    );
    this.hasNext = hasNext;
    this.onNext((this.data || []).concat(data));
  }

  async refresh() {
    const { data, hasNext } = await this.createPromise(
      0,
      this.data?.length ?? 0
    );

    this.hasNext = hasNext;
    this.onNext(data);
  }
}
