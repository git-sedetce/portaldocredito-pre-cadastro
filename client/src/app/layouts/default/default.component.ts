import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loggar, progress } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  sideBarOpen: boolean;

  constructor(
    public service: ExternalService,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (loggar) console.log('default ngOnInit');
    this.service.sideBarOpen = this.service.Perfil === 'admin';
    if (this.service.Perfil !== 'admin') {
      //this.router.navigate(["/app"]);
      //} else {      
      this.router.navigate(["/login"]);
    } else {
      this.service.showHeader = true;
      this.service.sideBarOpen = true;
    }
  }


  sideBarToggler() {
    this.service.sideBarOpen = !this.service.sideBarOpen;
  }

}
