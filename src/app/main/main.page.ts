import { Component, OnInit } from '@angular/core';
import * as info from '../../assets/info.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor() {  }

  ngOnInit() {
    //console.log(info);
    document.getElementById("info").innerText = info[Math.floor(Math.random() * Number(info[0])) + 1];
  }

}
