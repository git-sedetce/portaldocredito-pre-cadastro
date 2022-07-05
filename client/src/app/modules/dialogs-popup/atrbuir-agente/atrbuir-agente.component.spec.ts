import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtrbuirAgenteComponent } from './atrbuir-agente.component';

describe('AtrbuirAgenteComponent', () => {
  let component: AtrbuirAgenteComponent;
  let fixture: ComponentFixture<AtrbuirAgenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtrbuirAgenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtrbuirAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
