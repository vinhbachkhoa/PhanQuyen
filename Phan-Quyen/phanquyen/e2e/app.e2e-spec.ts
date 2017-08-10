import { PhanquyenPage } from './app.po';

describe('phanquyen App', () => {
  let page: PhanquyenPage;

  beforeEach(() => {
    page = new PhanquyenPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
