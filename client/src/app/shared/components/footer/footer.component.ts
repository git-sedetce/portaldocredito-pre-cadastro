import { Component, OnInit } from '@angular/core';
import { ExternalService } from '../../services/external.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public servicos: ExternalService) {
    
   }

  ngOnInit() {
  }

}
