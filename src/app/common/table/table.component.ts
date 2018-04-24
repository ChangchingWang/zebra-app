import { Component, OnInit, Input, Output, ViewChild, ElementRef  } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { TableService } from '../../services/table/table.service';
import { FieldService } from '../../services/field/field.service';
import { RecordService } from '../../services/record/record.service';

import { DialogComponent } from '../../common/dialog/dialog.component';
import { FieldEditorComponent } from '../../common/field-editor/field-editor.component';
import { RecordEditorComponent } from '../../common/record-editor/record-editor.component';

import { CommonUtils } from '../../utils/common.utils';
import { TableFunctions } from './table.funs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild(FieldEditorComponent) fieldEditor: FieldEditorComponent;
  @ViewChild(RecordEditorComponent) recordEditor: RecordEditorComponent;

  @Input('space') space: any;
  @Input('table') table: any;
  @Input('tables') tables: any; // all the tables in this space
  @Input('tableSetting') tableSetting: any;

  allOtherTables: any; // all the tables except for this table
  fields: any;
  records: any; // could be result of filter
  allRecords: any; // all the records

  focusedCell: any;

  deletingField: any; // field to be deleted.
  deletingRecord: any; // record to be deleted.

  rowHeight = '20px';

  filterField: any;

  showLoadiong: boolean;

  // -------------------------------------
  showRowHeight = false;
  showSortByField = false;
  showFilterByValue = false;
  showFieldDisplay = false;
  // -------------------------------------
  constructor(
    private authService: AuthService,
    private tableService: TableService,
    private fieldService: FieldService,
    private recordService: RecordService) { }

  ngOnInit() {
    this.showLoadiong = true;
    this.allOtherTables = this.tables.filter( eachTable => eachTable.tableId !== this.table.tableId);
    this.listFields();
  }

  hideAllDropdown() {
    this.showRowHeight = false;
    this.showSortByField = false;
    this.showFilterByValue = false;
    this.showFieldDisplay = false;
  }
  switchShowRowHeight() {
    const oldValue = this.showRowHeight;
    this.hideAllDropdown();
    this.showRowHeight = !oldValue;
  }
  switchShowSortByField() {
    const oldValue = this.showSortByField;
    this.hideAllDropdown();
    this.showSortByField = !oldValue;
  }
  switchShowFilterByValue() {
    const oldValue = this.showFilterByValue;
    this.hideAllDropdown();
    this.showFilterByValue = !oldValue;
  }
  switchShowFieldDisplay() {
    const oldValue = this.showFieldDisplay;
    this.hideAllDropdown();
    this.showFieldDisplay = !oldValue;
  }

  isReadMode() {
    const isReadMode = this.authService.isReadMode();
    // console.log('========= READ MODE ========= ', isReadMode);
    return isReadMode;
  }

  alertReadOnly() {
    this.dialog.alertReadOnly();
  }

  // used for show or hide field
  initTableSettingFieldView(fields) {
    // if not empty : return
    if (JSON.stringify(this.tableSetting.fieldView) !== JSON.stringify({})) {
      return;
    }

    for (const field of fields) {
      this.tableSetting.fieldView[field.fieldId] = 'Y';
    }
  }

  setSortType(type) {
    this.tableSetting.sortType = type;
  }
  setRowHeight(height) {
    this.tableSetting.rowHeight = height;
  }

  resetLastFocused() {
    if (this.focusedCell) {
      this.focusedCell.focused = false;
    }
  }

  focusKey(record) {
    this.resetLastFocused();
    record.focused = true;
    this.focusedCell = record;
  }

  focus(fieldValue) {
    this.resetLastFocused();
    fieldValue.focused = true;
    this.focusedCell = fieldValue;
  }

  showAllFields(flag) {
    if (flag) {
      for (const field of this.fields) {
        this.tableSetting.fieldView[field.fieldId] = 'Y';
      }
    } else {
      for (const field of this.fields) {
        if (field.isKey) {
          continue;
        }
        this.tableSetting.fieldView[field.fieldId] = '';
      }
    }
  }

  listFields() {
    // console.log('Table Component.listField() --> ');
    const userId = this.authService.getCurrentUser();
    this.fieldService.list(userId, this.space.spaceId, this.table.tableId).subscribe(
      (fields: any[]) => {
        this.initTableSettingFieldView(fields);

        fields.sort(function (a, b) {
          return a.fieldId - b.fieldId;
        });
        // console.log('Table Component.listField() --> fields = ', fields);
        this.fields = fields;
        this.filterField = this.fields[0];
        // load all records
        this.listRecords(this.tableSetting.sortField);
      },
      (err) => {
        console.log('Table Component.listField() --> ERROR: ', err);
      }
    );
  }

  userAddField() {
    this.hideAllDropdown();

    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }
    if (this.fields.length >= 10) {
      this.dialog.alert('Free Plan limitation', 'The field limits is 10 for free plan users.');
      return;
    }

    this.fieldEditor.showForAdd();
  }

  userUpdateField(field) {
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }

    // console.log('Table Component.userUpdateField() --> field', field);
    if (field.dataType === 'select') {
      this.fieldEditor.showForEditSelect(field.fieldId, field.fieldName, field.options);
    } else {
      this.fieldEditor.showForEdit(field.fieldId, field.fieldName);
    }
  }

  handleFieldConfirm(obj) {
    // console.log('Table Component.handleFieldConfirm() --> obj =', obj);
    const fieldId = obj.fieldId;
    if (obj.purpose === 'add') {
      this.addField(obj);
    } else if (obj.purpose === 'update') {
      this.updateField(fieldId, {'fieldName': obj.fieldName});
    } else if (obj.purpose === 'updateSelect') {
      this.updateField(fieldId, {'fieldName': obj.fieldName, 'options': obj.options});
    }
  }

  addField(obj) {
    obj.isKey = false;
    // console.log('Table Component.addField() --> obj', obj);

    const userId = this.authService.getCurrentUser();
    this.fieldService.create(userId, this.space.spaceId, this.table.tableId, obj).subscribe(
      (field: any) => {
        // console.log('Table Component.addField() --> fields = ', field);
        this.fields.push(field);
        this.tableSetting.fieldView[field.fieldId] = 'Y';
        // update UI
        for (const record of this.records) {
          record.otherValues.push({
            'fieldId': field.fieldId,
            'fieldName': field.fieldName,
            'dataType': field.dataType,
            'value': '',
            'linkRecord': {'_id': '', 'keyValue': ''},
            'optionColor': '',
          });
        }
      },
      (err) => {
        console.log('Table Component.addField() --> ERROR: ', err);
      }
    );
  }

  updateField(fieldId, obj) {
    // console.log('Table Component.updateField() --> obj', obj);
    const userId = this.authService.getCurrentUser();
    this.fieldService.update(
      userId,
      this.space.spaceId,
      this.table.tableId,
      fieldId,
      obj)
    .subscribe(
      (field: any) => {
        // console.log('Table Component.updateField() --> fields = ', field);
        const index = this.fields.findIndex( aField => aField.fieldId === field.fieldId);
        this.fields.splice(index, 1, field);
      },
      (err) => {
        console.log('Table Component.updateField() --> ERROR: ', err);
      }
    );
  }

  userDeleteField(field) {
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }

    if (field.isKey) {
      return;
    }
    this.deletingField = field;
    const title = 'Deleting Field';
    const msg = `Are you sure you want to delete field ${field.fieldName}?`;
    const purpose = 'deleteField';
    this.dialog.show(title, msg, purpose);
  }

  deleteField() {
    // console.log('Table Component.deleteField() -->');
    // update UI
    const index = this.fields.findIndex( aField => aField.fieldId === this.deletingField.fieldId);
    this.fields.splice(index, 1);
    TableFunctions.deleteFieldInRecordsForUI(this.records, this.deletingField.fieldId);
    // update backend
    const userId = this.authService.getCurrentUser();
    this.fieldService.delete(userId, this.space.spaceId, this.table.tableId, this.deletingField.fieldId).subscribe(
      (field: any) => {
        // console.log('Table Component.deleteField() --> fields = ', field);
        // load all records
        const fieldIndex = this.fields.findIndex( aField => aField.fieldId === field.fieldId);
        this.fields.splice(fieldIndex, 1);
        for (const record of this.records) {
          const fieldValuleIndex = record.otherValues.findIndex( aFieldValue => aFieldValue.fieldId === field.fieldId);
          record.otherValues.splice(fieldValuleIndex, 1);
        }
        // this.listFields();
      },
      (err) => {
        console.log('Table Component.deleteField() --> ERROR: ', err);
      }
    );
  }

  userSortByField(field) {
    this.tableSetting.sortField = field;
    const sortFieldId = (field.isKey ? 'keyValue' : field.fieldId);
    TableFunctions.sortRecord(this.records, sortFieldId, this.tableSetting.sortType);
  }

  // #####################  Record  ##############################################
  // #####################  Record  ##############################################

  // related to filter by value
  showAllRecords() {
    this.records = this.allRecords;
  }

  listRecords(sortField?: any) {
    // console.log('Table Component.listRecords() --> sortFieldId = ', sortField);
    const userId = this.authService.getCurrentUser();
    this.recordService.list(userId, this.space.spaceId, this.table.tableId).subscribe(
      (records: any[]) => {
        // console.log('Table Component.listRecords() --> records = ', records);
        TableFunctions.preProcessRecords(this.fields, records, sortField, this.tableSetting.sortType);
        this.records = records;
        this.allRecords = records;
        this.showLoadiong = false;
      },
      (err) => {
        console.log('Table Component.listRecords() --> ERROR: ', err);
      }
    );
  }

  userAddRecord() {
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }

    if (this.records.length >= 30) {
      this.dialog.alert('Free Plan limitation', 'The record limits is 30 for free plan users.');
      return;
    }

    // console.log('Table Component.userAddRecord() --> ');
    const userId = this.authService.getCurrentUser();
    const spaceId = this.space.spaceId;
    const tableId = this.table.tableId;
    const newRecord = {'keyValue': '', 'otherValues': []};
    for (const field of this.fields) {
      if (field.isKey) {
        continue;
      }
      const otherValue = {
        'fieldId': field.fieldId,
        'fieldName': field.fieldName,
        'dataType': field.dataType,
        'value': '',
        'linkRecord': null
      };
      newRecord.otherValues.push(otherValue);
    }

    this.recordService.create(userId, spaceId, tableId, newRecord).subscribe(
      (resultRecord) => {
        // console.log('Table Component.userAddRecord() --> records = ', resultRecord);
        this.records.push(resultRecord);
      },
      (err) => {
        console.log('Table Component.userAddRecord() --> ERROR: ', err);
      }
    );
  }

  userViewRecord(record) {
    // console.log('Table Component.userViewRecord() --> record=', record);
    this.recordEditor.show('Viewing Record', 'view', this.space, this.table, record, this.fields);
  }

  userUpdateRecord(record) {
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }

    // console.log('Table Component.userUpdateRecord() --> record=', record);
    this.recordEditor.show('Editing Record', 'update', this.space, this.table, record, this.fields);
  }

  handleRecordConfirm(obj) {
    // console.log('Table Component.handleRecordConfirm() --> obj =', obj);
    this.updateRecord(obj);
  }

  updateRecord(obj) {
    // console.log('Table Component.updateRecord() --> obj = ', obj);

    const record = obj.record;
    const userId = this.authService.getCurrentUser();
    const updateObj = {
      keyValue: record.keyValue,
      otherValues: []
    };
    for (const fieldValue of record.otherValues) {
      updateObj.otherValues.push({
        fieldId: fieldValue.fieldId,
        value: fieldValue.value,
        linkRecord: (fieldValue.linkRecord._id.length > 0 ? fieldValue.linkRecord._id : null)
      });
      // update UI: add optionColor
      if (fieldValue.dataType === 'select') {
        const fieldOfThisCell = this.fields.find( aField => aField.fieldId === fieldValue.fieldId);
        const option = fieldOfThisCell.options.find( aOption => aOption.optionName === fieldValue.value);
        // chances are some select cell doesn't have the value
        if (option) {
          fieldValue.optionColor = option.color;
        }
      }
    }

    this.recordService.update(userId, this.space.spaceId, this.table.tableId, record.recordId, updateObj).subscribe(
      (result) => {
        // console.log('Table Component.updateRecord() --> result = ', result);
      },
      (err) => {
        console.log('Table Component.updateRecord() --> ERROR: ', err);
      }
    );
  }

  userDeleteRecord(record) {
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }

    // console.log('Table Component.userDeleteRecord() --> record=', record);
    this.deletingRecord = record;
    const title = 'Deleting Record';
    const msg = `Are you sure you want to delete record ${record.keyValue}?`;
    const purpose = 'deleteRecord';
    this.dialog.show(title, msg, purpose);
  }

  deleteRecord() {
    // console.log('Table Component.deleteRecord() -->');
    const userId = this.authService.getCurrentUser();
    const index = this.records.findIndex( aRecord => aRecord.recordId === this.deletingRecord.recordId);
    this.records.splice(index, 1);
    this.recordService.delete(userId, this.space.spaceId, this.table.tableId, this.deletingRecord.recordId).subscribe(
      (record) => {
        // console.log('Table Component.deleteRecord() --> record = ', record);
      },
      (err) => {
        console.log('Table Component.deleteRecord() --> ERROR: ', err);
      }
    );
  }

  userFilter(event) {
    this.showAllRecords();

    const results = this.records.filter( (aRecord) => {
      if (this.filterField.isKey) {
        if (aRecord['keyValue'].includes(event.target.value)) {
          return true;
        }
      } else {
        if (!aRecord[this.filterField.fieldId]) {
          return false;
        }
        if (aRecord[this.filterField.fieldId].includes(event.target.value)) {
          return true;
        }
      }
      return false;
    });
    this.records = results;
  }

  // =================================================

  filterImg(fieldValue) {
    if (fieldValue.dataType !== 'image') {
      return fieldValue.value;
    }
  }

  handleDialogConfirm(obj) {
    // console.log('handleDialogConfirm() --> ', obj);
    if (obj.purpose === 'deleteField') {
      this.deleteField();
    } else if (obj.purpose === 'deleteRecord') {
      this.deleteRecord();
    }

  }

}
