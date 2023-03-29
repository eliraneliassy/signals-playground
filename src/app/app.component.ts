import { interval } from 'rxjs';
import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { fromObservable } from 'src/from-observable';
import { fromSignal } from 'src/from-signal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  state = signal({
    counter: 0
  });

  state$ = fromSignal(this.state)

  doubleCounter = computed(() => this.state().counter * 2)

  timer$ = interval(1000);

  timer = fromObservable(this.timer$, 0);

  ngOnInit(): void {
    effect(() => console.log('counter is', this.state().counter))
  }


  plus() {
    // this.counter.set(100);

    // this.state.update((state) => ({ ...state, counter: state.counter + 1 }))

    this.state.mutate((state) => state.counter = state.counter + 1)
  }


}
