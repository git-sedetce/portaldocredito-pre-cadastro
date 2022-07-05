import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { loggar } from '../../services/constantes';
import { ExternalService } from '../../services/external.service';
// import variablesMenu from '../../../data/dataset.json';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {
  menu: any;
  constructor(public services: ExternalService,
    private router: Router) {

  }

  ngOnInit() {
  }
  ngOnChanges() {
    if (loggar) console.log('OnChanges');
  }

  logout() {
    this.services.sideBarOpen = false;
    this.services.Perfil = '';
    this.router.navigate(['/login']);
  }
}
