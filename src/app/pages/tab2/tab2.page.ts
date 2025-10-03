import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/news';
import { Article } from 'src/app/interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  @ViewChild( IonInfiniteScroll, {static: true}) infiniteScroll!: IonInfiniteScroll;

  public categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  public selectedCategory = this.categories[0];
  public articles: Article[] = [];

  constructor( private newsService: NewsService) {}

  ngOnInit() {

    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe( articles => {
        this.articles = [ ...articles ]
      });
  }

  segmentChanged(category: Event) {
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe( articles => {
        this.articles = [ ...articles ]
      });
  }

  loadData() {
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
    .subscribe( articles => {

      if ( articles.length === this.articles.length ) {
        this.infiniteScroll.disabled = true;
        //event.target.disabled = true;
        return;
      }

      this.articles = articles;
      this.infiniteScroll.complete();
      //event.target.complete();
    })

  }

}
