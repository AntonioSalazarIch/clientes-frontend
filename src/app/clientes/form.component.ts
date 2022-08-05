import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente()
  regiones: Region[];
  public titulo: string = "Crear Cliente"
  public errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe( regiones => this.regiones = regiones );
  }

  cargarCliente(): void{
    this.activateRoute.params.subscribe( params => {
      let id = params[ 'id' ] 
      if( id ){
        this.clienteService.getCliente( id ).subscribe( ( json ) => {
          this.cliente = json.data 
        })
      }
    })
  }
  
  public create(): void{
    console.log( this.cliente);
    this.clienteService.create( this.cliente )
    .subscribe( json => {
        this.router.navigate( [ '/clientes' ] ) ;
        swal.fire(
          'Cliente creado!',
          `El Cliente '${json.data.nombre}' ha sido creado con exito`,
          'success'
        )
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error( 'Código del error desde el Backend' + err.status );
        console.error( err.error.errors );
      }
    )
  }

  public update(): void{
    console.log( this.cliente);
    this.clienteService.update( this.cliente )
    .subscribe( 
      cliente => {
        console.log( 'cliente en update: ', cliente );
        this.router.navigate( [ '/clientes' ] )
        swal.fire(
          'Cliente actualizado!',
          `El cliente '${cliente.id}' ha sido actualizado con exito`,
          'success'
        )
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error( 'Código del error desde el Backend' + err.status );
        console.error( err.error.errors );
      }
    )
  }

  compararRegion( o1:Region,o2:Region ){
    if( o1 === undefined && o2 === undefined ){
      return true;
    }
    return o1 == null || o2 == null? false: o1.id === o2.id;
  }

}
