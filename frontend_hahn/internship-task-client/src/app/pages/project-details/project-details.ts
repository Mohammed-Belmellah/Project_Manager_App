import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cd = inject(ChangeDetectorRef); // <--- Inject it here

  project: any = null;
  tasks: any[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskDueDate = ''; 
  newTaskStatus = false;

  showTaskForm = false;
  
  projectId = '';
  apiUrl = 'http://localhost:8083/api/projects';

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.projectId) {
      this.loadProject();
      this.loadTasks();
    }
  }

  loadProject() {
    this.http.get(`${this.apiUrl}/${this.projectId}`).subscribe({
      next: (data) => {
        this.project = data;
        this.cd.detectChanges(); // <--- FORCE UPDATE HERE
      },
      error: (err) => console.error('Error loading project', err)
    });
  }

  loadTasks() {
    this.http.get<any[]>(`${this.apiUrl}/${this.projectId}/tasks`).subscribe({
      next: (data) => {
        // 🛑 FIX: Sort the tasks so they don't jump around
        // Here we sort by ID (Creation Order). 
        // You could also sort by 'dueDate' if you prefer.
        this.tasks = data.sort((a, b) => {
          // Compare IDs (strings or numbers) to keep creation order
          return a.id > b.id ? 1 : -1;
        });
        
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  addTask() {
    // Basic validation
    if (!this.newTaskTitle.trim()) {
      alert("Title is required");
      return;
    }
    if (!this.newTaskDueDate) {
      alert("Due Date is required");
      return;
    }

    // 2. UPDATED: Use the real values from the form
    const task = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || 'No description provided', // Fallback if empty
      dueDate: this.newTaskDueDate, // The input type="date" gives "YYYY-MM-DD" automatically
      completed: this.newTaskStatus 
    };

    this.http.post(`${this.apiUrl}/${this.projectId}/tasks`, task).subscribe({
      next: (res) => {
        this.tasks.push(res);
        
        // 3. UPDATED: Reset the entire form
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskDueDate = '';
        this.newTaskStatus = false;

        this.showTaskForm = false;
        
        this.loadProject(); // Update progress bar
        this.cd.detectChanges(); // Force screen update
      },
      error: (err) => alert('Failed to add task')
    });
  }

  toggleTaskStatus(task: any) {
    const updatedStatus = !task.completed;

    this.http.patch(`${this.apiUrl}/tasks/${task.id}`, {}, {
      params: { completed: updatedStatus }
    }).subscribe({
      next: () => {
        // 1. Update Locally (Instant feedback, no jumping)
        task.completed = updatedStatus;
        
        // 2. Only refresh the Progress Bar
        this.loadProject(); 
        
        // 3. Update Screen
        this.cd.detectChanges();
        
        // 🛑 DO NOT call this.loadTasks() here!
      },
      error: (err) => {
        alert('Update failed');
        // Revert on error
        task.completed = !updatedStatus; 
      }
    });
  }

  deleteTask(taskId: string) {
    if(!confirm('Are you sure?')) return;

    this.http.delete(`${this.apiUrl}/tasks/${taskId}`).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId); 
        this.loadProject(); // Refresh progress bar
        this.cd.detectChanges(); // <--- AND HERE
      },
      error: (err) => alert('Error deleting task')
    });
  }
}