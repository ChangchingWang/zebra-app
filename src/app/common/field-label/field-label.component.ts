import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-field-label',
  templateUrl: './field-label.component.html',
  styleUrls: ['./field-label.component.css']
})
export class FieldLabelComponent implements OnInit {
  @Input('field') field: any;
  @Input('showTool') showTool: boolean;
  @Input('useSort') useSort: boolean;
  @Input('margin') margin: boolean;
  @Input('headerWidth') headerWidth: boolean;
  @Output('update') update = new EventEmitter();
  @Output('delete') delete = new EventEmitter();
  @Output('sort') sort = new EventEmitter();

  mark: boolean;

  constructor() { }

  ngOnInit() {
  }

  sortByThis() {
    if (this.useSort) {
      this.sort.emit(this.field);
    }
  }

  userUpdateField() {
    this.update.emit(this.field);
  }

  userDeleteField() {
    this.delete.emit(this.field);
  }

}
