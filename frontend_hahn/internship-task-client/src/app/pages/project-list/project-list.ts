import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- Import ChangeDetectorRef
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
  private cd = inject(ChangeDetectorRef); // <--- Inject it here
  
  projects: any[] = [];
  private apiUrl = 'http://localhost:8083/api/projects'; 

  ngOnInit() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log("Data received:", data); // Check console to be sure
        this.projects = data;
        
        // 🛑 FORCE UPDATE
        this.cd.detectChanges(); 
      },
      error: (err) => console.error("Error fetching projects:", err)
    });
  }
}