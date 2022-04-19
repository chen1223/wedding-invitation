import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private router: Router) {}

  ngOnInit(): void {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          const body = document.querySelector('body');
          if (event.url === '/') {
            body?.classList.add('in-game');
          } else {
            body?.classList.remove('in-game');
          }
        }
      })
  }
}
