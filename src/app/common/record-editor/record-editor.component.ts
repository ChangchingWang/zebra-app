import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { AuthService } from '../../services/auth/auth.service';
import { TableService } from '../../services/table/table.service';
import { FieldService } from '../../services/field/field.service';
import { RecordService } from '../../services/record/record.service';


@Component({
  selector: 'app-record-editor',
  templateUrl: './record-editor.component.html',
  styleUrls: ['./record-editor.component.css']
})
export class RecordEditorComponent implements OnInit {
  @ViewChild('selfDialog') selfDialog: ElementRef;
  @ViewChild('f') form: NgForm;
  closeResult: string;
  title = '';
  purpose = '';

  space: any;
  table: any;
  record: any;
  keyName: any;
  // Since the editor's UI is binding to record, the model should be reset when user
  // click cancel after editing any fields. resetRecord saves the old value.
  oldRecord: any = {};
  thisTableFields: any;

  // all options of a select type field
  // {
  //   'fieldId': [{'optionName':'xxx', 'color':'xxx'}], // the type is select
  //   'fieldId': [recordObj, recordObj, recordObj] // the type is link
  // }
  fieldOptions: any = {};

  @Output('confirm') confirm = new EventEmitter();
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private tableService: TableService,
    private fieldService: FieldService,
    private recordService: RecordService,
  ) {}


  ngOnInit() {
  }

  show(title, purpose, space, table, record, thisTableFields) {
    this.title = title;
    this.purpose = purpose;
    this.space = space;
    this.table = table;
    this.record = record;
    this.keyName = thisTableFields[0].fieldName;
    this.thisTableFields = thisTableFields;
    this.open();
    this.initData();
  }

  initData() {
    this.buildOldRecord();
    if (this.purpose === 'update') {
      this.setDateObj();
      this.retrieveOptions();
    }
  }

  buildOldRecord() {
    this.oldRecord = JSON.parse(JSON.stringify(this.record));
  }

  resetRecord() {
    this.record.keyValue = this.oldRecord.keyValue;
    this.record.otherValues = this.oldRecord.otherValues;
    this.record.focused = false;
    for ( const fieldValue of this.record.otherValues) {
      fieldValue.focused = false;
    }
  }

  setDateObj() {
    for (const fieldValue of this.record.otherValues) {
      if (fieldValue.dataType === 'date') {
        const arr = fieldValue.value.split('-');
        fieldValue.dateObj = {
          year: arr[0],
          month: arr[1],
          day: arr[2]
        };
      }
    }
  }

  async retrieveOptions() {
    for (const fieldValue of this.record.otherValues) {
      const targetField = this.thisTableFields.find(aField => aField.fieldId === fieldValue.fieldId);

      // type: select
      if (targetField.dataType === 'select') {
        this.fieldOptions[targetField.fieldId] = targetField.options;
      }
      // type: link
      if (targetField.dataType === 'link') {
        // const linkTableId = targetField.linkTableId;
        // // query all records of that table
        // const userId = this.authService.getCurrentUser();
        // const records = await this.recordService.list(userId, this.space.spaceId, linkTableId).toPromise();
        this.fieldOptions[targetField.fieldId] = targetField.linkTableRecords;
      }
    }
  }

  showUploadedImg(fileInput: any, fieldValue: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ((e: any) => {
        fieldValue.value = e.target['result'];
      });

      reader.readAsDataURL(fileInput.target.files[0]);
    } else {
      console.log('not found');
    }
  }

  deleteImage(fieldValue, f) {
    f.value = '';
    fieldValue.value = null;
  }

  open() {
    this.modalService.open(this.selfDialog, { size: 'lg' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'confirm') {
          for (const fieldValue of this.record.otherValues) {
            // process date
            if (fieldValue.dateObj && fieldValue.dateObj.year && fieldValue.dateObj.month && fieldValue.dateObj.day) {
              fieldValue.value = `${fieldValue.dateObj.year}-${fieldValue.dateObj.month}-${fieldValue.dateObj.day}`;
            }
            // update UI: copy linkRecord's keyValue to fieldValue.value
            if (fieldValue.linkRecord && fieldValue.linkRecord._id.length > 0) {
              fieldValue.value = fieldValue.linkRecord.keyValue;
            }
          }

          // console.log('Record Editor Confirm --> record =', this.record);
          this.confirm.emit( {
            'purpose': this.purpose,
            'record': this.record});
        } else {
          this.resetRecord();
        }
      },
      // closed by clicking backdrop or pressing ESC
      (reason) => {
        this.resetRecord();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  keyTEChange(ev) {
    this.record.keyValue = ev.target.value;
  }

  otherTEChange(ev, keyValue) {
    keyValue.value = ev.target.value;
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
