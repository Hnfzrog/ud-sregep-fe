import { Component, Input, TemplateRef, ContentChild } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  template: ''
})
export class TabItemComponent {
  @Input() title!: string;
  @Input() icon?: string;

  @ContentChild(TemplateRef) content!: TemplateRef<any>;
}
