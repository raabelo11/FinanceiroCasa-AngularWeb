export interface Conta {
  idConta: number;
  nome: string;
  valor: number;
  dataVencimento: string;
  dataPagamento: string;
  estaPaga: boolean;
  categoriaContas: number;
  numeroParcela: number | null;
  totalParcelas: number | null;
  contaFixa: boolean;
  responsavel: string;
}
