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
  private cd = inject(ChangeDetectorRef);

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
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading project', err)
    });
  }

  loadTasks() {
    this.http.get<any[]>(`${this.apiUrl}/${this.projectId}/tasks`).subscribe({
      next: (data) => {
        this.tasks = data.sort((a, b) => {
          return a.id > b.id ? 1 : -1;
        });
        
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) {
      alert("Title is required");
      return;
    }
    if (!this.newTaskDueDate) {
      alert("Due Date is required");
      return;
    }
    const task = {
      title: this.newTaskTitle,
      description: this.newTaskDescription || 'No description provided',
      dueDate: this.newTaskDueDate, 
      completed: this.newTaskStatus 
    };

    this.http.post(`${this.apiUrl}/${this.projectId}/tasks`, task).subscribe({
      next: (res) => {
        this.tasks.push(res);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskDueDate = '';
        this.newTaskStatus = false;

        this.showTaskForm = false;
        
        this.loadProject(); 
        this.cd.detectChanges(); 
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
        task.completed = updatedStatus;
        this.loadProject(); 
        this.cd.detectChanges();
      },
      error: (err) => {
        alert('Update failed');
        task.completed = !updatedStatus; 
      }
    });
  }

  deleteTask(taskId: string) {
    if(!confirm('Are you sure?')) return;

    this.http.delete(`${this.apiUrl}/tasks/${taskId}`).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId); 
        this.loadProject();
        this.cd.detectChanges();
      },
      error: (err) => alert('Error deleting task')
    });
  }
}