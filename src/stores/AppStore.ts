// src/stores/CounterStore.ts
import { makeAutoObservable } from "mobx";

class AppStore {
  count = 0;

  constructor() {
    // Automatically makes all properties observable and methods actions
    makeAutoObservable(this);
  }

  // Action: Methods that modify state
  increment = () => {
    this.count += 1;
  };

  decrement = () => {
    this.count -= 1;
  };

  // Computed: Derived state that updates only when dependencies change
  get doubleCount() {
    return this.count * 2;
  }
}

export default new AppStore();
