import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameBoardComponent } from './game-board/game-board.component';
import { SurveyComponent } from './survey/survey.component';

const routes: Routes = [
  {
    path: 'final',
    component: SurveyComponent
  },
  {
    path: '**',
    component: GameBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
