import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  showFunctionality = false;
  images = [
    {
      url: 'https://cdn-icons-png.flaticon.com/512/3589/3589030.png',
      alt: 'Asistencia'
    },
    {
      url: 'https://img.freepik.com/vector-gratis/gente-hablando-distintos-idiomas-dibujado-mano_23-2147867238.jpg',
      alt: 'Lengua'
    },
    {
      url: 'https://img.freepik.com/vector-premium/doodle-matematicas-formulas-matematicas-dibujadas-mano-pizarra-portada-libro-banner-fondo-etc-industria-educacion-teoria-matematica-educacion-escolar_93083-3366.jpg',
      alt: 'Mate'
    },
    {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJkZj1jza_8hShQ_q0Ar_l6zIkoIxab0nxGg&s',
      alt: 'Ciencia'
    },
    {
      url: 'https://www.lifeder.com/wp-content/uploads/2021/06/Orange-and-Yellow-Illustrated-International-Museum-Day-Social-Media-Poster.jpg',
      alt: 'Historia'
    },
    {
      url: 'https://i.pinimg.com/736x/50/27/ed/5027ed356cdd9fbf558bdf55140a8f34.jpg',
      alt: 'Ingles'
    }
  ];

  constructor(private router: Router) {}

  navigateToPage(alt: string) {
    const route = alt.toLowerCase();
    this.router.navigate([`/${route}`]);
  }

  toggleFunctionality() {
    this.showFunctionality = !this.showFunctionality;
  }
}
