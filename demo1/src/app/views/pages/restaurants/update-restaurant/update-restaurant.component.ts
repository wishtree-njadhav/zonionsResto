import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from '../_helpers/restaurant';
import { RestaurantService } from '../_services/restaurant.service';

@Component({
  selector: 'kt-update-restaurant',
  templateUrl: './update-restaurant.component.html',
})
export class UpdateRestaurantComponent implements OnInit {
  data: any;
  restaurantData: any;
  restaurant: Restaurant;
  id = 0;
  imagename = '';
  url = '';
  finalurl = '';
  file: any;
  t = 0;
  q = 0;

  // tslint:disable-next-line: variable-name
  open_time = {
    hour: 10,
    minute: 30
  };
  // tslint:disable-next-line: variable-name
  close_time = {
    hour: 21,
    minute: 30
  };
  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute,
              private router: Router) {
              this.restaurant = new Restaurant();
  }
  ngOnInit(): void {
    this.restaurant = new Restaurant();
    this.id = this.route.snapshot.params.id;
    console.log(this.id);
    this.restaurantService.getRestoId(this.id).subscribe(data => {
      console.log(data);
      this.restaurant = data;
      // tslint:disable-next-line: radix
      this.t = parseInt(this.restaurant.open_time.slice(0, 2));
      // tslint:disable-next-line: radix
      this.q = parseInt(this.restaurant.open_time.slice(3, 5));
      this.open_time = { hour: this.t, minute: this.q};
      // tslint:disable-next-line: radix
      const ch: number = parseInt(this.restaurant.close_time.slice(0, 2));
      // tslint:disable-next-line: radix
      const cm: number = parseInt(this.restaurant.close_time.slice(3, 5));
      this.close_time = { hour: ch, minute: cm};
      console.log('image name', this.restaurant.name);
      this.finalurl = 'http://localhost:8080/zonions/file';
      this.url = `${this.finalurl}/${this.restaurant.name}/${this.id}`;

      console.log(this.url);
    }, error => {
        if (error.status === 500) {
            this.router.navigate(['error/500']);
          }
    });
  }
  updateResto(): void {

    this.restaurantService.update(this.id, this.restaurant).subscribe(data => {
      console.log(data);


      console.log('openTime==', this.open_time);
      this.restaurant = new Restaurant();

      this.backEvent();
    }, error => console.log(error));
  }
  onSubmit(): void {
    this.restaurant.open_time = this.open_time.hour + ':' + this.open_time.minute;
    this.restaurant.close_time = this.close_time.hour + ':' + this.close_time.minute;
    this.updateResto();
    this.backEvent();
  }
  onChange(file: any): void {
      this.file = file;

  }
  updateImage(): void {
    console.log('I am in upload' + this.file);
    this.restaurantService.pushFileToStorage(this.file, this.id).subscribe((resp: any) => {
      console.log(resp);

    }, error => {
        if (error.status === 500) {
            this.router.navigate(['error/500']);
          }
    });
  }

  backEvent(): void {
    this.router.navigate(['restaurants', 'home']);

  }

}
