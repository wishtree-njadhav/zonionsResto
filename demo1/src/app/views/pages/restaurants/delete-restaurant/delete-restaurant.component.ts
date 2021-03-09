import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantService } from '../_services/restaurant.service';


@Component({
    selector: 'kt-restaurant-delete',
    templateUrl: './delete-restaurant.component.html',
  })
  export class RestaurantDeleteComponent implements OnInit {
      id: number;
      constructor(private restaurantServiec: RestaurantService, private router: Router, private modalService: NgbModal) {
      }
    ngOnInit(): void {
       // this.deleteRestaurant();
    }
     deleteRestaurant(): void {
    // tslint:disable-next-line: deprecation
    this.restaurantServiec.deleteResto(this.id).subscribe(
      (data) => {
        console.log(data);
        console.log();
        this.modalService.dismissAll();
        window.location.reload();
      }, error => {
        if (error.status === 500) {
          this.router.navigate(['error/500']);
        }
      }
    );
  }

     closeRestaurant() {
        this.modalService.dismissAll();
    }
  }
