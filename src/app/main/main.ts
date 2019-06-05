import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '../modules/app.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);