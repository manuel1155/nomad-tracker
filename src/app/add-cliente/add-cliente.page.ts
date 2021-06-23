import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ClientesService } from './../servicios/clientes/clientes.service';
import Swal from 'sweetalert2';
import { AuthService } from '../servicios/auth/auth.service';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.page.html',
  styleUrls: ['./add-cliente.page.scss'],
})
export class AddClientePage implements OnInit {

  formCliente: FormGroup;
  currentCli: any = null;
  @Input() origen: string = 'cliente';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cliService: ClientesService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) {
    this.formCliente = this.fb.group({
      nombre_cli: ['', Validators.required],
      rfc_cli: '',
      name_cont_admin_cli: '',
      num_cont_admin_cli: '',
    });

    console.log(this.origen);
    console.log(this.router.getCurrentNavigation());
    if (this.router.getCurrentNavigation() != null) {
      this.route.queryParams.subscribe(async params => {
        console.log(this.router);
        if (this.router.getCurrentNavigation().extras.state) {
          console.log('con parametros')
          this.currentCli = this.router.getCurrentNavigation().extras.state.prosp;
          this.loadCliData();
        } else {
          console.log('sin parametros origen cliente')
          this.currentCli = null;
        }
      });
    } else {
      console.log('sin parametros origen modal')
      this.currentCli = null;
    }

  }

  ngOnInit() {
    console.log(this.origen)
  }

  loadCliData() {

    this.formCliente.patchValue({
      nombre_cli: this.currentCli.nombre_cli,
      rfc_cli: this.currentCli.rfc_cli,
      name_cont_admin_cli: this.currentCli.name_cont_admin_cli,
      num_cont_admin_cli: this.currentCli.num_cont_admin_cli,
    });

  }

  goToClientes() {
    this.router.navigate(['/clientes']);
  }


  guardarCli() {

    Swal.fire({
      title: "Registrando Prospecto",
      text: "La información se esta subiendo al sistema",
      showCloseButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let post = this.formCliente.value;

    if (this.currentCli) {
      post['user_mod'] = this.auth.currentUserId;
      post['f_modificado'] = new Date();
      post['idSistema'] = this.currentCli.idSistema;
      post['id'] = this.currentCli.id;
      this.cliService.updateCliente(post).then((data) => {
        Swal.close();
        Swal.fire({
          title: "Cliente modificado",
          text: "El cliente ha sido modificado correctamente.",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.formCliente.reset();
          this.router.navigate(['/clientes']);
        });
      });
    }
    else {
      post['user_reg'] = this.auth.currentUserId;
      this.cliService.createCliente(post).then((data) => {
        Swal.close();
        Swal.fire({
          title: "Cliente registrado",
          text: "El cliente ha sido registrado correctamente, el ID con el que se registro es " + data['idSistema'] + ".",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.formCliente.reset();
          if (this.origen == 'modal') this.modalController.dismiss({ 'success': true });
          else this.router.navigate(['/clientes']);
        });
      });

    }

  }

  closeModal() {
    this.modalController.dismiss({
      'success': false
    });
  }

}
