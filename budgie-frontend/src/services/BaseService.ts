import type { AxiosInstance } from "axios";
import api from "../configs/axiosConfig";

abstract class BaseService {
  protected endPoint: string;
  protected api: AxiosInstance;

  constructor(endPoint: string) {
    this.endPoint = endPoint;
    this.api = api;
  }

  async inserir(dados: any) {
    const resposta = await this.api.post(this.endPoint, dados);
    return resposta;
  }

  async alterar(dados: any) {
    const resposta = await this.api.put(this.endPoint, dados);
    return resposta;
  }

  async excluir(id: number) {
    const resposta = await this.api.delete(`${this.endPoint}/${id}`);
    return resposta;
  }

  async buscarTodos() {
    const resposta = await this.api.get(this.endPoint);
    return resposta;
  }
}

export default BaseService;
