import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { Restaurant } from '../_helpers/restaurant';
import { RestaurantService } from '../_services/restaurant.service';


@Component({
  selector: 'kt-create-restaurant',
  templateUrl: './create-restaurant.component.html',
})
export class CreateRestaurantComponent implements OnInit {
  restaurant: Restaurant = new Restaurant();
  isSubmitted = true;
  data: any;
  file: any;
  comp: string;
  confirm: boolean;
  restaurantId: any;
  restaurantData: any;
  // tslint:disable-next-line: variable-name
  open_time = '';
  // tslint:disable-next-line: variable-name
  close_time = '';
  time = { hour: 13, minute: 30 };
  restaurantForm = new FormGroup({
    restaurantName: new FormControl('', [Validators.required,
    Validators.pattern('^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$')]),
    address: new FormControl('', [Validators.required]),
    phone_no: new FormControl('', [Validators.required, Validators.pattern('[7-9][0-9]{9}')]),
    open_time: new FormControl('', [Validators.required]),
    close_time: new FormControl('', [Validators.required])
  });

  constructor(
    private restaurantService: RestaurantService,
    private router: Router, private modalService: NgbModal) {
  }
  ngOnInit(): void { }
  get form(): any {
    return this.restaurantForm.controls;
  }
  saveRestaurant(fvalue: any): void {
    console.log(this.restaurantForm.value);
    this.data = fvalue;
    console.log('console data object=', this.data);
    console.log('close time on data object=', this.data.close_time);
    this.close_time =
      this.data.close_time.hour + ':' + this.data.close_time.minute;
    this.data.close_time = this.close_time;
    this.open_time =
      this.data.open_time.hour + ':' + this.data.open_time.minute;
    this.data.open_time = this.open_time;
    this.isSubmitted = true;
    this.restaurantService.createRestaurant(this.restaurantForm.value).subscribe(
      (res) => {
        console.log('after adding resto', res);
        this.restaurantData = res;
        const ref = this.modalService.open(DialogComponent);
        this.comp = 'CreateRestaurantComponent';
        ref.componentInstance.comp = this.comp;
        console.log('id from restaurant data', this.restaurantData.id);
      }, error => {
        if (error.status === 500) {
          this.router.navigate(['error/500']);
        }
      }
    );
  }
  uploadFile(): void {
    console.log('I am in upload' + this.file);
    this.restaurantService
      .pushFileToStorage(this.file, this.restaurantData.id)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.backEvent();
        },
        error => {
          if (error.status === 500) {
            this.router.navigate(['error/500']);
          }
        }
      );
  }
  onFileChangeEvent(file: any): void {
    this.file = file;
    console.log('file change event=', this.file);
  }

  backEvent(): void {
    this.router.navigate(['restaurants', 'home']);
  }

}
