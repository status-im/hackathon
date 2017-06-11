import { Component } from '@angular/core';

import { AdsPage } from '../ads/ads';
import { HomePage } from '../home/home';
import { CoursePage } from '../course/course';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AdsPage;
  tab3Root = CoursePage;

  constructor() {

  }
}
