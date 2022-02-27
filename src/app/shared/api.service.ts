import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SurveyResult } from '../game-board/game-board.component';
import { environment } from './../../environments/environment';

export interface SaveResponse {
  msg: string;
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
}
