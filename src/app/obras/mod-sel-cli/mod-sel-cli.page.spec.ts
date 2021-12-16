import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModSelCliPage } from './mod-sel-cli.page';

describe('ModSelCliPage', () => {
  let component: ModSelCliPage;
  let fixture: ComponentFixture<ModSelCliPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModSelCliPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModSelCliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
