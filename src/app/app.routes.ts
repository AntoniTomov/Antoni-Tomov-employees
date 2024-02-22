import { Routes } from '@angular/router';
import { NewPageComponent } from './new-page/new-page.component';
import { TestComponent } from './test/test.component';

export const routes: Routes = [
  { path: 'new-page', component: NewPageComponent },
  { path: 'test', component: TestComponent },
  { path: '**', component: TestComponent },
];
