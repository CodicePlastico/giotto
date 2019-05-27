# Giotto

Giotto is a POC to test the functionality of drawing on Canvas.
It's made with Angular 7

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Publish on Github Pages

Run 
`ng build --prod --base-href "https://codiceplastico.github.io/giotto/"`
and 
`npx angular-cli-ghpages --dir=dist/giotto`
to publish a new version on github pages
