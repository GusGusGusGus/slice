import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { IParticlesProps } from '@tsparticles/angular';
import { Container, Engine, tsParticles } from '@tsparticles/engine';
import { from, mergeMap, Subject, Subscription, takeUntil } from 'rxjs';
import { ParticlesService } from './particles.service';

@Component({
  selector: 'app-particles',
  template: '<div [id]="id"></div>',
})
export class ParticlesComponent implements OnInit, AfterViewInit, OnDestroy  {

  @Input() options?: IParticlesProps;
  @Input() url?: string;
  @Input() id: string;
  @Input() particlesInit?: (engine: Engine) => Promise<void>;
  @Output() particlesLoaded: EventEmitter<Container> = new EventEmitter<Container>();

  private subscription?: Subscription;
  private destroy$ = new Subject<void>();
  private container?: Container;

  constructor(
      @Inject(PLATFORM_ID) protected platformId: string,
      private readonly particlesService: ParticlesService,
  ) {
      this.id = 'tsparticles';
  }

  public ngOnInit() {
      this.subscription = this.particlesService.getInstallationStatus().subscribe(() => {
          this.container?.destroy();
          this.loadParticles();
      });
  }

  public ngAfterViewInit(): void {
      if (isPlatformServer(this.platformId)) {
          return;
      }

      this.loadParticles();
  }

  public ngOnDestroy(): void {
      this.container?.destroy();
      this.subscription?.unsubscribe();
      this.destroy$.next();
  }

  private loadParticles(): void {
      const cb = (container?: Container) => {
          this.container = container;
          this.particlesLoaded.emit(container);
      };

      from(this.particlesInit ? this.particlesInit(tsParticles) : Promise.resolve())
          .pipe(
              mergeMap(() => {
                  return tsParticles.load({ id: this.id, url: this.url, options: this.options });
              }),
              takeUntil(this.destroy$),
          )
          .subscribe(cb);
  }

}
