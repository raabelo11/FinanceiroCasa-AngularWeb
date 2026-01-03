import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ANGULAR_IMPORTS } from '../shared/angular-imports';
import { ContasService } from './service/dashboard-service';
import { Conta } from '../shared/models/Conta';
import { ContaDTO } from '../shared/models/ContaDTO';
import { CategoriaConta } from '../shared/models/CategoriaConta';
import { Chart } from 'chart.js/auto';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [ANGULAR_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements AfterViewInit {

  /* =========================
     NOVO — Abas
     ========================= */
  abaAtiva: 'geral' | 'contas' | 'categorias' | 'planejamento' = 'contas';
  chart!: Chart;

  selecionarAba(
    aba: 'geral' | 'contas' | 'categorias' | 'planejamento'
  ): void {
    this.abaAtiva = aba;
    if (aba === 'categorias') {
    setTimeout(() => this.criarGraficoCategoria());
  }
  }

  criarPlanejamento(): void {
    // futuro endpoint
  }

  /* =========================
     SEU ESTADO ORIGINAL
     ========================= */
  contas: Conta[] = [];
  valorTotal = 0;
  carregando = true;
  abrirFormulario = false;

  categorias: { id: number; nome: string }[] =
    Object.keys(CategoriaConta)
      .filter(key => isNaN(Number(key)))
      .map(key => ({
        id: CategoriaConta[key as keyof typeof CategoriaConta],
        nome: key.replace(/([A-Z])/g, ' $1').trim()
      }));

  anos: number[] = [2023, 2024, 2025, 2026];

  meses = [
    { id: 1, nome: 'Janeiro' },
    { id: 2, nome: 'Fevereiro' },
    { id: 3, nome: 'Março' },
    { id: 4, nome: 'Abril' },
    { id: 5, nome: 'Maio' },
    { id: 6, nome: 'Junho' },
    { id: 7, nome: 'Julho' },
    { id: 8, nome: 'Agosto' },
    { id: 9, nome: 'Setembro' },
    { id: 10, nome: 'Outubro' },
    { id: 11, nome: 'Novembro' },
    { id: 12, nome: 'Dezembro' }
  ];

  anoSelecionado: number = new Date().getFullYear();
  mesSelecionado: number = new Date().getMonth() + 1;

  mesReferencia = 'Dezembro/2025';

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
  ngAfterViewInit(): void {
    this.criarGraficoCategoria();
  }

  /* =========================
     CICLO DE VIDA
     ========================= */
  ngOnInit(): void {
    this.buscarContas();
  }

criarGraficoCategoria(): void {
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

  /* =========================
     MÉTODOS EXISTENTES (INTACTOS)
     ========================= */
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

  mesNomeSelecionado(): string {
    return this.meses.find(m => m.id === this.mesSelecionado)?.nome ?? '';
  }

  registrarConta(): void {
    this.novaConta.categoriaContas = Number(this.novaConta.categoriaContas);

    this.contasService.registrarConta(this.novaConta).subscribe({
      next: () => {
        this.limparFormulario();
        this.buscarContas();
      },
      error: (err) => {
        console.error('Erro ao registrar conta:', err);
      }
    });
  }

  editar(id: number): void {
    // manter vazio
  }

  excluir(id: number): void {
    this.contasService.excluirConta(id).subscribe({
      next: () => this.buscarContas(),
      error: (err) => console.error('Erro ao excluir conta:', err)
    });
  }

  limparFormulario(): void {
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

  trackById(index: number, item: Conta): number {
    return item.idConta;
  }

  /* =========================
     FILTRO (MANTIDO)
     ========================= */
  selecionarAno(ano: number): void {
    this.anoSelecionado = ano;
  }

  selecionarMes(mes: number): void {
    this.mesSelecionado = mes;
  }

  onAnoChange(): void {
    // futura chamada
  }

  onMesChange(): void {
    // futura chamada
  }

  filtrar(): void {
    const ano = this.anoSelecionado;
    const mes = this.mesSelecionado;

    const inicio = `${ano}-${String(mes).padStart(2, '0')}-01T00:00:00`;

    const ultimoDia = new Date(ano, mes, 0).getDate();
    const fim = `${ano}-${String(mes).padStart(2, '0')}-${ultimoDia}T23:59:59`;

    console.log(inicio);
    console.log(fim);
    console.log(environment.apiUrl);
}


  limparFiltro(): void {
    this.anoSelecionado = new Date().getFullYear();
    this.mesSelecionado = new Date().getMonth() + 1;
  }
}
