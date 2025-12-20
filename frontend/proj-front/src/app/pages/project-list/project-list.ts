import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectListComponent implements OnInit {
  private http = inject(HttpClient);
  private cd = inject(ChangeDetectorRef); 
  
  projects: any[] = [];
  private apiUrl = 'http://localhost:8083/api/projects'; 

  ngOnInit() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log("Data received:", data); 
        this.projects = data;
        this.cd.detectChanges(); 
      },
      error: (err) => console.error("Error fetching projects:", err)
    });
  }
}