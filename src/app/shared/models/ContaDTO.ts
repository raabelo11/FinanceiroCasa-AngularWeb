export interface ContaDTO{
  nome: string;
  valor: number;
  dataVencimento: string;
  dataPagamento: string;
  categoriaContas: number;
  numeroParcela: number | null;
  totalParcelas: number | null;
  contaFixa: boolean;
  responsavel: string;
  tipoMovimento: number;
}
