import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddObraModPage } from './add-obra-mod.page';

describe('AddObraModPage', () => {
  let component: AddObraModPage;
  let fixture: ComponentFixture<AddObraModPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddObraModPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddObraModPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
