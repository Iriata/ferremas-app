import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MonedaService {
  constructor(private http: HttpClient) {}

  obtenerIndicadores() {
    return this.http.get('https://mindicador.cl/api');
  }
}
