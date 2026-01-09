import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService} from "../service/document.service";
import { CourseDocumentDto} from "../model/document.models";


@Component({
  selector: 'app-course-documents',
  templateUrl: './course-documents.html',
  styleUrls: ['./course-documents.scss']
})
export class CourseDocumentsComponent implements OnInit {

  courseId!: number;
  documents: CourseDocumentDto[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService
  ) {}

ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadDocuments();
}

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
        if(err.status === 403) {
          this.error = 'Du bist für diesen Kurs nicht eingeschrieben.'
        } else {
          this.error = 'Dokument konnten nicht geladen werden.'
        }
    }
  });
}
}
