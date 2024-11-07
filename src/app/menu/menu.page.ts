import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  isMobile: boolean = false;

  constructor() { }

  ngOnInit() {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  downloadAPK() {
    const apkUrl = 'https://ih1.redbubble.net/image.515131945.0175/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg';
    window.location.href = apkUrl;
  }
}
