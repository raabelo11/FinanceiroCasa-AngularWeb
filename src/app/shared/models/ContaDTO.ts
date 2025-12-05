export interface ContaDTO{
  nome: string;
  valor: number;
  dataVencimento: string;
  dataPagamento: string;
  categoriaContas: number;
  numeroParcela: number;
  totalParcelas: number;
  contaFixa: boolean;
  responsavel: string;
}
