import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ProjectListComponent } from './pages/project-list/project-list';
import { CreateProjectComponent } from './pages/create-project/create-project'; 
import { ProjectDetailsComponent } from './pages/project-details/project-details';
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { 
    path: 'projects', 
    component: ProjectListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'create-project', 
    component: CreateProjectComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'projects/:id', 
    component: ProjectDetailsComponent,
    canActivate: [authGuard] 
  } 
];