import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import Course from '../models/course';
import CoursePayed from '../models/coursePayed';
import { url } from 'node:inspector';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrlCatalogo;

  constructor(private http: HttpClient) { }

  getCourses(courseId: string): Observable<Course[]> {
    const url=`${this.apiUrl}/${courseId}`
    console.log('URL de la petición:', `${this.apiUrl}/${courseId}`);

    return this.http.get<{ status: number, message: string, data: Course[] }>(url, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos solo la parte "data" de la respuesta
    );
  }

  // Método para obtener las sesiones de un usuario por ID
  getCoursesByCourseId(courseId: string): Observable<Course> {
    const url = `${this.apiUrl}/${courseId}`;
    console.log('URL de la petición:', url);

    return this.http.get<{ status: number, message: string, data: Course }>(url, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos solo la parte "data" de la respuesta
    );
  }
  getCoursesRegisteredId(courseId: string): Observable<Course[]> {
    const url = `${this.apiUrl}Registered/${courseId}`;
    console.log('URL de la petición:', url);

    return this.http.get<{ status: number, message: string, data: Course[] }>(url, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos solo la parte "data" de la respuesta
    );
  }
  postCreateCoursePayed(coursePayed: CoursePayed): Observable<CoursePayed> {
    const url = `${this.apiUrl}payed`;
    console.log('URL de la petición:', url);

    return this.http.post<{ status: number, message: string, data: CoursePayed }>(url, coursePayed, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map(response => response.data) // Extraemos solo la parte "data" de la respuesta
    );

  }


}
