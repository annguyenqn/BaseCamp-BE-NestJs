import { HttpStatus, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';
import { AppConstant } from './common/constants';

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  private shutdownListener$: Subject<void> = new Subject();

  onModuleDestroy() {
    console.log('Executing OnDestroy Hook');
  }

  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  shutdown() {
    // AppConstant.APPLICATION_READY_STATE = HttpStatus.SERVICE_UNAVAILABLE;
    // AppConstant.APPLICATION_READY_STATE = true
    console.log('Service is shutting down...');
    this.shutdownListener$.next();
  }
}
