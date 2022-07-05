import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgMessageComponent } from './dlg-message.component';

describe('DlgMessageComponent', () => {
  let component: DlgMessageComponent;
  let fixture: ComponentFixture<DlgMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
