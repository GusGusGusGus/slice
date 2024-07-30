import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Engine, tsParticles } from '@tsparticles/engine';

@Injectable({
    providedIn: 'root',
})
export class ParticlesService {
    private initialized = new BehaviorSubject<boolean>(false);

    getInstallationStatus() {
        return this.initialized.asObservable();
    }

    async init(particlesInit: (engine: Engine) => Promise<void>) {
        await particlesInit(tsParticles);

        this.initialized.next(true);
    }
}