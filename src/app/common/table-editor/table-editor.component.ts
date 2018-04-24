import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.css']
})
export class TableEditorComponent implements OnInit {
  @ViewChild('dialog') dialog: ElementRef;
  closeResult: string;
  title: '';
  placeholder: '';
  purpose: '';
  tableId: '';
  tableName: '';

  @Output('confirm') confirm = new EventEmitter();
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  show(title, placeholder, purpose, tableId, tableName) {
    this.title = title;
    this.placeholder = placeholder;
    this.purpose = purpose;
    this.tableId = tableId;
    this.tableName = tableName;
    this.open();
  }

  open() {
    this.modalService.open(this.dialog, { size: 'sm' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'confirm') {
          this.confirm.emit( {
            'purpose': this.purpose,
            'tableId': this.tableId,
            'tableName': this.tableName});
        }
      },
      // closed by clicking backdrop or pressing ESC
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
