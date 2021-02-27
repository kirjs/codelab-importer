import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ImporterModule} from './importer/importer.module';
import {ImporterComponent} from './importer/importer.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ImporterModule,
  ],
  providers: [],
  bootstrap: [ImporterComponent]
})
export class AppModule { }
