import {ChangeDetectorRef, Component, Directive, ElementRef, Input, NgModule, TemplateRef, ViewContainerRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImporterComponent} from './importer.component';
import {TypeScriptComponent} from "../typescript/typescript.component";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'codelab-progress-bar, slide-arrows',
  template: ''
})
export class TrashComponent {
}

@Component({
  selector: 'slide-deck',
  template: '<ng-content></ng-content>'
})
export class SlideDComponent {
}

@Component({
  selector: 'codelab-title-slide',
  template: '<ng-content></ng-content>'
})
export class CodeTitleComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() prereqs!: string;

  constructor(readonly slide: SlideDirective) {
  }

  ngOnInit() {
    this.slide.register({
      type: 'codelab-title-slide',
      payload: {
        title: this.title,
        description: this.description,
        prereqs: this.prereqs,
      }
    });
  }
}


@Component({
  selector: 'feedback-rating',
  template: ''
})
export class FeedbackRating {
}

@Component({
  selector: 'codelab-breadcrumb',
  template: ''
})
export class BreadCrums {
}

@Component({
  selector: 'codelab-closing-slide',
  template: ''
})
export class ClosingSlide {
}

@Component({
  selector: 'codelab-exercise, codelab-exercise-preview, codelab-exercise-playground, code-demo-editor',
  template: ''
})
export class CodelabExercise {
  @Input() exercise: any;
  @Input() presets: any;
  @Input() bootstrapTest: any;
  @Input() milestone = '';
  @Input() url = 'about:blank';
  @Input() ui = 'browser';
  @Input() translations = {};
  @Input() codeDemoHighlight = [];
  @Input() testRunner: 'babel' | 'iframe' = 'iframe';
  @Input() bootstrap = 'bootstrap';
  @Input() displayFileName = false;
  @Input() solutions: any = {};
  @Input() highlights: Record<string, string | RegExp> = {};
  @Input() allowSwitchingFiles = true;
  @Input() enableAutoFolding = true;
  @Input() fontSize: any;
  @Input() showPreview = true;
  @Input() lineNumbers: any;
}

@Directive({
  selector: '[codeDemoHighlight]',
})
export class CodeDemoHighlightDirective {
}

@Directive({
  selector: '[slide]',
})
export class SlideDirective {
  custom: any[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private el: ElementRef,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef) {
    window.setTimeout(() => {
      this.vcr.createEmbeddedView(this.templateRef, 2000);
      this.cdr.detectChanges();
    }, 0);
  }

  register(config: any): void {
    this.custom.push(config);
  }
}

@NgModule({
  declarations: [
    SlideDComponent,
    ImporterComponent,
    TypeScriptComponent,
    TrashComponent,
    FeedbackRating,
    BreadCrums,
    ClosingSlide,
    CodelabExercise,
    CodeDemoHighlightDirective,
    SlideDirective,
    CodeTitleComponent,
  ],
  exports: [ImporterComponent],
  imports: [
    FormsModule,
    CommonModule,
  ]
})
export class ImporterModule {
}
