import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { BackService } from '../../vuelo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  fila = 0;
  asientos = 0;
  datosReserva: any[];
  datosVuelos: any[];
  datosAereopuerto: any[];
  datosClientes: any[];
  datosAereolinea: any[];
  datosVuelosFilter: any[];
  Array = Array;
  
  formulario: FormGroup;
  closeResult = '';

  asientoReserva = 0;
  filaReserva = 0;
  clienteReserva=0;

  constructor(
    private backService: BackService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
    ) { 

    this.formulario = this.formBuilder.group({
      aeropuertoOrigen: [''],
      aeropuertoDestino: [''],
      aerolinea: [''],
      cliente: [''],
    });

  }
  
  ngOnInit(){
    this.obtenerDatosVuelo();
    this.obtenerDatosAereolinea();
    this.obtenerDatosAereopuerto();
    this.obtenerDatosClientes();
  }

  obtenerDatosAereolinea() {
    this.backService.get('/Aereolinea').subscribe((data) => {
      this.datosAereolinea = data;
    });
  }

  obtenerDatosAereopuerto() {
    this.backService.get('/aereopuerto').subscribe((data) => {
      this.datosAereopuerto = data;
    });
  }

  obtenerDatosClientes() {
    this.backService.get('/usuario').subscribe((data) => {
      this.datosClientes = data;
    });
  }
  
  //obtiene todos los vuelos
  obtenerDatosVuelo() {
    this.backService.get('/vuelo').subscribe((data) => {
      this.datosVuelos = data;
      this.datosVuelosFilter = this.datosVuelos;
    });
  }

  limpiarSeleccion() {
    this.datosVuelosFilter = this.datosVuelos;
  }

  //Aplica filtrado para las opciones que el usaurio va seleccionado
  aplicarFiltros() {
    const { aeropuertoOrigen,aeropuertoDestino , aerolinea } = this.formulario.value;

    this.datosVuelosFilter = this.datosVuelos.filter((vuelo) => {
      return (
        (!aeropuertoOrigen || vuelo.idOrigen.idAereopuerto == aeropuertoOrigen) &&
        (!aeropuertoDestino || vuelo.idDestino.idAereopuerto == aeropuertoDestino) &&
        (!aerolinea || vuelo.idAvion.idAereolinea2.idAereolinea == aerolinea)
      );
    });
  }

  verDisponibilidad(idVuelo:number){
    this.backService.get('/vuelo/'+idVuelo).subscribe((data) => {
      this.fila = data[0].idAvion.numeroFilas;
      this.asientos= data[0].idAvion.numeroAsientos+2;
      this.datosReserva = data;
    });

  }

  esAsientoOcupado(reserva, fila, asiento) {
    // Verificar si hay una reserva que coincide con la fila y el asiento
    return reserva.reservas.some(reserva => reserva.numeroFila === fila && reserva.numeroAsiento === asiento);
  }

  open(content,fila, asiento) {

    const { aeropuertoOrigen,aeropuertoDestino , aerolinea,cliente } = this.formulario.value;
    
    if(!cliente){
      this.showNotification();
      return;
    }else{
      this.clienteReserva = cliente;
    }

    this.filaReserva = fila;
    this.asientoReserva = asiento;
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  crearReserva(){

    let json = {
      "idCliente2": this.clienteReserva,
      "idVuelo2": this.datosReserva[0].idVuelo,
      "numeroFila": this.filaReserva,
      "numeroAsiento": this.asientoReserva
    }

    this.backService.post('/Reserva',json).subscribe(respuesta => {
      this.verDisponibilidad(this.datosReserva[0].idVuelo);
    })
  }

  showNotification() {
    this.toastr.error(
      '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Error debe seleccionar <b>un cliente</b> para realizar la reserva.</span>',
        "",
        {
          timeOut: 4000,
          enableHtml: true,
          closeButton: true,
          toastClass: "alert alert-danger alert-with-icon",
          positionClass: "toast-bottom-center"
        }
      ); 
  }


}
