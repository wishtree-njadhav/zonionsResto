import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Restaurant } from '../_helpers/restaurant';
import { RestaurantService } from '../_services/restaurant.service';


@Component({
  selector: 'kt-restaurant-list',
  templateUrl: './restaurant-list.component.html',
})
export class RestaurantListComponent implements OnInit {

  restaurantList = new Array<Restaurant> () ;
  id = 0;
  restaurantObject = new Array<Restaurant>();
  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.restaurantService.getRestaurantList().subscribe(
      (data) => {
        console.log(data);
        this.restaurantList = data;
        console.log(this.restaurantList);
      }, error => {
        if (error.status === 500) {
          this.router.navigate(['error/500']);
        }
      }
    );
  }

  deleteRestaurant(id: number): void {
    this.restaurantService.deleteResto(id).subscribe(
      (data) => {
        console.log(data);
        this.reload();
        alert('Deleted Successfully');
      }, error => {
        if (error.status === 500) {
          this.router.navigate(['error/500']);
        }
      }
    );
  }
  edit(id: number): void {
    this.router.navigate(['restaurants', 'update', id]);
  }
  back(): void {
    this.router.navigate(['restaurants', 'home']);
  }

  changeStatus(id: number): void {
    console.log('id in change status=', id);
    this.restaurantService.getRestoId(id).subscribe((resp) => {
      console.log(resp);
      this.restaurantObject = resp;
      console.log(this.restaurantObject);
      this.restaurantService.changeStatus(id, this.restaurantObject).subscribe(
        (data) => {
          console.log(data);
          this.reload();
        }, error => {
          if (error.status === 500) {
            this.router.navigate(['error/500']);
          }
        }
      );
    });
  }
}
