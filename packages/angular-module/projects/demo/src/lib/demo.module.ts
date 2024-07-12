import { DoBootstrap, NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule],
  entryComponents: [DemoComponent],
})
export class DemoModule implements DoBootstrap {
  ngDoBootstrap() {}
}
