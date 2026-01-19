import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CourseDocumentsComponent } from './course-documents';
import { DocumentService } from '../service/document.service';

/**
 * Unit tests for the {@link CourseDocumentsComponent}.
 *
 * <p>
 * These tests verify that the component can be successfully created
 * and initialized within the Angular testing environment.
 * </p>
 */
describe('CourseDocuments', () => {

  /**
   * Instance of the component under test.
   */
  let component: CourseDocumentsComponent;

  /**
   * Test fixture used to access the component instance
   * and trigger change detection.
   */
  let fixture: ComponentFixture<CourseDocumentsComponent>;

  /**
   * Mock for {@link DocumentService}.
   */
  let mockDocumentService: any;

  /**
   * Mock for {@link ActivatedRoute}.
   */
  let mockActivatedRoute: any;

  /**
   * Configures the testing module and initializes the component
   * before each test case.
   */
  beforeEach(async () => {
    mockDocumentService = jasmine.createSpyObj('DocumentService', ['getDocumentsByCourse']);
    mockDocumentService.getDocumentsByCourse.and.returnValue(of([]));

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [CourseDocumentsComponent],
      providers: [
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    // Create the component instance
    fixture = TestBed.createComponent(CourseDocumentsComponent);
    component = fixture.componentInstance;

    // Trigger initial data binding and lifecycle hooks
    fixture.detectChanges();
  });

  /**
   * Verifies that the component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
