import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';
import {
  Container,
  Engine,
  ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { ParticlesService } from './particles/particles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The AskMyCV app';
  users: any;

  // id = "tsparticles";
  // particlesUrl = "../assets/particles.json";
  // particlesOptions: ISourceOptions = {
  //   particleCount: 10,
  //   spread: 70,
  //   origin: { y: 0.6 }
  // };

  constructor(
    private accountService: AccountService, 
    private presence: PresenceService,
    private readonly ngParticlesService: ParticlesService ) {}
  
  ngOnInit() {
   this.setCurrentUser();
    // void this.ngParticlesService.init(async (engine: Engine) => {
    //   console.log("init", engine);
    //   await loadSlim(engine);
    // });
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user){
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
  }

  // public particlesLoaded(container: Container): void {
  //   console.log("loaded", container);
  // }

  
}
