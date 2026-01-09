import { Component, Output, EventEmitter } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule, MatCard } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-periodo',
  imports: [MatIconModule, MatButtonModule, MatBadgeModule, MatInputModule, MatFormFieldModule, MatCardModule, FormsModule],
  templateUrl: './filtro-periodo.html',
  styleUrl: './filtro-periodo.scss',
})
export class FiltroPeriodo {

  // inputs trabalham com string
  dataInicio!: string;
  dataFim!: string;

  @Output() datasMudaram = new EventEmitter<{ inicio: string; fim: string }>();

  ngOnInit() {
    const hoje = new Date();

    // valor correto pro input date
    this.dataInicio = this.toInputDate(hoje);
    this.dataFim = this.toInputDate(hoje);
  }

  filtrar() {
    console.log('Filtrando com datas:', this.dataInicio, this.dataFim);
    this.datasMudaram.emit({
      inicio: this.toBackendDateTime(this.dataInicio, true),
      fim: this.toBackendDateTime(this.dataFim, false)
    });
  }

  // yyyy-MM-dd (input date)
  toInputDate(data: Date): string {
    return data.toISOString().slice(0, 10);
  }

  // ddMMyyyy (visual/log)
  formatarDDMMYYYY(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}${mes}${ano}`;
  }

  // padrão backend datetime
  toBackendDateTime(data: string, inicio: boolean): string {
    return inicio
      ? `${data}T00:00:00`
      : `${data}T23:59:59`;
  }
}
