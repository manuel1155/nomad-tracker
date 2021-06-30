import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapsTempPage } from './maps-temp.page';

describe('MapsTempPage', () => {
  let component: MapsTempPage;
  let fixture: ComponentFixture<MapsTempPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsTempPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapsTempPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
