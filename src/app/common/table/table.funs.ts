import { Injectable } from '@angular/core';

@Injectable()
export class TableFunctions {

  constructor() { }

  static preProcessRecords(fields, records, sortField, sortType) {
    for (const record of records) {
      TableFunctions.makeUpFieldInfo(fields, record);
      TableFunctions.organizeRecord(fields, record);
      TableFunctions.sortOtherValuesByFieldId(record);
      TableFunctions.flatOtherValues(record);
    }

    if (sortField) {
      const sortFieldId = (sortField.isKey ? 'keyValue' : sortField.fieldId);
      TableFunctions.sortRecord(records, sortFieldId, sortType);
    }
  }

  // 1. add field not in the record
  // 2. retrieve field info (fieldName, dataType, optionColor)
  static makeUpFieldInfo(fields, record) {
    // add empty field in record
    for (const field of fields) {
      if (field.isKey) {
        continue;
      }
      if (!record.otherValues.find( fieldValueObj => fieldValueObj.fieldId === field.fieldId)) {
        record.otherValues.push({
          'fieldId': field.fieldId,
          'fieldName': field.fieldName,
          'dataType': field.dataType,
          'value': '',
          'linkRecord': {'_id': 0, 'keyValue': ''},
          'optionColor': ''
        });
      } else {
        // retrieve fieldName, dataType, optionColor
        const fieldValue = record.otherValues.find( aFieldValue => aFieldValue.fieldId === field.fieldId);
        fieldValue.fieldName = field.fieldName;
        fieldValue.dataType = field.dataType;
        if (fieldValue.dataType === 'select') {
          const option = field.options.find( aOption => aOption.optionName === fieldValue.value);
          if (option) {
            fieldValue.optionColor = option.color;
          } else {
            // which means this is an old option, has been deleted.
            // So, I should reset the value;
            fieldValue.value = '';
          }
        }
      }
    }
  }

  // 1. remove old key in any record
  // 2. copy linkRecord.keyValule to value
  // 3. make empty linkRecord for other data types (this is for select binding)
  static organizeRecord(fields, record) {
    const newOtherValues = [];
      for (const fieldValue of record.otherValues) {
        if (fields.find( field => field.fieldId === fieldValue.fieldId)) {
          newOtherValues.push(fieldValue);

          if (fieldValue.dataType === 'link') {
            if (fieldValue.linkRecord) {
              fieldValue.value = fieldValue.linkRecord.keyValue;
            } else {
              // case1: link table has been deleted.
              // case2: this fieldValue has not select a linkRecord yet.
              fieldValue.linkRecord = {'_id': 0, 'keyValue': ''};
              fieldValue.value = '';
            }
          } else {
            fieldValue.linkRecord = {'_id': 0, 'keyValue': ''};
          }
        }
      }
      record.otherValues = newOtherValues;
  }

  static sortOtherValuesByFieldId(record) {
    record.otherValues.sort((a, b) => a.fieldId - b.fieldId);
  }

  // copy all other values as properties to each record
  static flatOtherValues(record) {
    for (const fieldValue of record.otherValues) {
      record[fieldValue.fieldId] = fieldValue.value;
    }
  }

  static commonCompare(aValue, bValue) {
    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  }

  static sortRecord(records, sortFieldId, sortType) {
    if (sortType === 'asc') {
      records.sort(function(a, b) {
        return TableFunctions.commonCompare(a[sortFieldId], b[sortFieldId]);
      });
    } else {
      records.sort(function(a, b) {
        return TableFunctions.commonCompare(b[sortFieldId], a[sortFieldId]);
      });
    }
  }

  // The purpose is to update current UI.
  static deleteFieldInRecordsForUI(records, fieldId) {
    for (const record of records) {
      if ( record.hasOwnProperty(fieldId.toString())) {
        delete record[fieldId.toString];
      }
      const index = record.otherValues.findIndex(fieldValue => fieldValue.fieldId === fieldId);
      record.otherValues.splice(index, 1);
    }
  }

}
