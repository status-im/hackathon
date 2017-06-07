import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Logger } from "angular2-logger/core";
import { ContractService } from './../providers/contract';
import { EthereumService } from './../providers/ethereum';
import { UtilsService } from './../providers/utils';

import { LoginPage } from '../pages/login/login';
import { AdsPage } from '../pages/ads/ads';
import { AdsAddPage } from '../pages/ads-add/ads-add';
import { AdsViewPage } from '../pages/ads-view/ads-view';
import { CoursePage } from '../pages/course/course';
import { CourseHistoryPage } from '../pages/course-history/course-history';
import { CourseAddPage } from '../pages/course-add/course-add';
import { CourseViewPage } from '../pages/course-view/course-view';
import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { environment }    from '../../environment';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AdsPage,
    AdsAddPage,
    AdsViewPage,
    CoursePage,
    CourseAddPage,
    CourseViewPage,
    CourseHistoryPage,
    SettingsPage,
    HomePage,
    TabsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AdsPage,
    AdsAddPage,
    AdsViewPage,
    CoursePage,
    CourseAddPage,
    CourseViewPage,
    CourseHistoryPage,
    SettingsPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EthereumService,
    ContractService,
    UtilsService,
    Logger
  ]
})
export class AppModule {
  constructor(private logger: Logger) {
    this.logger.level = environment.logger.level;
  }
}
