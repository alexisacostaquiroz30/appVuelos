import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { BackService } from '../../vuelo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'reservas-cmp',
    moduleId: module.id,
    templateUrl: 'reservas.component.html'
})

export class ReservasComponent implements OnInit{

  datosReservas: any[];

  datosClientes: any[];
  formulario: FormGroup;

  constructor(
    private backService: BackService,
    private formBuilder: FormBuilder,
    ) { 

    this.formulario = this.formBuilder.group({
      cliente: [''],
    });

  }
  
  ngOnInit(){
    this.obtenerDatosClientes();
  }

  cambioCliente() {
    const { cliente } = this.formulario.value;
    this.backService.get('/reserva/reserva/'+cliente).subscribe((data) => {
      this.datosReservas = data;
    });
  }

  obtenerDatosClientes() {
    this.backService.get('/usuario').subscribe((data) => {
      this.datosClientes = data;
    });
  }

}
