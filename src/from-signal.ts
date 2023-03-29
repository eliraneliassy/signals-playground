/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef, effect, inject, runInInjectionContext, Signal} from '@angular/core';
import {Observable} from 'rxjs';


/**
 * Exposes the value of an Angular `Signal` as an RxJS `Observable`.
 *
 * The signal's value will be propagated into the `Observable`'s subscribers using an `effect`.
 *
 * `fromSignal` must be called in an injection context.
 *
 * @developerPreview
 */
export function fromSignal<T>(source: Signal<T>): Observable<T> {
  

  // TODO(alxhub): currently `effect` requires an injection context, so we use the application
  // injector here to create a "long-lived" effect. Really we want an effect that doesn't
  // automatically clean itself up. That will allow us to drop the `inject` requirement.
  const appInjector = inject(ApplicationRef).injector;

  // Creating a new `Observable` allows the creation of the effect to be lazy. This allows for all
  // references to `source` to be dropped if the `Observable` is fully unsubscribed and thrown away.
  return new Observable<T>(observer => {
    const watcher = runInInjectionContext(appInjector, () => {
      return effect(() => {
        try {
          observer.next(source());
        } catch (err) {
          observer.error(err);
        }
      });
    });

    return () => watcher.destroy();
  });
}