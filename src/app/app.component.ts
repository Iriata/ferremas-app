import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  estaLogueado = false;

  constructor(private router: Router) {
    this.estaLogueado = !!localStorage.getItem('usuario');
  }

  logout() {
    localStorage.removeItem('usuario');
    this.estaLogueado = false;
    this.router.navigate(['/home']);
  }
}
