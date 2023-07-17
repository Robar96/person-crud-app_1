import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { Person } from './person';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PersonService]
    });
    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of persons', () => {
    // Simulate a list of persons
    const mockPersons: Person[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@mail.com' }
    ];
    // Expect the returned list of persons to match the mock data
    service.getPersons().subscribe(persons => {
      expect(persons).toEqual(mockPersons);
    });

    // Expect a single HTTP GET request to the specified URL
    const req = httpMock.expectOne('http://localhost:3000/persons');
    expect(req.request.method).toBe('GET');
    req.flush(mockPersons);
  });

  it('should retrieve a person by ID', () => {
    // Simulate a single person
    const mockPerson: Person = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.com' };
    const id = 1;

    // Expect the returned person to match the mock data
    service.getPerson(id).subscribe(person => {
      expect(person).toEqual(mockPerson);
    });

    // Expect a single HTTP GET request to the specified URL with the ID appended
    const req = httpMock.expectOne(`http://localhost:3000/persons/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPerson);
  });

  it('should add a new person', () => {
    // Define a new person object
    const newPerson: Person = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.com' };

    // Expect the returned person to match the new person object
    service.addPerson(newPerson).subscribe(person => {
      expect(person).toEqual(newPerson);
    });

    const req = httpMock.expectOne('http://localhost:3000/persons');
    expect(req.request.method).toBe('POST');
    // Expect the request body to match the new person object
    expect(req.request.body).toEqual(newPerson);
    req.flush(newPerson);
  });

  it('should update a person', () => {
    // Define a new person object
    const updatedPerson: Person = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.com' };
    const id = 1;

    // Expect the returned person to match the updated person object
    service.updatePerson(id, updatedPerson).subscribe(person => {
      expect(person).toEqual(updatedPerson);
    });


    const req = httpMock.expectOne(`http://localhost:3000/persons/${id}`);
    expect(req.request.method).toBe('PUT');
    // Expect the request body to match the updated person object
    expect(req.request.body).toEqual(updatedPerson);
    req.flush(updatedPerson);
  });

  it('should delete a person', () => {
    const id = 1;

    service.deletePerson(id).subscribe(() => {
      expect().nothing(); // Expect the observable to complete successfully
    });

    const req = httpMock.expectOne(`http://localhost:3000/persons/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Flush an empty response body
  });

  
});
