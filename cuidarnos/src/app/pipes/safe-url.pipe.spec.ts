import { SafeUrlPipe } from './safe-url.pipe';

describe('SafeUrlPipe', () => {
  it('create an instance', () => {
    const sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);
    const pipe = new SafeUrlPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
