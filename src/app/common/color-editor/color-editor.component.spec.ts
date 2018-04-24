import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorEditorComponent } from './color-editor.component';

describe('SpaceEditorComponent', () => {
  let component: ColorEditorComponent;
  let fixture: ComponentFixture<ColorEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
