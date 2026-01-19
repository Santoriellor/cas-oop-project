import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService} from "../service/document.service";
import { CourseDocumentDto} from "../model/document.models";

/**
 * Course documents component.
 *
 * <p>
 * This component is responsible for displaying all documents
 * associated with a specific course. The course ID is retrieved
 * from the route parameters.
 * </p>
 *
 * <p>
 * Documents are loaded from the backend via {@link DocumentService}.
 * The component handles loading and error states explicitly.
 * </p>
 */
@Component({
  selector: 'app-course-documents',
  templateUrl: './course-documents.html',
  styleUrls: ['./course-documents.scss']
})
export class CourseDocumentsComponent implements OnInit {

  /**
   * ID of the course whose documents are displayed.
   */
  courseId!: number;

  /**
   * List of documents associated with the course.
   */
  documents: CourseDocumentDto[] = [];

  /**
   * Indicates whether document data is currently being loaded.
   */
  loading = false;

  /**
   * Error message displayed when document loading fails.
   */
  error: string | null = null;

  /**
   * Creates a new {@link CourseDocumentsComponent}.
   *
   * @param route used to extract route parameters
   * @param documentService service used to load course documents
   */
  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService
  ) {}

  /**
   * Angular lifecycle hook invoked after component initialization.
   *
   * <p>
   * Extracts the course ID from the route and triggers
   * the document loading process.
   * </p>
   */

ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadDocuments();
}

  /**
   * Loads all documents for the current course.
   *
   * <p>
   * Updates loading and error states based on the request outcome.
   * </p>
   */
loadDocuments(): void {
    this.loading = true;
    this.error = null;

    this.documentService.getDocumentsByCourse(this.courseId).subscribe({
      next: docs => {
        this.documents = docs;
        this.loading = false;
      },
    error: err => {
        this.loading = false;

      // Handle authorization errors separately
        if(err.status === 403) {
          this.error = 'Du bist für diesen Kurs nicht eingeschrieben.'
        } else {
          this.error = 'Dokument konnten nicht geladen werden.'
        }
    }
  });
}
}
