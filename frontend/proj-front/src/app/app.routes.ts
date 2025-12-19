import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ProjectListComponent } from './pages/project-list/project-list';
import { CreateProjectComponent } from './pages/create-project/create-project'; 
import { ProjectDetailsComponent } from './pages/project-details/project-details';
import { authGuard } from './guards/auth.guard'; // <--- 1. Import the Guard

export const routes: Routes = [
  // 2. Change Default: Try to go to 'projects' first. 
  // The Guard will check if you have a token.
  // - If YES: You stay on 'projects' (Auto-Login!)
  // - If NO: The Guard sends you to 'login'
  { path: '', redirectTo: 'projects', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // 3. Protect your secure pages
  { 
    path: 'projects', 
    component: ProjectListComponent,
    canActivate: [authGuard] // <--- The Bouncer is here
  },
  { 
    path: 'create-project', 
    component: CreateProjectComponent,
    canActivate: [authGuard] // <--- And here
  },
  { 
    path: 'projects/:id', 
    component: ProjectDetailsComponent,
    canActivate: [authGuard] // <--- And here
  } 
];