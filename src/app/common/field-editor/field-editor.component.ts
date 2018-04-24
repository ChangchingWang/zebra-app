import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ColorEditorComponent } from '../../common/color-editor/color-editor.component';

import { AuthService } from '../../services/auth/auth.service';
import { TableService } from '../../services/table/table.service';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css']
})
export class FieldEditorComponent implements OnInit {
  @ViewChild('selfDialog') selfDialog: ElementRef;
  @ViewChild(ColorEditorComponent) optionEditor: ColorEditorComponent;

  @Input('allOtherTables') allOtherTables: any; // all the tables except for this table

  bodyContainerHeight = '150px';

  closeResult: string;
  // ----------------------------------------------------------
  title: string;
  placeholder: string;
  purpose: string;
  // -----------------------------------------------------------
  fieldId: string; // used for editing field
  fieldName: string;
  dataTypes: any;
  dataType: any;
  options: any;
  linkTable: any; // used when data type is link table
  // -----------------------------------------------------------
  showDataType: boolean;
  showSelectOption: boolean;
  showTableOption: boolean;

  @Output('confirm') confirm = new EventEmitter();
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private tableService: TableService
  ) {}

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.dataTypes = [
      {'value': 'text', 'name': 'Text'},
      {'value': 'select', 'name': 'Select'},
      {'value': 'check', 'name': 'Check Box'},
      {'value': 'date', 'name': 'Date'},
      {'value': 'image', 'name': 'Image'}
    ];
    this.fieldName = '';
    this.dataType = this.dataTypes[0];
    this.linkTable = (this.allOtherTables.length > 0 ? this.allOtherTables[0] : null);
    if (this.linkTable !== null) {
      this.dataTypes.push({'value': 'link', 'name': 'Link A Table'});
    }
    this.options = [];
  }

  getIconText(value) {
    if (value === 'text' ) {
      return 'text_field';
    }
    if (value === 'check' ) {
      return 'check_box';
    }
    if (value === 'date' ) {
      return 'today';
    }
    if (value === 'select' ) {
      return 'menu';
    }
    if (value === 'link' ) {
      return 'link';
    }
    if (value === 'image' ) {
      return 'image';
    }
  }

  showForAdd() {
    this.title = 'Adding Field';
    this.placeholder = 'New Field Name';
    this.purpose = 'add';

    this.showDataType = true;
    this.showSelectOption = false;
    this.showTableOption = false;

    this.bodyContainerHeight = '150px';

    this.open();
  }

  showForEdit(fieldId, fieldName) {
    this.title = 'Editing Field';
    this.placeholder = 'Field Name';
    this.purpose = 'update';

    this.showDataType = false;
    this.showSelectOption = false;
    this.showTableOption = false;

    this.fieldId = fieldId;
    this.fieldName = fieldName;

    this.bodyContainerHeight = '80px';

    this.open();
  }

  showForEditSelect(fieldId, fieldName, options) {
    this.title = 'Editing Field';
    this.placeholder = 'Field Name';
    this.purpose = 'updateSelect';

    this.showDataType = false;
    this.showSelectOption = true;
    this.showTableOption = false;

    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.options = options;

    this.bodyContainerHeight = '450px';
    this.open();
  }

  open() {
    this.modalService.open(this.selfDialog).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
       if (result === 'confirm') {
          this.confirm.emit( {
            'purpose': this.purpose,
            'dataType': this.dataType.value,
            'fieldId': this.fieldId,
            'fieldName': this.fieldName,
            'linkTableId': (this.linkTable ? this.linkTable.tableId : 0),
            'options': this.options});
        }
        this.reset();
      },
      // closed by clicking backdrop or pressing ESC
      (reason) => {
        this.reset();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  userChangeDataType() {
    if (this.dataType.value === 'text'
      || this.dataType.value === 'date'
      || this.dataType.value === 'check') {
      this.showSelectOption = false;
      this.showTableOption = false;
      this.bodyContainerHeight = '150px';
    } else if (this.dataType.value === 'select') {
      this.showSelectOption = true;
      this.showTableOption = false;
      this.bodyContainerHeight = '450px';
    } else if (this.dataType.value === 'link') {
      this.showSelectOption = false;
      this.showTableOption = true;
      this.bodyContainerHeight = '180px';
    }
  }

  userAddOption() {
    this.optionEditor.show('Adding Option', 'New Option Name', 'add', '', '', 'dodgerBlue');
  }

  userDeleteOption(option) {
    const result = this.options.filter( eachOption => eachOption.optionName !== option.optionName);
    // console.log('userDeleteOption() --> result=', result);
    this.options = result;
  }

  // After user editing option
  handleOptionConfirm(obj) {
    const newOption = {'optionName': obj.name, 'color': obj.color};
    this.options.push(newOption);
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
