import { Component } from '@angular/core';
import { PoPageDynamicSearchModule } from '@po-ui/ng-templates';

import { PoDynamicViewField, PoMenuItem, PoNotificationService } from '@po-ui/ng-components';
import { ServicoService } from './shared/servico.service';
import { cnpjResponse } from './shared/models/cnpjResponse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private poNotification: PoNotificationService,
    public service: ServicoService
    ) {}

    // dados: cnpjResponse = null;

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: this.onClick.bind(this) }
  ];

  private onClick() {
    alert('Clicked in menu item')
  }



    campos: Array<PoDynamicViewField> = [
      { property: 'razao_social', divider: 'Dados CNPJ', gridColumns: 4, order: 1 },
      { property: 'age', label: 'Age', gridColumns: 4 },
      { property: 'genre', gridColumns: 4 },
      { property: 'cnpj', label: 'CNPJ', gridColumns: 4, order: 2 },
      { property: 'rg', label: 'RG', gridColumns: 4, order: 3 },
      { property: 'graduation', label: 'Graduation', gridColumns: 4 },
      { property: 'company', label: 'Company', divider: 'Work Data' },
      { property: 'job', tag: true, inverse: true, color: 'color-03', icon: 'po-icon-copy' },
      { property: 'admissionDate', label: 'Admission date', type: 'date' },
      { property: 'hoursPerDay', label: 'Hours per day', type: 'time' },
      { property: 'wage', label: 'Wage', type: 'currency' },
      { property: 'descricao_situacao_cadastral', tag: true, color: 'color-11', icon: 'po-icon-ok' },
      { property: 'municipio', label: 'Cidade', divider: 'Endereço' },
      { property: 'addressStreet', label: 'Street' },
      { property: 'addressNumber', label: 'Number' },
      { property: 'zipCode', label: 'Zip Code' }
    ];

    dadosCNPJ: cnpjResponse = {};



  searchCNPJ(valor: any){
    let cnpj = this.onlyNumbers(valor);

    if(this.testaCNPJ(cnpj)){
      this.service.buscaCNPJ(cnpj).subscribe(data =>
        {
          this.dadosCNPJ = {
            cnpj : data.cnpj,
            razao_social: data.razao_social,
            municipio: data.municipio
          };
          this.poNotification.success(`CNPJ Válido`);
      },
      error => {
        this.poNotification.error(`Ocorreu um erro ao se comunicar com o servidor. erro Detalhado : ${error}`);
      });

    }else{
      this.poNotification.error(`CNPJ Inválido`);
    }
  }

  onlyNumbers(valor: any){
    return valor.replace(/[^\d]+/g,'');
  }

  testaCNPJ(valor: any) {
    // Verifica se a variável cnpj é igua a "undefined", exibindo uma msg de erro
    if (valor === undefined) {
      return false;
    }

    // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
    if (valor === '00000000000000' || valor === '11111111111111' || valor === '22222222222222' || valor === '33333333333333' ||
      valor === '44444444444444' || valor === '55555555555555' || valor === '66666666666666' || valor === '77777777777777' ||
      valor === '88888888888888' || valor === '99999999999999' || valor.length !== 14) {
      return false;
    }

    // A variável numeros pega o bloco com os números sem o DV, a variavel digitos pega apenas os dois ultimos numeros (Digito Verificador).
    var tamanho = valor.length - 2;
    var numeros = valor.substring(0, tamanho);
    var digitos = valor.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;

    // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
    // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
      return false;
    }

    tamanho = tamanho + 1;
    numeros = valor.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let k = tamanho; k >= 1; k--) {
      soma += numeros.charAt(tamanho - k) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
      return false;
    }

    return true;
  }

}
