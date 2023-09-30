import { Component, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../Services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/Services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../category/models/category-model';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit{
  model: AddBlogPost;
  categories$?: Observable<Category[]>;

  constructor(private blogPostService: BlogPostService, private router: Router, 
    private categoryService: CategoryService
    ) {
    this.model = {
      author: '',
      title: '',
      shortDescription:'',
      content:'', 
      featuredImageUrl:'', 
      urlHandle: '',
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    }
    
  }
  
  ngOnInit(): void {
    this.categories$ = this.categoryService.getََAllCategories();
  }

  onFormSubmit(): void{
      this.blogPostService.createBlogPost(this.model).subscribe({
        next: (response)=>{
            this.router.navigateByUrl('/admin/blogposts');
        }
      });
  }

}