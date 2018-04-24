import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { Ng2FileDropModule } from 'ng2-file-drop';

import { DialogComponent } from './common/dialog/dialog.component';
import { ColorEditorComponent } from './common/color-editor/color-editor.component';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SpaceComponent } from './pages/space/space.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { FrontComponent } from './pages/front/front.component';
import { SignupComponent } from './pages/signup/signup.component';

import { HttpUtil } from './utils/http.util';

import { AuthService } from './services/auth/auth.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { ConfigService } from './services/config/config.service';
import { SpaceService } from './services/space/space.service';
import { TableService } from './services/table/table.service';
import { FieldService } from './services/field/field.service';
import { RecordService } from './services/record/record.service';
import { TableComponent } from './common/table/table.component';
import { FieldEditorComponent } from './common/field-editor/field-editor.component';
import { TableEditorComponent } from './common/table-editor/table-editor.component';
import { RecordEditorComponent } from './common/record-editor/record-editor.component';
import { FieldLabelComponent } from './common/field-label/field-label.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SpaceComponent,
    NotFoundComponent,
    LoginComponent,
    FrontComponent,
    SignupComponent,
    DialogComponent,
    ColorEditorComponent,
    TableComponent,
    FieldEditorComponent,
    TableEditorComponent,
    RecordEditorComponent,
    FieldLabelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot(),
    // Ng2FileDropModule,
    RouterModule.forRoot([
      { path: '', component: FrontComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] }, // list all spaces
      { path: 'space', component: SpaceComponent, canActivate: [AuthGuardService] }, // Get in a space, list tables
      { path: '**', component: NotFoundComponent }
    ])
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ConfigService,
    SpaceService,
    TableService,
    FieldService,
    RecordService,
    HttpUtil
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
