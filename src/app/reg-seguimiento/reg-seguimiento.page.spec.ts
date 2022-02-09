import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegSeguimientoPage } from './reg-seguimiento.page';

describe('RegSeguimientoPage', () => {
  let component: RegSeguimientoPage;
  let fixture: ComponentFixture<RegSeguimientoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegSeguimientoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegSeguimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
