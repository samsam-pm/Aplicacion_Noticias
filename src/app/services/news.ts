import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Article, NewsResponse, ArticlesByCategoryAndPage } from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://newsapi.org/v2';
const apikey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private ArticlesByCategoryAndPage: ArticlesByCategoryAndPage = {}

  constructor(private http: HttpClient) {}

  private executeQuery<T>( endpoint: string ) {
    console.log('Peticion HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${endpoint}`,{
      params: {
        apiKey: apikey,
        country: 'us',
      }
    })

  }

  getTopHeadlines():Observable<Article[]> {

    return this.getTopHeadlinesByCategory('business');

    //return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
    //  .pipe(
    //    map( ({ articles}) => articles)
    //  )
  }


  getTopHeadlinesByCategory(category: string, loadMore:boolean = false ):Observable<Article[]> {

    if ( loadMore ) {
      return this.getArticlesByCategory( category );
    }

    if ( this.ArticlesByCategoryAndPage[category] ) {
      return of( this.ArticlesByCategoryAndPage[category].articles );
    }

    return this.getArticlesByCategory( category );
  }


  private getArticlesByCategory( category: string ): Observable<Article[]> {

    if ( Object.keys(this.ArticlesByCategoryAndPage).includes(category) ) {
      // ya existe
      //this.articlesByCategory[category].page += 0;
    } else {
      this.ArticlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.ArticlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page } `)
      .pipe(
        map( ({ articles }) => {

          if ( articles.length === 0 ) return this.ArticlesByCategoryAndPage[category].articles;

          this.ArticlesByCategoryAndPage[category] = {
            page: page,
            articles: [ ...this.ArticlesByCategoryAndPage[category].articles, ...articles]
          }

          return this.ArticlesByCategoryAndPage[category].articles;
        } )
      );



  }


}
