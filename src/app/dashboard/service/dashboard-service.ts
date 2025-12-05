import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/ApiResponseListaContas';
import { ContaDTO } from '../../shared/models/ContaDTO';

@Injectable({
  providedIn: 'root'
})
export class ContasService {

  private apiUrl = 'https://localhost:7275/Financeiro/v1/contas/Listar';
  private apiUrlPost = 'https://localhost:7275/Financeiro/v1/contas/Registrar';
  private apiUrlDelete = 'https://localhost:7275/Financeiro/v1/contas/Excluir';

  constructor(private http: HttpClient) { }

  listarContas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  registrarConta(novaConta: ContaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrlPost, novaConta);
  }

  excluirConta(id: number): Observable<ApiResponse> {
    const url = `${this.apiUrlDelete}/${id}`;
    return this.http.delete<ApiResponse>(url);
  }
}
