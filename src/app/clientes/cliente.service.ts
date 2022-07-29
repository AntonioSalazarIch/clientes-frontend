import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8060/api/clientes';
  //private httpHeaders: new HttpHeaders( { 'Content-Type': 'application/json' } );
  private headers= new HttpHeaders()
  .set('content-type', 'application/json');

  constructor( 
    private http: HttpClient,
    private router: Router 
    ) { }
  
  getClientes(): Observable<any> {
    return this.http.get<any>( this.urlEndPoint );
  }

  getCliente( id: number ): Observable<Cliente> {
    return this.http.get<Cliente>( `${this.urlEndPoint}/${id}` ).pipe(
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


  update( cliente: Cliente ): Observable<Cliente> {
    return this.http.put<Cliente>( `${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.headers } )
  }

  delete( id: number ): Observable<Cliente> {
    return this.http.delete<Cliente>( `${this.urlEndPoint}/${id}`, { headers: this.headers } )
  }

}
