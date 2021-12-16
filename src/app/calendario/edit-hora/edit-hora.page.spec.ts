import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditHoraPage } from './edit-hora.page';

describe('EditHoraPage', () => {
  let component: EditHoraPage;
  let fixture: ComponentFixture<EditHoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHoraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditHoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
