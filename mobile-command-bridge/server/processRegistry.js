class ProcessRegistry {
  constructor() {
    this.running = new Map();
  }

  set(requestId, child) {
    this.running.set(requestId, child);
  }

  has(requestId) {
    return this.running.has(requestId);
  }

  kill(requestId) {
    const child = this.running.get(requestId);
    if (!child) {
      return false;
    }

    child.kill();
    this.running.delete(requestId);
    return true;
  }

  delete(requestId) {
    this.running.delete(requestId);
  }
}

module.exports = {
  ProcessRegistry
};
