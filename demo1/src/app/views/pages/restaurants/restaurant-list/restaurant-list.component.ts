import { Component, OnInit, ViewChild } from '@angular/core';

// RXJS
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Restaurant } from '../_helpers/restaurant';
import { RestaurantService } from '../_services/restaurant.service';
import { QueryParamsModel } from '/home/njadhav/Documents/TestMetronics1/src/app/core/_base/crud';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantDeleteComponent } from '../delete-restaurant/delete-restaurant.component';


@Component({
  selector: 'kt-restaurant-list',
  templateUrl: './restaurant-list.component.html',
})
export class RestaurantListComponent implements OnInit {
  //dataSource: RestaurantListDataSource ;
  restaurants = new Array<Restaurant>();
  restaurantList = new Array<Restaurant> () ;
  restList: Restaurant[];
  restaurant: Restaurant = new Restaurant();
  displayedColumns = ['restaurantName', 'address', 'phoneNo', 'openTime', 'closeTime', 'updatedTime', 'status' , 'actions' ];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  id = 0;
  restaurantObject = new Array<Restaurant>();
  searchKey: string;
  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private activatedRoute: ActivatedRoute, private modalService: NgbModal) {

  }
  listData: MatTableDataSource<any>;
  ngOnInit(): void {
    this.reload();
  }


  

  reload(): void {
    // tslint:disable-next-line: deprecation
    this.restaurantService.getRestaurantList().subscribe(
      (data) => {
        console.log(data);
        this.restaurants = data;
        console.log(this.restaurant);
        this.listData = new MatTableDataSource(this.restaurants);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        // tslint:disable-next-line: no-shadowed-variable
        this.listData.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(element => {
            return element !== 'actions' && data[element].toLowerCase().indexOf(filter) !== -1;

          });
        };
      }, error => {
        if (error.status === 500) {
          this.router.navigate(['error/500']);
        }
      }
    );
  }

  deleteRestaurant(restaurant: Restaurant): void {
    const ref = this.modalService.open(RestaurantDeleteComponent, { centered: true });
    ref.componentInstance.id = restaurant.id;
  }

  edit(id: number): void {
    this.router.navigate(['restaurants', 'update', id]);
  }
  back(): void {
    this.router.navigate(['restaurants', 'home']);
  }

  changeStatus(id: number): void {
    console.log('id in change status=', id);
    // tslint:disable-next-line: deprecation
    this.restaurantService.getRestoId(id).subscribe((resp) => {
      console.log(resp);
      this.restaurantObject = resp;
      console.log(this.restaurantObject);
      // tslint:disable-next-line: deprecation
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

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  open(content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: 'lg' });
  }
}
