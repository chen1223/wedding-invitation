import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyAnser } from '../game-board/game-board.component';
import { Attend, GuestFrom, InvitationType, Relation } from '../shared/survey.model';

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

  surveyForm = this.fb.group({
    name: [null,[Validators.required]],
    guestFrom: [null, [Validators.required]],
    relation: [null, [Validators.required]],
    attend: [null, [Validators.required]],
    attendNo: [null, [Validators.required]],
    vegeNo: [null, [Validators.required]],
    childSeatNo: [null, [Validators.required]],
    invitationType: [null, [Validators.required]],
    address: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    email: [null, [Validators.required]],
    note: [null]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadAnswers();
  }

  loadAnswers(): void {
    const answers = localStorage.getItem('gameAnswer');
    if (answers) {
      this.surveyAnswers = JSON.parse(answers);
    }
    console.log(this.surveyAnswers);
    const formData = {
      guestFrom: this.surveyAnswers.q1 === 'A' ? GuestFrom.BRIDEGROOM : GuestFrom.BRIDE,
      relation: '',
      attend: this.surveyAnswers.q3 === 'A' ? Attend.YES : Attend.NO,
      attendNo: this.surveyAnswers.q4.a1,
      vegeNo: this.surveyAnswers.q4.a2,
      childSeatNo: this.surveyAnswers.q4.a3,
      invitationType: ''
    };
    // Guest From
    switch (this.surveyAnswers.q2) {
      case 'A': {
        formData.relation = Relation.FAMILY;
        break;
      }
      case 'B': {
        formData.relation = Relation.CLASSMATE;
        break;
      }
      case 'C': {
        formData.relation = Relation.WORK_COLLEAGUE
        break;
      }
      case 'D': {
        formData.relation = Relation.OTHERS;
      }
    }
    // Invitation Type
    switch (this.surveyAnswers.q5) {
      case 'A': {
        formData.invitationType = InvitationType.PAPER;
        break;
      }
      case 'B': {
        formData.invitationType = InvitationType.DIGITAL;
        break;
      }
      case 'C': {
        formData.invitationType = InvitationType.SKIP;
        break;
      }
    }
    this.surveyForm.patchValue(formData);
    this.onAttendChange();
    this.onInvitationTypeChange();
  }

  // On attend changes, update attendNo
  onAttendChange(): void {
    const attend = this.surveyForm.get('attend')?.value;
    const attendRow = document.querySelector('.row.--attend');
    const vegeRow = document.querySelector('.row.--vege-no');
    const chairRow = document.querySelector('.row.--child-chair');
    if (attend === Attend.YES) {
      // Make attend no required
      this.surveyForm.get('attendNo')?.addValidators([Validators.required]);
      this.surveyForm.get('attendNo')?.updateValueAndValidity();
      this.surveyForm.get('attendNo')?.enable();
      attendRow?.classList.add('required');

      // Make vege no required
      this.surveyForm.get('vegeNo')?.addValidators([Validators.required]);
      this.surveyForm.get('vegeNo')?.updateValueAndValidity();
      this.surveyForm.get('vegeNo')?.enable();
      vegeRow?.classList.add('required');

      // Make child chair required
      this.surveyForm.get('childSeatNo')?.addValidators([Validators.required]);
      this.surveyForm.get('childSeatNo')?.updateValueAndValidity();
      this.surveyForm.get('childSeatNo')?.enable();
      chairRow?.classList.add('required');
    } else {
      // Make attend no optional
      this.surveyForm.get('attendNo')?.removeValidators(Validators.required);
      this.surveyForm.get('attendNo')?.updateValueAndValidity();
      this.surveyForm.get('attendNo')?.setValue(0);
      this.surveyForm.get('attendNo')?.disable();
      attendRow?.classList.remove('required');

      // Make vege no optional
      this.surveyForm.get('vegeNo')?.removeValidators(Validators.required);
      this.surveyForm.get('vegeNo')?.updateValueAndValidity();
      this.surveyForm.get('vegeNo')?.setValue(0);
      this.surveyForm.get('vegeNo')?.disable();
      vegeRow?.classList.remove('required');

      // Make child seat no optional
      this.surveyForm.get('childSeatNo')?.removeValidators(Validators.required);
      this.surveyForm.get('childSeatNo')?.updateValueAndValidity();
      this.surveyForm.get('childSeatNo')?.setValue(0);
      this.surveyForm.get('childSeatNo')?.disable();
      chairRow?.classList.remove('required');
    }
  }

  // On invitation type changes, update address validation
  onInvitationTypeChange(): void {
    const invitationType = this.surveyForm.get('invitationType')?.value;
    const addressRow = document.querySelector('.row.--address');
    switch (invitationType) {
      case InvitationType.PAPER: {
        this.surveyForm.get('address')?.addValidators([Validators.required]);
        this.surveyForm.get('address')?.updateValueAndValidity();
        this.surveyForm.get('address')?.enable();
        addressRow?.classList.add('required');
        break;
      }
      case InvitationType.DIGITAL: {
        this.surveyForm.get('address')?.removeValidators(Validators.required);
        this.surveyForm.get('address')?.updateValueAndValidity();
        this.surveyForm.get('address')?.disable();
        addressRow?.classList.remove('required');
        break;
      }
      case InvitationType.SKIP: {
        this.surveyForm.get('address')?.removeValidators(Validators.required);
        this.surveyForm.get('address')?.updateValueAndValidity();
        this.surveyForm.get('address')?.disable();
        addressRow?.classList.remove('required');
        break;
      }
    }
  }

  // Submit form
  submitForm(): void {
    const data = this.surveyForm.getRawValue();
    console.log('data', data);
  }
}
