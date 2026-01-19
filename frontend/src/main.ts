import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

/**
 * Application entry point.
 *
 * <p>
 * Bootstraps the Angular application by loading the root AppModule.
 * This file is executed first when the application starts in the browser.
 * </p>
 */
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
