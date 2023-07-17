import { PersonServiceMock } from './person.service.mock';

describe('PersonServiceMock', () => {
  it('should create an instance', () => {
    expect(new PersonServiceMock()).toBeTruthy();
  });
});
