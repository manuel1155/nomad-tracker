import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ObrasPage } from './obras.page';

describe('ObrasPage', () => {
  let component: ObrasPage;
  let fixture: ComponentFixture<ObrasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObrasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ObrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
