import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent {

  listaCurso: string [] = [ 'TypeScrint', 'JavaScript', 'Java SE', 'PHP' ];
  habilitar: boolean = true;

  setHabilitar(): void {
    this.habilitar = ( this.habilitar == true ) ? false: true;
  }
  constructor() { } 

}
