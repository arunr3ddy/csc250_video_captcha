import { Component } from '@angular/core';
import { UploadImageService } from './Shared/upload-image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Captach';
  nameerror = false;
  ageerror = false;
  mobileerror = false;
  emailerror = false;
  result: any = [];
  ShowForm = true;
  FailurCaptach = false;
  input: any;
  Submit = false;
  Captach: FormGroup;
  info: FormGroup;
  dropdowndata: any = [];
  image: any;
  data1: any;
  topping: any;
  SuccessCaptach = false;
  numberOfTimes = 0;
  temp: any = [];
  randomNumber1 = Math.floor(Math.random() * 10) + 1;
  randomNumber2 = Math.floor(Math.random() * 10) + 1;
  toppings = new FormControl();
  options: string[];
  filteredOptions: Observable<string[]>;
  constructor(private restDataServices: UploadImageService) {
    this.info = new FormGroup({
      'Name': new FormControl(''),
      'Age': new FormControl(''),
      'Mobile': new FormControl,
      'Email': new FormControl('')
    })
    this.restDataServices.GetDropDown().subscribe(
      resp => {
        this.dropdowndata = [];
        this.data1 = resp['data'];
        var res;
        this.data1.forEach(element => {
          res = element['Tags'].split(",");
          res.forEach(da => {
            this.dropdowndata.push(da);
          });
        });
        this.temp = [];
        this.temp = this.dropdowndata;
        this.temp.sort();
        this.options = [];
        for (let i = 0; i < this.temp.length; i++) {
          if (this.options.indexOf(this.temp[i]) === -1) {
            this.options.push(this.temp[i]);
          }
        }
      });
  }
  Capt() {
    var object = {};
    object['value'] = this.toppings['value'];
    object['ID'] = this.randomNumber1;
    this.restDataServices.CheckCaptacha(object).subscribe(resp => {
      this.data1 = resp['data'][0]['Tags'];
      this.result = [];
      this.result = this.data1.split(",");
      this.input = [];
      this.input = this.toppings['value'];
      this.comp(this.result, this.input)
    });
  }
  CaptachaCount = 1;
  count = 0;
  infoModel: any = {};
  comp(result, input) {
    this.count = 0;
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < input.length; j++) {
        if (result[i] == input[j]) {
          this.count++;
        }
      }
    }
    if (this.count == 3) {
      if (this.info.controls['Name'].value == '' || this.info.controls['Name'].value == null || this.info.controls['Name'].value == undefined) {
        this.nameerror = true;
      }
      else {
        this.infoModel.Name = this.info.controls['Name'].value;
        this.nameerror = false;
      }
      if (this.info.controls['Age'].value == '' || this.info.controls['Age'].value == null || this.info.controls['Age'].value == undefined) {
        this.ageerror = true;
      }
      else {
        this.infoModel.Age = this.info.controls['Age'].value;
        this.ageerror = false;
      }
      if (this.info.controls['Mobile'].value == '' || this.info.controls['Mobile'].value == null || this.info.controls['Mobile'].value == undefined) {
        this.mobileerror = true;
      }
      else {
        this.infoModel.Mobile = this.info.controls['Mobile'].value;
        this.mobileerror = false;
      }
      if (this.info.controls['Email'].value == '' || this.info.controls['Email'].value == null || this.info.controls['Email'].value == undefined) {
        this.emailerror = true;
      }
      else {
        this.infoModel.Email = this.info.controls['Email'].value;
        this.emailerror = false;
      }
      if (!this.emailerror && !this.nameerror && !this.mobileerror && !this.ageerror) {
        this.restDataServices.AddData(this.infoModel).subscribe(resp => {
        });
        this.SuccessCaptach = true;
        this.ShowForm = false;
      }

    }
    else {
      if (this.CaptachaCount == 2) {
        this.FailurCaptach = true;
        this.ShowForm = false;
      }
      else {
        this.CaptachaCount++;
        this.toppings.setValue('');
        this.randomNumber1 = this.randomNumber2
        this.getImage(this.randomNumber1);
      }
    }
  }
  ngOnInit(): void {

  }

  FormSubmit() {
    this.Submit = true;
    while (this.randomNumber1 == this.randomNumber2) {
      this.randomNumber(this.randomNumber1, this.randomNumber2);
    }
    this.getImage(this.randomNumber1);
  }
  getImage(value) {
    switch (value) {
      case 1: this.image = "../assets/1.gif";
        break;
      case 2: this.image = "../assets/2.webp";
        break;
      case 3: this.image = "../assets/3.webp";
        break;
      case 4: this.image = "../assets/4.webp";
        break;
      case 5: this.image = "../assets/5.gif";
        break;
      case 6: this.image = "../assets/6.webp";
        break;
      case 7: this.image = "../assets/7.webp";
        break;
      case 8: this.image = "../assets/8.webp";
        break;
      case 9: this.image = "../assets/9.gif";
        break;
      case 10: this.image = "../assets/10.webp";
        break;
    }
  }
  randomNumber(value1, value2) {
    if (value1 === value2) {
      this.randomNumber2 = Math.floor(Math.random() * 10) + 1;
    }
  }
}