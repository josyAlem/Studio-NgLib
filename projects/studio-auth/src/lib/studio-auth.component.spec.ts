import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioAuthComponent } from './studio-auth.component';

describe('StudioAuthComponent', () => {
  let component: StudioAuthComponent;
  let fixture: ComponentFixture<StudioAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudioAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
