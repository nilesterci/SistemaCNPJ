import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { cnpjResponse } from './models/cnpjResponse';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  private urlApiCnpj: string;

  constructor(
    private injector: Injector,
    private http: HttpClient
  ) {
    this.urlApiCnpj = environment.APICNPJ;
   }

  public buscaCNPJ(valor: string): Observable<any>{
    try {
      return this.http.get<cnpjResponse>(`${this.urlApiCnpj}/api/cnpj/v1/${valor}`)
    } catch (error) {
      throw error;
    }
  }
}
