import ObservableResource from "./ObservableResource";

export default class PagedResource extends ObservableResource {
  page = 0;
  hasNext = true;

  constructor(createPromise) {
    super(
      createPromise(0).then(({ data, hasNext }) => {
        this.hasNext = hasNext;
        return data;
      })
    );

    this.createPromise = createPromise;
  }

  async fetchNextPage() {
    this.page++;
    const { data, hasNext } = await this.createPromise(this.page);
    this.hasNext = hasNext;
    this.onNext((this.data || []).concat(data));
  }

  async refresh() {
    const responses = await Promise.all(
      Array(this.page + 1)
        .fill()
        .map((_, page) => this.createPromise(page))
    );

    this.hasNext = responses.every(({ hasNext }) => hasNext);
    this.onNext(responses.flatMap(({ data }) => data));
  }
}
