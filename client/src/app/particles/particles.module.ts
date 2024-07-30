import { NgModule } from '@angular/core';
import type { ISourceOptions } from '@tsparticles/engine';
import { ParticlesComponent } from './particles.component';
import { ParticlesService } from './particles.service';

@NgModule({
    declarations: [ParticlesComponent],
    exports: [ParticlesComponent],
    providers: [ParticlesService],
})
export class ParticlesModule {}

export type IParticlesProps = ISourceOptions;
export { ParticlesService };