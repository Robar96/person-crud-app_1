import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonManagementComponent } from './person-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonServiceMock } from './person.service.mock';
import { PersonService } from './person.service';
import { FormControl, FormGroup } from '@angular/forms';

describe('PersonManagementComponent', () => {
  let component: PersonManagementComponent;
  let fixture: ComponentFixture<PersonManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule for mocking HTTP requests
      declarations: [PersonManagementComponent], // Declare the component to be tested
      providers: [{provide: PersonService, useClass: PersonServiceMock}] // Provide a mock implementation of PersonService
    });

    // Create a component fixture for PersonManagementComponent
    fixture = TestBed.createComponent(PersonManagementComponent);
    component = fixture.componentInstance;

    // Trigger change detection to initialize the component and render its template
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the addPerson form with invalid inputs', () => {
    spyOn(window, 'alert');
    // Set invalid inputs in the personForm
    component.personForm.controls['firstName'].setValue('');
    component.personForm.controls['lastName'].setValue('');
    component.personForm.controls['email'].setValue('');
    
    // Call addPerson method
    component.addPerson();
    
    // Expect an alert to be shown with the validation message
    expect(window.alert).toHaveBeenCalledWith('Es müssen mindestens 3 Zeichen enthalten sein.');
  });

  it('should validate the addPerson form with valid inputs', () => {

    // Set valid inputs for new person
    component.personForm.controls['firstName'].setValue('John');
    component.personForm.controls['lastName'].setValue('Doe');
    component.personForm.controls['email'].setValue('john.doe@mail.de');

    // Add person
    component.addPerson();
    
    expect(component.persons.length).toEqual(1)
    // Expect created person
    expect(component.persons[0]).toEqual({ id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.de' });
  });

  it('should not add a person with invalid lastName', () => {
    spyOn(window, 'alert');

    // Set invalid last name for new person
    component.personForm.controls['firstName'].setValue('Joe');
    component.personForm.controls['lastName'].setValue('');
    component.personForm.controls['email'].setValue('john.doe@mail.de');

    // Call the addPerson function
    component.addPerson();

    expect(component.persons.length).toEqual(0);
    
    // Expect an alert to have been shown
    expect(window.alert).toHaveBeenCalled();

    // Get the message of the alert
    const alertArgs = (window.alert as jasmine.Spy).calls.mostRecent().args;

    // Check the actual message passed to the alert function
    const expectedMessage = 'Es müssen mindestens 3 Zeichen enthalten sein.';
    expect(alertArgs[0]).toBe(expectedMessage);
  });

  it('should not add a person with invalid email', () => {
    spyOn(window, 'alert');

    // Set invalid email for new person
    component.personForm.controls['firstName'].setValue('Joe');
    component.personForm.controls['lastName'].setValue('Doe');
    component.personForm.controls['email'].setValue('john.doemail.de');

    // Call the addPerson function
    component.addPerson();

    expect(component.persons.length).toEqual(0);
    
    // Expect an alert to have been shown
    expect(window.alert).toHaveBeenCalledWith('Gültige Email-Adresse eingeben.');
  });

  it('should update a person', () => {
    // Create person who will updated
    component.personForm.controls['firstName'].setValue('John');
    component.personForm.controls['lastName'].setValue('Doe');
    component.personForm.controls['email'].setValue('john.doe@mail.de');
   
    // Add the person
    component.addPerson();
       
    expect(component.persons.length).toEqual(1)

    const updatedPerson = { id: 1, firstName: 'John', lastName: 'Updated', email: 'john.doe@mail.de' };
    const formGroup = new FormGroup({
      'update-firstName': new FormControl(updatedPerson.firstName),
      'update-lastName': new FormControl(updatedPerson.lastName),
      'update-email': new FormControl(updatedPerson.email)
    });

    // Set the PersonForms object and the opened form for the person to be updated
    component.personForms[updatedPerson.id] = formGroup;
    component.openFormId = updatedPerson.id;

    // Call the updatePerson function
    component.updatePerson(updatedPerson.id);
    // Expect the form to have been closed and reset
    expect(component.openFormId).toBe(0);
    // Expect the default update form values after the update
    expect(component.personForms[updatedPerson.id].get('update-firstName')?.value).toEqual('');
    expect(component.personForms[updatedPerson.id].get('update-lastName')?.value).toEqual('');
    expect(component.personForms[updatedPerson.id].get('update-email')?.value).toEqual('');

    //Expect the updated last name
    expect(component.persons[0].lastName).toEqual('Updated');
  });

  it('should not update a person by invalid email', () => {
    spyOn(window, 'alert');
    // Create person who will updated
    component.personForm.controls['firstName'].setValue('John');
    component.personForm.controls['lastName'].setValue('Doe');
    component.personForm.controls['email'].setValue('john.doe@mail.de');
   
    // Add the person
    component.addPerson();
       
    expect(component.persons.length).toEqual(1)

    const updatedPerson = { id: 1, firstName: 'John', lastName: 'Doe', email: '' };
    const formGroup = new FormGroup({
      'update-firstName': new FormControl(updatedPerson.firstName, component.customValidator),
      'update-lastName': new FormControl(updatedPerson.lastName, component.customValidator),
      'update-email': new FormControl(updatedPerson.email, component.emailValidator)
    });

    // Set the PersonForms object and the opened form for the person to be updated
    component.personForms[updatedPerson.id] = formGroup;
    component.openFormId = updatedPerson.id;

    // Call the updatePerson function
    component.updatePerson(updatedPerson.id);

    // Expect an alert to have been shown
    expect(window.alert).toHaveBeenCalledWith('Email darf nicht leer sein.');

    // Expect the form to have been closed and reset
    expect(component.openFormId).toBe(updatedPerson.id);
    // Expect the default update form values after the update
    expect(component.personForms[updatedPerson.id].get('update-firstName')?.value).toEqual('John');
    expect(component.personForms[updatedPerson.id].get('update-lastName')?.value).toEqual('Doe');
    expect(component.personForms[updatedPerson.id].get('update-email')?.value).toEqual('');

    //Expect the updated last name
    expect(component.persons[0].email).toEqual('john.doe@mail.de');
  });

  it('should display a list of persons', () => {
    // Simulate a list of persons
    const persons = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.com' },
      { id: 2, firstName: 'Max', lastName: 'Mustermann', email: 'max.mustermann@mail.de' },
    ];

    // Assign the persons list to the component and set the list option
    component.persons = persons;
    component.menuOption=2;
    fixture.detectChanges();

    // Check if the persons are displayed in the view
    const personElements = fixture.nativeElement.querySelectorAll('.person');
    expect(personElements.length).toBe(persons.length);

    // Check if the person details are displayed correctly
    for (let i = 0; i < persons.length; i++) {
      const personElement = personElements[i];
      const personDetailsText = personElement.textContent.trim();
      
      // Extract the first and last name from the text
      const nameParts = personDetailsText.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[1];
    
      // Compare with the expected values
      expect(firstName).toBe(persons[i].firstName);
      expect(lastName).toBe(persons[i].lastName);
    }
  });

  it('should delete a person', () => {
    // Create person who will deleted
    component.personForm.controls['firstName'].setValue('John');
    component.personForm.controls['lastName'].setValue('Doe');
    component.personForm.controls['email'].setValue('john.doe@mail.de');
   
    // Add the person
    component.addPerson();
       
    expect(component.persons.length).toEqual(1)
    fixture.detectChanges();
  
    // Select the first person and delete it
    const personToDelete = component.persons[0];
    component.deletePerson(personToDelete.id);
  
    // Expect the number of persons to be reduced by 1
    expect(component.persons.length).toEqual(0);
  
    // Expect the deleted person to not be in the list anymore
    expect(component.persons).not.toContain(personToDelete);
  });
  

});
