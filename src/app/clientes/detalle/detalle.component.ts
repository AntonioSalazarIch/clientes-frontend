import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})

export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  public fotoSeleccionada: File;
  public progreso: number;
  constructor( 
    private clienteService: ClienteService,
    public modalService: ModalService
  ) { }

  ngOnInit(): void {
  
  }

  seleccionarFoto( event ) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log( this.fotoSeleccionada );
    if( this.fotoSeleccionada.type.indexOf( 'image' ) ){
      Swal.fire( 
        'Error al seleccionar imagen: ', 
        'El archivo debe ser del tipo imagen', 
        'error' );
    }
  }

  subirFoto(){
    let id: number = this.cliente.id;
    this.clienteService.subirFoto( this.fotoSeleccionada, id )
    .subscribe( event => {
      if( event.type === HttpEventType.UploadProgress ){
        this.progreso = Math.round( ( event.loaded/event.total * 100 ) );
      } else if( event.type === HttpEventType.Response ) {
        let response: any = event.body;
        this.cliente = response.data as Cliente;
        this.modalService.notificarUpload.emit( this.cliente );
        Swal.fire( 
          'La foto se ha subido completamente', 
          `La foto se ha subido con exito: ${this.fotoSeleccionada}`, 
          'success' );
      
        }
    });
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
