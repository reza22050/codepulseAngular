import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { BlogPostService } from '../Services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/Services/category.service';
import { Category } from '../../category/models/category-model';
import { UpdateBlogPost } from '../models/update-blog-post.model';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  
  id: string | null = null;
  routeSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
  getBlogPostSubscription?:Subscription;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];

  constructor(private route: ActivatedRoute, 
    private blogPostService: BlogPostService,
    private categoryService: CategoryService, 
    private router: Router
    ) {
    
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getََAllCategories();

    this.routeSubscription= this.route.paramMap.subscribe({
      next: (params)=>{
        this.id = params.get('id');

        if(this.id)
        {
          this.getBlogPostSubscription =  this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response) => {
              this.model = response;

              this.selectedCategories = response.categories.map(x=>x.id);

            }
          });
        }


      }
    })
  }

  onFormSubmit(): void{
    if(this.model && this.id)
    {
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author, 
        content: this.model.content, 
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible, 
        publishedDate: this.model.publishedDate, 
        title: this.model.title, 
        urlHandle: this.model.urlHandle, 
        categories: this.selectedCategories ?? []
      }

      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id, updateBlogPost).subscribe({
        next: (response)=>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      });

    }
  }

  onDelete(): void{
    if(this.id){
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (response)=>{
            this.router.navigateByUrl('/admin/blogposts')
        }
    });
    }
  }
}
