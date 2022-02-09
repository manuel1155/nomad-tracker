import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../servicios/auth/auth.service';
import { TrackerService } from '../servicios/trackers/tracker.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-seguimientos-list',
  templateUrl: './seguimientos-list.page.html',
  styleUrls: ['./seguimientos-list.page.scss'],
})
export class SeguimientosListPage implements OnInit, OnDestroy {

  done: boolean = false;
  listSeg = [];

  subscriptios: Subscription;
  fireSubs: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private trackerServ: TrackerService,
  ) { }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this.fireSubs.unsubscribe();
    this.subscriptios.unsubscribe();
  }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.listSeg = [];
    this.getDataSeguimientos();
  }

  async getDataSeguimientos() {

    this.subscriptios = this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;

        await this.auth.getUserData();

        this.listSeg = [];

        await new Promise<void>((resolve) => {
          this.fireSubs = this.trackerServ.getTrackersTransp().subscribe(data => {
            console.log(data);
            this.listSeg = data;
            resolve();
          })
        })

        this.done = true;
      }
    });
  }

  openTraker(tracker: any) {
    let navigationExtras: NavigationExtras = {
      replaceUrl: true,
      state: {
        tracker: tracker
      }
    };
    this.fireSubs.unsubscribe();
    this.router.navigate(['/reg-seguimiento'], navigationExtras);
  }

}
