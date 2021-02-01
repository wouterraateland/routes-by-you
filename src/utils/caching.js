export class Cache {
  data = {};

  read(key, onMiss) {
    if (!(key in this.data)) {
      this.data[key] = onMiss();
    }
    return this.data[key];
  }

  clear() {
    this.data = {};
  }
}
