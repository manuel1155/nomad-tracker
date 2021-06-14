import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProspectosListPage } from './prospectos-list.page';

describe('ProspectosListPage', () => {
  let component: ProspectosListPage;
  let fixture: ComponentFixture<ProspectosListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectosListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProspectosListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
