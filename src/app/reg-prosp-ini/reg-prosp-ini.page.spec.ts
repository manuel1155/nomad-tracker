import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegProspIniPage } from './reg-prosp-ini.page';

describe('RegProspIniPage', () => {
  let component: RegProspIniPage;
  let fixture: ComponentFixture<RegProspIniPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegProspIniPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegProspIniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
