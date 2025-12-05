import { Component } from '@angular/core';
import { Conta } from '../shared/models/Conta';
import { ANGULAR_IMPORTS } from '../shared/angular-imports';
import { ContasService } from './service/dashboard-service';
import { ContaDTO } from '../shared/models/ContaDTO';
import { CategoriaConta } from '../shared/models/CategoriaConta';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [ANGULAR_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  contas: Conta[] = [];
  valorTotal: number = 0;
  carregando = true;
  categorias: { id: number; nome: string } [] = Object.keys(CategoriaConta)
  .filter(key => isNaN(Number(key))) // pega só os nomes do enum
  .map(key => ({
    id: CategoriaConta[key as keyof typeof CategoriaConta], // número do enum
    nome: key.replace(/([A-Z])/g, ' $1').trim() // transforma "ContasFixas" em "Contas Fixas"
  }));


  mesReferencia: string = 'Dezembro/2025';
  abrirFormulario: boolean = false;

  novaConta: ContaDTO = {
    nome: '',
    valor: 0,
    dataVencimento: '',
    dataPagamento: '',
    categoriaContas: 0,
    numeroParcela: 0,
    totalParcelas: 0,
    contaFixa: false,
    responsavel: ''
  };

    constructor(private contasService: ContasService) {}

    ngOnInit(): void {
      this.contasService.listarContas().subscribe({
        next: (res) => {
          this.valorTotal = res.data.valorTotal;
          this.contas = res.data.contas;
          this.carregando = false;
        },
        error: () => {
          this.carregando = false;
        }
      });
    }

  registrarConta() {
    this.novaConta.categoriaContas = Number(this.novaConta.categoriaContas);
    this.contasService.registrarConta(this.novaConta).subscribe({
      next: (res) => {
        console.log('Conta registrada com sucesso:', res);
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erro ao registrar conta:', err);
      }
    });
  }

  editar(id: number) {
    // método vazio
  }

  excluir(id: number) {
    this.contasService.excluirConta(id).subscribe({
      next: (res) => {
        console.log('Conta excluída com sucesso:', res);
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erro ao excluir conta:', err);
      }
    });
  }

  limparFormulario() {
    this.novaConta = {
      nome: '',
      valor: 0,
      dataVencimento: '',
      dataPagamento: '',
      categoriaContas: 0,
      numeroParcela: 0,
      totalParcelas: 0,
      contaFixa: false,
      responsavel: ''
    };
  }

  trackById(index: number, item: any) {
    return item.idConta;
  }
}
