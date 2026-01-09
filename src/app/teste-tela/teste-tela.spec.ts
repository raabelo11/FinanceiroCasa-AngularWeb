import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteTela } from './teste-tela';

describe('TesteTela', () => {
  let component: TesteTela;
  let fixture: ComponentFixture<TesteTela>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteTela]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteTela);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
