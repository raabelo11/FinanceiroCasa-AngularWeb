import { Conta } from './../shared/models/Conta';
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ANGULAR_IMPORTS } from '../shared/angular-imports';
import { ContasService } from './service/dashboard-service';
import { CategoriaConta } from '../shared/models/CategoriaConta';
import { Chart } from 'chart.js/auto';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';

import { FiltroPeriodo } from './filtro-periodo/filtro-periodo';
import { ContaDTO } from '../shared/models/ContaDTO';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    ANGULAR_IMPORTS,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FiltroPeriodo
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements AfterViewInit {
  hidden = false;
  badgeCount = 23;

  formConta: ContaDTO = {
    nome: '',
    valor: 0,
    dataVencimento: '',
    dataPagamento: '',
    categoriaContas: 0,
    numeroParcela: null,
    totalParcelas: null,
    contaFixa: false,
    responsavel: '',
    tipoMovimento: 0
  }

  toggleBadgeVisibility(): void {
    this.hidden = !this.hidden;
  }

  abaAtiva: 'geral' | 'contas' | 'categorias' | 'planejamento' = 'contas';

  selecionarAba(
    aba: 'geral' | 'contas' | 'categorias' | 'planejamento'
  ): void {
    this.abaAtiva = aba;

    if (aba === 'categorias') {
      setTimeout(() => this.criarGraficoCategoria());
    }
  }

  criarPlanejamento(): void {
    // reservado para futuro
  }

  contas: Conta[] = [];
  valorTotal = 0;
  carregando = true;
  abrirFormulario = false;

  categorias = Object.keys(CategoriaConta)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      id: CategoriaConta[key as keyof typeof CategoriaConta],
      nome: key.replace(/([A-Z])/g, ' $1').trim()
    }));

  /* =========================
     GRÁFICO
     ========================= */
  chart!: Chart;

  ngAfterViewInit(): void {
    if (this.abaAtiva === 'categorias') {
      this.criarGraficoCategoria();
    }
  }

  criarGraficoCategoria(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('graficoContas', {
      type: 'pie',
      data: {
        labels: ['Aluguel', 'Água', 'Luz', 'Internet'],
        datasets: [
          {
            data: [1200, 150, 200, 100]
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }

  constructor(private contasService: ContasService) {}

  ngOnInit(): void {
    this.buscarContas();
  }

  buscarContas(): void {
    this.carregando = true;

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

  excluir(id: number): void {
    this.contasService.excluirConta(id).subscribe({
      next: () => this.buscarContas(),
      error: err => console.error('Erro ao excluir conta:', err)
    });
  }

  receberDatas(event: { inicio: string; fim: string }): void {
    console.log('Filtro recebido:', event);
  }

  salvar(){
      this.formConta.dataPagamento = this.toBackendDateTime(this.formConta.dataPagamento, true),
      this.formConta.dataVencimento = this.toBackendDateTime(this.formConta.dataVencimento, true)
      console.log('Conta enviada:', this.formConta);
  }

  toBackendDateTime(data: string, inicio: boolean): string {
    return inicio
      ? `${data}T00:00:00`
      : `${data}T23:59:59`;
  }
}
