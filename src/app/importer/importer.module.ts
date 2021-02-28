import {
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImporterComponent } from './importer.component';
import { TypeScriptComponent } from '../typescript/typescript.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'codelab-progress-bar, slide-arrows',
  template: '',
})
export class TrashComponent {}

@Component({
  selector: 'slide-deck',
  template: `
    <ng-content></ng-content>
    <pre
      >{{ result | json }}
      </pre
    >
  `,
})
export class SlideDeckComponent {
  readonly result = [];

  updateSlide() {}

  updateSlideContent(id: string, data: any) {
    const res = this.result.find((slide) => id === slide.id);

    res.blocks.push(data);
  }

  register(id: string, milestone: string) {
    const slide = {
      id,
      milestone,
      blocks: [],
    };

    this.result.push(slide);
  }

  updateSlideProp(id: string, propName: string, value: string) {
    const res = this.result.find((slide) => id === slide.id);
    res[propName] = value;
  }

  handleHTML(id: string, children: NodeListOf<ChildNode>) {
    const slide = this.result.find((slide) => id === slide.id);

    const blocks = [];

    for (const child of Array.from(children)) {
      const tag = child.nodeName.toLowerCase();
      if (tag === 'codelab-breadcrumb') {
        continue;
      }

      const customTags = [
        'codelab-title-slide',
        'codelab-exercise-playground',
        'code-demo-file-path',
        'code-demo-editor',
      ];

      if (customTags.includes(tag)) {
        console.assert(slide.blocks[0]);
        blocks.push(slide.blocks.shift());
        continue;
      }

      const nonCustomTags = ['h2', 'div', 'ul'];

      console.assert(nonCustomTags.includes(tag));

      if (
        !blocks[blocks.length - 1] ||
        blocks[blocks.length - 1].type !== 'html'
      ) {
        const block = {
          type: 'html',
          code: '',
        };
        blocks.push(block);
      }

      blocks[blocks.length - 1].code += (child as any).outerHTML;
    }

    slide.blocks = blocks.filter(
      (block) => block.type === 'custom' || block.code !== ''
    );
  }
}

@Component({
  selector: 'codelab-title-slide',
  template: '<ng-content></ng-content>',
})
export class CodeTitleComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() prereqs!: string;

  constructor(readonly slide: SlideDirective) {}

  ngOnInit() {
    this.slide.register({
      type: 'custom',
      tag: 'codelab-title-slide',
      payload: {
        title: this.title,
        description: this.description,
        prereqs: this.prereqs,
      },
    });
  }
}

@Component({
  selector: 'feedback-rating',
  template: '',
})
export class FeedbackRating {}

@Component({
  selector: 'codelab-breadcrumb',
  template: '<ng-content></ng-content>',
})
export class BreadCrums {
  @Input() title!: string;
  @Input() description!: string;
  @Input() prereqs!: string;

  constructor(readonly slide: SlideDirective, readonly el: ElementRef) {}

  ngAfterContentInit() {
    this.slide.updateProp('title', this.el.nativeElement.innerText);
  }
}

@Component({
  selector: 'code-demo-file-path',
  template: '',
})
export class CodeDemoFilePath {
  @Input() path!: string;

  constructor(readonly slide: SlideDirective) {}

  ngOnInit() {
    this.slide.register({
      type: 'custom',
      tag: 'code-demo-file-path',
      payload: {
        path: this.path,
      },
    });
  }
}

@Component({
  selector: 'codelab-exercise-playground',
  template: '',
})
export class CodelabExercisePlayground {
  @Input() presets!: string[];
  @Input() ui!: string;
  // TODO(kirjs): Hangle this
  @Input() highlights!: any;
  @Input() exercise!: string;

  constructor(readonly slide: SlideDirective) {}

  ngOnInit() {
    this.slide.register({
      type: 'custom',
      tag: 'codelab-exercise-playground',
      payload: {
        presets: this.presets,
        ui: this.ui,
        highlights: this.highlights,
        exercise: this.exercise,
      },
    });
  }
}

@Component({
  selector: 'codelab-exercise, codelab-exercise-preview,code-demo-editor',
  template: '',
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
  @Input() ngCustomModel: any;
  @Output()
  ngCustomModelChange = new EventEmitter();

  constructor(
    readonly slide: SlideDirective,
    private readonly elementRef: ElementRef
  ) {}

  ngOnInit() {
    const tag = this.elementRef.nativeElement.tagName.toLowerCase();
    this.slide.register({
      type: 'custom',
      tag,
      payload: {
        exercise: this.exercise,
        presets: this.presets,
        bootstrapTest: this.bootstrapTest,
        milestone: this.milestone,
        url: this.url,
        ui: this.ui,
        translations: this.translations,
        codeDemoHighlight: this.codeDemoHighlight,
        testRunner: this.testRunner,
        bootstrap: this.bootstrap,
        displayFileName: this.displayFileName,
        solutions: this.solutions,
        highlights: this.highlights,
        allowSwitchingFiles: this.allowSwitchingFiles,
        enableAutoFolding: this.enableAutoFolding,
        fontSize: this.fontSize,
        showPreview: this.showPreview,
        lineNumbers: this.lineNumbers,
        ngModel: this.ngCustomModel,
      },
    });
  }
}

@Directive({
  selector: '[codeDemoHighlight]',
})
export class CodeDemoHighlightDirective {}

const ID_ATTR_NAME = 'id';
const MILESTONE_ATTR_NAME = 'milestone';

@Directive({
  selector: '[slide]',
})
export class SlideDirective {
  custom: any[] = [];
  id?: string;
  milestone?: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private el: ElementRef,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private deck: SlideDeckComponent
  ) {
    window.setTimeout(() => {
      this.vcr.createEmbeddedView(this.templateRef);
      this.cdr.detectChanges();

      this.handleHTML();
    }, 0);

    const attrs = (templateRef as any)._declarationTContainer.attrs || [];
    const milestonePredicate = (n) => n === MILESTONE_ATTR_NAME;
    const indexPredicate = (n) => n === ID_ATTR_NAME;
    const idIndex = attrs.findIndex(indexPredicate);
    const milestoneIndex = attrs.findIndex(milestonePredicate);

    this.id = idIndex !== -1 ? attrs[idIndex + 1] : undefined;
    this.milestone =
      milestoneIndex !== -1 ? attrs[milestoneIndex + 1] : undefined;

    deck.register(this.id, this.milestone);
  }

  register(data: any): void {
    this.deck.updateSlideContent(this.id, data);
  }

  updateProp(propName: string, value: string) {
    this.deck.updateSlideProp(this.id, propName, value);
  }

  private handleHTML(): void {
    this.deck.handleHTML(
      this.id,
      this.el.nativeElement.parentElement.querySelector('#' + this.id)
        .childNodes
    );
  }
}

@NgModule({
  declarations: [
    SlideDeckComponent,
    ImporterComponent,
    CodelabExercisePlayground,
    TypeScriptComponent,
    TrashComponent,
    FeedbackRating,
    BreadCrums,
    CodeDemoFilePath,
    CodelabExercise,
    CodeDemoHighlightDirective,
    SlideDirective,
    CodeTitleComponent,
  ],
  exports: [ImporterComponent],
  imports: [FormsModule, CommonModule],
})
export class ImporterModule {}
