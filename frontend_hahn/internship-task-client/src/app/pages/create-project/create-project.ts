import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css'
})
export class CreateProjectComponent { // <--- Notice the class name is CreateProjectComponent
  http = inject(HttpClient);
  router = inject(Router);

  title = '';
  description = '';
  apiUrl = 'http://localhost:8083/api/projects';

  onSubmit() {
    const newProject = {
      title: this.title,
      description: this.description
    };

    this.http.post(this.apiUrl, newProject).subscribe({
      next: () => {
        alert('Project Created!');
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error(err);
        alert('Error creating project');
      }
    });
  }
}