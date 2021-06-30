import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckPermisosPage } from './check-permisos.page';

describe('CheckPermisosPage', () => {
  let component: CheckPermisosPage;
  let fixture: ComponentFixture<CheckPermisosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckPermisosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckPermisosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
