import { ContaReturnValue } from "./ContaReturnValue";

export interface ApiResponse {
  success: boolean;
  data: ContaReturnValue;
  erros: any;
}
