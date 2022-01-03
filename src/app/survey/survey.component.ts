import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyAnser } from '../game-board/game-board.component';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  surveyAnswers: SurveyAnser = {
    q1: null,
    q2: null,
    q3: null,
    q4: {
      a1: 0,
      a2: 0,
      a3: 0
    },
    q5: null
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadAnswers();
  }

  loadAnswers(): void {
    const answers = localStorage.getItem('gameAnswer');
    if (answers) {
      this.surveyAnswers = JSON.parse(answers);
    }
    console.log(this.surveyAnswers);
  }
}
