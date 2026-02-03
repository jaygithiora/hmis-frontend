import { LimitWordsPipe } from './limit-words.pipe';

describe('LimitWordsPipe', () => {
  it('create an instance', () => {
    const pipe = new LimitWordsPipe();
    expect(pipe).toBeTruthy();
  });
});
