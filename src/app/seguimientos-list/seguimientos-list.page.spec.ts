import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeguimientosListPage } from './seguimientos-list.page';

describe('SeguimientosListPage', () => {
  let component: SeguimientosListPage;
  let fixture: ComponentFixture<SeguimientosListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientosListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeguimientosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
