import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDocumentsComponent } from './course-documents';

describe('CourseDocuments', () => {
  let component: CourseDocumentsComponent;
  let fixture: ComponentFixture<CourseDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
