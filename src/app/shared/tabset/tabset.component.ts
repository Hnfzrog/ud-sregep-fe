import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { TabItemComponent } from './tab-item.component';

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss']
})
export class TabsetComponent implements AfterContentInit {
  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;
  activeTabIndex = 0;

  ngAfterContentInit() {
    // optionally set default tab
    this.activeTabIndex = 0;
  }

  selectTab(index: number) {
    this.activeTabIndex = index;
  }
}
