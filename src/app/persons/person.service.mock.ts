import { Observable, of } from 'rxjs';
import { Person } from './person';

export class PersonServiceMock {
  private mockPersons: Person[] = [];

  getPersons(): Observable<Person[]> {
    return of(this.mockPersons);
  }

  getPerson(id: number): Observable<Person | undefined> {
    const person = this.mockPersons.find(p => p.id === id);
    return of(person);
  }

  addPerson(person: Person): Observable<Person> {
    const newId = this.generateId();
    const newPerson: Person = { ...person, id: newId };
    this.mockPersons.push(newPerson);
    return of(newPerson);
  }

  updatePerson(id: number, person: Person): Observable<Person | undefined> {
    const index = this.mockPersons.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedPerson = { ...person, id };
      this.mockPersons[index] = updatedPerson;
      return of(updatedPerson);
    }
    return of(undefined);
  }

  deletePerson(id: number): Observable<void> {
    const index = this.mockPersons.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPersons.splice(index, 1);
    }
    return of();
  }

  private generateId(): number {
    const maxId = Math.max(...this.mockPersons.map(p => p.id), 0);
    return maxId + 1;
  }
}