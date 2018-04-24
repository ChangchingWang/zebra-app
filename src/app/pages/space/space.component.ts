import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ViewChild,
  ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

import { TableComponent } from '../../common/table/table.component';
import { DialogComponent } from '../../common/dialog/dialog.component';
import { TableEditorComponent } from '../../common/table-editor/table-editor.component';

import { AuthService } from '../../services/auth/auth.service';
import { SpaceService } from '../../services/space/space.service';
import { TableService } from '../../services/table/table.service';
import { FieldService } from '../../services/field/field.service';
import { RecordService } from '../../services/record/record.service';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css']
})
export class SpaceComponent implements OnInit {
  @ViewChild('tabs')
  private tabs: NgbTabset;
  showingTable = null;

  space: any;
  tables: any;
  tableSettings: any = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private spaceService: SpaceService,
    private tableService: TableService,
    private fieldService: FieldService,
    private recordService: RecordService
  ) { }

  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild(TableEditorComponent) tableEditor: TableEditorComponent;
  ngOnInit() {
    this.space = this.spaceService.getSpace();
    this.listTables();
  }

  isReadMode() {
    const isReadMode = this.authService.isReadMode();
    // console.log('========= READ MODE ========= ', isReadMode);
    return isReadMode;
  }

  alertReadOnly() {
    this.dialog.alertReadOnly();
  }

  makeTableSetting(tableId) {
    const tableSetting = {
      sortType: 'asc',
      sortField: undefined,
      rowHeight: 'short',
      fieldView: {}
    };
    this.tableSettings[tableId] = tableSetting;
  }

  async makeTableSettings() {
    for (const table of this.tables) {
      this.makeTableSetting(table.tableId);
    }
  }

  listTables() {
    // console.log('Space Component.listTables() --> ');
    const userId = this.authService.getCurrentUser();
    this.tableService.list(userId, this.space.spaceId).subscribe(
      (tables) => {
        // console.log('Space Component.listTables() --> tables = ', tables);
        this.tables = tables;
        this.makeTableSettings();
        // after adding or deleting table, show specific tab.
        const showTableIndex = this.spaceService.getShowTableIndex();
        // this.tabs.select(`tab${showTableIndex}`); // TODO not working
        this.spaceService.setShowTableIndex(0);
      },
      (err) => {
        console.log('Space Component.listTables() --> ERROR: ', err);
      }
    );
  }

  clickTab(table) {
    this.showingTable = table;
  }

  userAddTable() {
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }
    if (this.tables.length >= 5) {
      this.dialog.alert('Free Plan limitation', 'The table limits is 5 for free plan users.');
      return;
    }

    this.tableEditor.show('Adding Table', 'New Table Name', 'add', '', '');
  }

  userUpdateTable() {
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }
    if (this.showingTable == null) {
      return;
    }

    this.tableEditor.show(
      'Renaming Table',
      'Table Name',
      'update',
      this.showingTable.tableId,
      this.showingTable.tableName);
  }

  userDeleteTable() {
    if (this.showingTable == null) {
      return;
    }
    if (this.isReadMode()) {
      this.alertReadOnly();
      return;
    }

    this.dialog.show('Deleting Table', `Are you sure you want to delete table ${this.showingTable.tableName}`, 'deleteTable');
  }

  handleDialogConfirm(obj) {
    // console.log('handleDialogConfirm() --> ', obj);
    if (obj.purpose === 'deleteTable') {
      this.deleteTable();
    }
  }

  handleTableEditorConfirm(obj) {
    // console.log('Space Component.handleTableEditorConfirm() --> obj=', obj);
    if (obj.purpose === 'add') {
      // console.log('userConfirm --> add table');
      this.addTable(obj.tableName);
    } else if (obj.purpose === 'update') {
      // console.log('userConfirm --> update table');
      this.updateTable(obj.tableId, obj.tableName);
    }
  }

  addTable(tableName) {
    // console.log('Space Component.addTable() --> ');
    const userId = this.authService.getCurrentUser();
    this.tableService.create(userId, this.space.spaceId, tableName).subscribe(
      (table: any) => {
        // console.log('Space Component.addTable() --> table = ', table);
        this.listTables(); // must list tables here as tables.push() not change UI
      },
      (err) => {
        console.log('Space Component.addTable() --> ERROR: ', err);
      }
    );
  }

  updateTable(tableId, tableName) {
    // console.log('Space Component.updateTable() --> {tableId, tableName}=', tableId, tableName);
    const userId = this.authService.getCurrentUser();
    this.tableService.update(userId, this.space.spaceId, tableId, tableName).subscribe(
      (table) => {
        this.showingTable.tableName = tableName;
        // console.log('Space Component.updateTable() --> table = ', table);
      },
      (err) => {
        console.log('Space Component.updateTable() --> ERROR: ', err);
      }
    );
  }

  deleteTable() {
    // console.log('Space Component.deleteTable() --> tableId', this.showingTable.tableId);
    const userId = this.authService.getCurrentUser();
    this.tableService.delete(userId, this.space.spaceId, this.showingTable.tableId).subscribe(
      (table: any) => {
        // console.log('Space Component.deleteTable() --> table = ', table);
        const index = this.tables.findIndex( aTable => aTable.tableId === table.tableId);
        this.tables.splice(index, 1);
      },
      (err) => {
        console.log('Space Component.deleteTable() --> ERROR: ', err);
      }
    );
  }


  // =================================================================
  // =================================================================
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getUserId() {
    return this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  naviateTo(url) {
    this.router.navigate([url]);
  }

}
