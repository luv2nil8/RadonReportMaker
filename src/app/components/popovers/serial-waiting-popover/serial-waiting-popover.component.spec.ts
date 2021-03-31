import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SerialWaitingPopoverComponent } from './serial-waiting-popover.component';

describe('SerialWaitingPopoverComponent', () => {
  let component: SerialWaitingPopoverComponent;
  let fixture: ComponentFixture<SerialWaitingPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialWaitingPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SerialWaitingPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
