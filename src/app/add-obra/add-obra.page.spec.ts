import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddObraPage } from './add-obra.page';

describe('AddObraPage', () => {
  let component: AddObraPage;
  let fixture: ComponentFixture<AddObraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddObraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddObraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
