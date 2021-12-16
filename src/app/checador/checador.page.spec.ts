import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChecadorPage } from './checador.page';

describe('ChecadorPage', () => {
  let component: ChecadorPage;
  let fixture: ComponentFixture<ChecadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecadorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChecadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
