import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IAutocompleteBoxComponent } from './i-autocomplete-box.component';

describe('IAutocompleteBoxComponent', () => {
  let component: IAutocompleteBoxComponent;
  let fixture: ComponentFixture<IAutocompleteBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IAutocompleteBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IAutocompleteBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
