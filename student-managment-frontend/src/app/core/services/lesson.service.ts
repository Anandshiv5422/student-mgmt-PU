import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Lesson {
  id: number;
  no: number;
  name: string;
  startDate: string;
  endDate: string;
  grade: string;
  branch: string;
  topic: string;
  assignedStatus: string;
  publishStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private lessons = new BehaviorSubject<Lesson[]>([]);

  getLessons(): Observable<Lesson[]> {
    return this.lessons.asObservable();
  }

  getLessonCount(): Observable<number> {
    return of(this.lessons.value.length);
  }
}
