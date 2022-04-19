import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SurveyResult } from '../game-board/game-board.component';
import { environment } from './../../environments/environment';

export interface SaveResponse {
  msg: string;
}

export interface Ranking {
  name: string;
  score: string;
  minutes?: string;
  seconds?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  saveForm(formData: SurveyResult): Observable<SaveResponse> {
    const url = `${environment.domain}/save`;
    return this.http.post<SaveResponse>(url, formData);
  }

  getRanking(): Observable<Array<Ranking>> {
    const url = `${environment.domain}/ranking`;
    return this.http.get<Array<Ranking>>(url);
  }
}
