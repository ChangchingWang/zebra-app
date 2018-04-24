import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-color-editor',
  templateUrl: './color-editor.component.html',
  styleUrls: ['./color-editor.component.css']
})
export class ColorEditorComponent implements OnInit {
  @ViewChild('selfDialog') selfDialog: ElementRef;
  closeResult: string;
  title = '';
  placeholder = '';
  purpose = '';
  id = ''; // If used for edit space, keep sapceId
  name = ''; // for sapce: sapceName; for option: optionName
  color = ''; // for sapce: spaceColor; for option: color

  @Output('confirm') confirm = new EventEmitter();
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  selectColor(color) {
    this.color = color;
  }
  isThisColor(color) {
    const result = this.color === color;
    return this.color === color;
  }

  show(title, placeholder, purpose, id, name, color) {
    this.title = title;
    this.placeholder = placeholder;
    this.purpose = purpose;
    this.id = id;
    this.name = name;
    this.color = color;
    this.open();
  }

  open() {
    this.modalService.open(this.selfDialog, { size: 'sm' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'confirm') {
          this.confirm.emit( {
            'purpose': this.purpose,
            'id': this.id,
            'name': this.name,
            'color': this.color});
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
