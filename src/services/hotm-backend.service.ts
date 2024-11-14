import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "express";

@Injectable({
  providedIn: 'root'
})
export class HotmBackendService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // relativeRoute is on saim domain
  get<T>(relativeRoute: string) {
    return this.http.get<T>(relativeRoute)
  }
}
