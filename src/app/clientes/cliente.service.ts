import { Injectable } from '@angular/core';
import { formatDate, registerLocaleData } from '@angular/common';
import { Cliente } from './cliente';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8060/api/clientes';
  private headers= new HttpHeaders()
  .set('content-type', 'application/json');

  constructor( 
    private http: HttpClient,
    private router: Router 
    ) { }
  
  getClientes( page: number ): Observable<any> {
    return this.http.get<any>( this.urlEndPoint +'/page/' + page ).pipe(
      map( ( response: any ) => {
        ( response.content as Cliente[] ).map( cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.createAt = formatDate( cliente.createAt, 'fullDate','es' );
          return cliente;
        });
        return response;
      })
      );
    } 

  getCliente( id: number ): Observable<any> {
    return this.http.get<any>( `${this.urlEndPoint}/${id}` ).pipe(
      catchError( e => {
        this.router.navigate( ['/clientes' ] );
        console.error( e.error.mensaje );
        Swal.fire( 'error al editar', e.error.mensaje, 'error');
        return throwError( e )
      })
    );
  }

  create( cliente: Cliente ): Observable<any> {
    return this.http.post<any>( this.urlEndPoint, cliente, { headers: this.headers } )
  }


  update( cliente: Cliente ): Observable<any> {
    return this.http.put<any>( `${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.headers } )
  }

  delete( id: number ): Observable<Cliente> {
    return this.http.delete<Cliente>( `${this.urlEndPoint}/${id}`, { headers: this.headers } )
  }

  subirFoto( archivo: File, id ): Observable<HttpEvent<{}>>{
    let formData = new FormData(); 
    formData.append( "archivo", archivo );
    formData.append( "id", id );
    const req = new HttpRequest( 'POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request( req );
  }
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>( this.urlEndPoint + '/regiones');
  }
}
