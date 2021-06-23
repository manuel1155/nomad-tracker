import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddVisitaPage } from './add-visita.page';

describe('AddVisitaPage', () => {
  let component: AddVisitaPage;
  let fixture: ComponentFixture<AddVisitaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVisitaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddVisitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
