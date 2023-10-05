import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../Services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/Services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category-model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy{
  model: AddBlogPost;
  categories$?: Observable<Category[]>;
  isImageSelectorVisible: boolean =false;
  imageSelecterSubscription?:Subscription;

  constructor(private blogPostService: BlogPostService, 
    private router: Router, 
    private categoryService: CategoryService,
    private imageService: ImageService
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

  ngOnDestroy(): void {
    this.imageSelecterSubscription?.unsubscribe();
  }
  
  ngOnInit(): void {
    this.categories$ = this.categoryService.getََAllCategories();

    this.imageSelecterSubscription = this.imageService.onSelectImage().subscribe({
      next: (selectedImage)=>{
        this.model.featuredImageUrl = selectedImage.url;
        this.closeImageSelector();
      }
    })
  }

  onFormSubmit(): void{
      this.blogPostService.createBlogPost(this.model).subscribe({
        next: (response)=>{
            this.router.navigateByUrl('/admin/blogposts');
        }
      });
  }

  openImageSelector(): void{
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(): void{
    this.isImageSelectorVisible = false;
  }

}
