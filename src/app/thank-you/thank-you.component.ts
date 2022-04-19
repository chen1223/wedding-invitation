import { Component, NgZone, OnInit } from '@angular/core';
import { ApiService, Ranking } from './../shared/api.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  currentUser: string = '';
  ranking: Array<Ranking> = [];

  constructor(
    private apiService: ApiService,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.currentUser = sessionStorage.getItem('currentUser') || '';
    this.getRanking();
  }

  getRanking(): void {
    this.apiService.getRanking().subscribe(
      list => {
        this.ranking = [...list];
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
          const currentUsr = document.getElementById('current');
          if (currentUsr) {
            currentUsr.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        });
      },
      err => {
        console.error('Failed to load ranking list.');
      }
    );
  }
}
