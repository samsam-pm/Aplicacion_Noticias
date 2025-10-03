import { Component, Input } from '@angular/core';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: false
})
export class ArticleComponent  {

  @Input() article!: Article;
  @Input() index!: number;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService,
  ) { }

  openArticle() {

    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;

    }

    window.open(this.article.url, '_blank');
  }

  async onOpenMenu() {

    const articleInFav = this.storageService.articleInFavorites( this.article );

    const normalBtns: ActionSheetButton[] =[
      {
          text: articleInFav ? 'Remover favorito' : 'Favorito',
          icon: articleInFav ? 'heart' : 'heart-outline',
          cssClass: 'favorito',
          handler: () => this.onTooggleFavorite()
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel',
          cssClass: 'secundary',
        }
    ]

    const shareBtn: ActionSheetButton =
    {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    }

    if (this.platform.is('capacitor')) {
      normalBtns.unshift(shareBtn);

    }





    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: normalBtns
    });




    await actionSheet.present();
  }

  onShareArticle() {
    const { title, source, url } = this.article;

    this.socialSharing.share(
      title,
      source.name,
      undefined,
      url
    );


  }

  onTooggleFavorite() {
    this.storageService.saveRemoveArticle( this.article );
  }




}
