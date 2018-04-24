import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @ViewChild('selfDialog') selfDialog: ElementRef;
  closeResult: string;
  title: string;
  msg: string;
  purpose: string; // caller will do different action by the purpose (ex: delete space or delete table)
  showFooter = true;

  @Output('confirm') confirm = new EventEmitter();
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  show(title, msg, purpose) {
    this.title = title;
    this.msg = msg;
    this.purpose = purpose;
    this.showFooter = true;
    this.open();
  }

  alert(title, msg) {
    this.title = title;
    this.msg = msg;
    this.showFooter = false;
    this.open();
  }

  alertReadOnly() {
    this.title = 'Guest Mode';
    this.msg = 'In the Guest Mode, content cannot be changed.';
    this.showFooter = false;
    this.open();
  }

  open() {
    this.modalService.open(this.selfDialog).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'confirm') {
          this.confirm.emit( {'purpose': this.purpose});
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
