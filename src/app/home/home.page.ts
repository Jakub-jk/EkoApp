import { Component } from '@angular/core';
import { delay } from 'q';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
//import * as particlesJS from '../assets/particles.js';
declare const particlesJS: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public lottieConfig: AnimationOptions= 
  {
    path: 'assets/earth.json',
    renderer: 'svg',
    autoplay: false,
    loop: true
  };;
  public lottieWidth: any;
  private anim: any;
  constructor(private router: Router) {
    particlesJS.load('particles-js', 'assets/particlesjs.json', function() {
      console.log('callback - particles.js config loaded');
    });
    this.lottieWidth = window.innerWidth * 1.5;
  }

  handleAnim(anim: AnimationItem)
  {
    this.anim = anim;
    setTimeout(() => {
      anim.playSegments([[0, 60], [61, 360]], true);
    }, 500);
    
    //anim.onComplete = firstStage();
    //document.querySelector("#earth").children[0].style.animation = "earthAnim .75s ease-out forwards;";
  }

  openApp()
  {
    this.router.navigate(['/main']);
  }

  private first: boolean;
  firstStage()
  {
    this.anim.loop = true;
    this.anim.play([120, 360]);
  }
}
