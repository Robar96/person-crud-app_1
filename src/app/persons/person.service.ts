import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Person } from './person';

//A new service is created here, which will serve as an interface between the backend and the Person Management component.

@Injectable({
  //This allows us to use this service in a component as a dependency injection
  providedIn: 'root'
})
export class PersonService {
  //Defining the endpoint. Here the fake backend from the JSON server is specified as the endpoint
  private apiUrl = 'http://localhost:3000/persons';

  //The HttpClient service is injected over the constructor. It performs HTTP requests and has methods to perform HTTP requests
  constructor(private http: HttpClient) {}

  //Methods for the HTTP calls:

  //Get all persons
  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }
  //Get one person
  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }
  //Add a new Person
  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }
  //Update an Person
  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, person);
  }
  //Delete an Person
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
