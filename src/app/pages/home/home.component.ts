import { Component, OnInit, ViewChild, NgZone  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ConfigService } from '../../services/config/config.service';
import { AuthService } from '../../services/auth/auth.service';
import { SpaceService } from '../../services/space/space.service';
import { HttpUtil } from '../../utils/http.util';

import { DialogComponent } from '../../common/dialog/dialog.component';
import { ColorEditorComponent } from '../../common/color-editor/color-editor.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(DialogComponent) dialog: DialogComponent;
  @ViewChild(ColorEditorComponent) spaceEditor: ColorEditorComponent;
  spaces: any; // show all the spaces
  deleteSpaceId: String; // used when deleting a space

  constructor(
    private zone: NgZone,
    private router: Router,
    private http: HttpClient,
    private config: ConfigService,
    private authService: AuthService,
    private spaceService: SpaceService,
    private httpUtil: HttpUtil
  ) { }

  ngOnInit() {
    this.listSpaces();
  }

  isReadMode() {
    const isReadMode = this.authService.isReadMode();
    // console.log('========= READ MODE ========= ', isReadMode);
    return isReadMode;
  }

  alertReadOnly() {
    this.dialog.alertReadOnly();
  }

  reloadSpaces() {

  }

  handleDialogConfirm(obj) {
    // console.log('handleDialogConfirm() --> ', obj);
    if (obj.purpose === 'delete') {
      this.deleteSpace();
    }
  }

  handleSpaceEditorConfirm(obj) {
    // console.log('Home Component.handleSpaceEditorConfirm() --> obj=', obj);
    if (obj.purpose === 'add') {
      // console.log('userConfirm --> add');
      this.addSpace(obj.name, obj.color);
    } else if (obj.purpose === 'update') {
      // console.log('userConfirm --> update');
      this.updateSpace(
        obj.id,
        obj.name,
        obj.color
      );
    }
  }

  // ======== List Space ==========================================
  listSpaces() {
    // console.log('Home Component.listSpaces() --> ');
    const userId = this.authService.getCurrentUser();
    this.spaceService.list(userId).subscribe(
      (spaces) => {
        // console.log('Home Component.listSpaces() --> spaces = ', spaces);
        this.spaces = spaces;
      },
      (err) => {
        console.log('Home Component.listSpaces() --> ERROR: ', err);
      }
    );
  }

  // ======== Add Space ==========================================
  userAddSpace() {
    if (this.spaces.length >= 5) {
      this.dialog.alert('Free Plan limitation', 'The space limits is 5 for free plan users.');
      return;
    }

    this.spaceEditor.show(
      'Adding Space',
      'Space Name',
      'add',
      '',
      '',
      'dodgerBlue'); // pass default value
  }
  addSpace(spaceName, spaceColor) {
    // console.log('Home Component.addSpace() --> {spaceName, spaceColor} = ', {spaceName, spaceColor} );
    const userId = this.authService.getCurrentUser();
    const obj = {
      'spaceName': (spaceName === '' ? 'Space Name' : spaceName),
      'spaceColor': spaceColor
    };
    this.spaceService.create(userId, obj).subscribe((space) => {
      // console.log('Home Component.addSpace() --> space = ', space);
      // update UI
      this.spaces.push(space);
      this.listSpaces();
    });
  }

  // ======== Update Space ==========================================
  userUpdateSpace(space) {
    // console.log('Home Component.userUpdateSpace() --> space:', space);

    this.spaceEditor.show(
      'Editing Space',
      'Space Name',
       'update',
       space.spaceId,
       space.spaceName,
       space.spaceColor); // pass default value
  }
  updateSpace(spaceId, spaceName, spaceColor) {
    // console.log('Home Component.updateSpace() --> {spaceId, spaceName, spaceColor} = ', {spaceId, spaceName, spaceColor} );
    const userId = this.authService.getCurrentUser();
    const obj = {
      'spaceName': spaceName,
      'spaceColor': spaceColor
    };
    this.spaceService.update(userId, spaceId, obj)
      .subscribe((space) => {
        // console.log('Home Component.updateSpace() --> space = ', space);
        // update UI
        this.listSpaces();
      });
  }

  // ======== Delete Space ==========================================
  userDeleteSpace(space) {
    // console.log('Home Component.userDeleteSpace() --> spaceId:', space.spaceId);
    this.deleteSpaceId = space.spaceId;
    // set dialog info
    const title = 'Deleting Space';
    const msg = `Are you sure you want to delete space ${space.spaceName}?`;
    const purpose = 'delete';
    this.dialog.show(title, msg, purpose);
  }

  deleteSpace() {
    // console.log('Home Component.deleteSpace() --> ');
    const userId = this.authService.getCurrentUser();

    return this.spaceService.delete(userId, this.deleteSpaceId)
      .subscribe((space: any) => {
        // console.log('Home Component.deleteSpace() --> space = ', space);
        // update UI
        const index = this.spaces.findIndex( aSpace => aSpace.sapceId === space.spaceId);
        this.spaces.splice(index, 1);
        // this.listSpaces();
      });
  }

  // ======== Enter Space ==========================================
  userEnterSpace(space) {
    this.spaceService.setSpace(space); // pass space to Space Component
    this.router.navigate(['space']);
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

}
