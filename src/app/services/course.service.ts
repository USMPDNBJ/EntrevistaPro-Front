import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import Course from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrlCourse;

  constructor(private http: HttpClient) {}

    getCourses(): Observable<Course[]> {
    console.log('URL de la petición:', this.apiUrl);

    return this.http.get<{ status: number, message: string, data: Course[] }>(this.apiUrl, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos solo la parte "data" de la respuesta
    );
  }

  // Método para obtener las sesiones de un usuario por ID
  getCoursesByCourseId(courseId: string): Observable<Course[]> {
    const url = `${this.apiUrl}/${courseId}`;
    console.log('URL de la petición:', url);

    return this.http.get<{ status: number, message: string, data: Course[] }>(url, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos solo la parte "data" de la respuesta
    );
  }
}
