import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { loggar } from '../services/constantes';

@Component({
  templateUrl: './dlg-message.component.html',
  styleUrls: ['./dlg-message.component.scss']
})
export class DlgMessageComponent implements OnInit {
  titulo: string;
  mensagens: string[];

  constructor(
    public dialogRef: MatDialogRef<DlgMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.titulo = data.titulo;
    this.mensagens = data.message;
  }

  ngOnInit(): void {
    
  }


}
