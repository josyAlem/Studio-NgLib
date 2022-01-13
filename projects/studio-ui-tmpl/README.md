# StudioUiTmpl

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.0.

## Code scaffolding

Run `ng generate component component-name --project studio-ui-tmpl` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project studio-ui-tmpl`.

> Note: Don't forget to add `--project studio-ui-tmpl` or else it will be added to the default project in your `angular.json` file.

## Build

Run `ng build studio-ui-tmpl` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build studio-ui-tmpl`, go to the dist folder `cd dist/studio-ui-tmpl` and run `npm publish`.

## Running unit tests

Run `ng test studio-ui-tmpl` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Shared Components

## Data Grid

## Form

## Pipes

### 1.1 filter-pipe

## Enums

## Statics

### 1. PageOptions

    defines fileting and paging properties  filter: {
        predicate: '',
        value: []
    },
    page: {
        pageSize: 1,
        pageNumber: 1
    },
    sort: {
        property: 'id',
        order: 'ascending'
    },
    totalCount: 0

### 2. FormCtrlType

    Defines form control types:
    Input, Checkbox, textarea etc
