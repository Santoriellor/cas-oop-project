export interface CourseDocumentDto {
  id: number;
  filename: string;
  contentType: string;
  uploadedAt: string; //ISO String
}

export interface UserDocumentDto {
  id: number;
  filename: string;
  courseId: number;
  courseTitle: string;
}
