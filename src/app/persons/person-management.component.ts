import { Component, OnInit } from '@angular/core';
import { Person } from './person';
import { PersonService } from './person.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-person-management',
  templateUrl: './person-management.component.html',
  styleUrls: ['./person-management.component.css']
})
export class PersonManagementComponent implements OnInit{

  menuOption = 0; //Variable is used to switch between the different menus
  openFormId: number = 0; //Variable with id for opening and closing only one update form
  personForms: {[key: number]: FormGroup} = {}; // Object that holds form groups for each person
  persons: Person[] = []; //Array containing created persons

  //Validator for checking the input values when creating or updating a person.
  customValidator = [
    Validators.required,
    Validators.pattern('^[a-zA-ZäöüÄÖÜß]+$'),
    Validators.minLength(3)
  ]

  //Validator for checking the input values for an email
  emailValidator = [
    Validators.required,
    Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
  ]

  //Create a FormGroup, which is used when creating a person
  personForm = new FormGroup({
    firstName: new FormControl('', this.customValidator),
    lastName: new FormControl('', this.customValidator),
    email: new FormControl('',  this.emailValidator)
  });
  
  //Person service is included as dependency injection via the constructor
  constructor(private personService: PersonService) {}

  //When the component is initialized for the first time, then this method is called and the list of all people from the backend is loaded.
  ngOnInit() {
    this.getPersons();
  }

  //Method to retrieve all persons from the backend, by using the Person Service
  getPersons() {
    this.personService.getPersons().subscribe(
      persons => {this.persons = persons;}
    )
  }

  //Method to create one person, by using the Person Service
  addPerson(){

    //First the input for the first name and the last name are checked, i.e. whether they contain valid data.
    if(this.personForm.controls.firstName.invalid || this.personForm.controls.lastName.invalid){
      alert("Es müssen mindestens 3 Zeichen enthalten sein.")
      return;
    }

    //Here the input for the email address is checked
    if (this.personForm.controls.email.invalid) {
      if (this.personForm.controls.email.errors?.['required']) {
        alert('Email darf nicht leer sein.');
        return;
      } else {
        alert('Gültige Email-Adresse eingeben.');
        return;
      }
    }

    const person: Person = {
      id: 0,
      firstName: this.personForm.value.firstName!,
      lastName: this.personForm.value.lastName!,
      email: this.personForm.value.email!
    }
    //Call the Person service to create a person.
    //When the call is completed, the method getPersons is called again via the subscription,
    //thereby updating the list of persons
    this.personService.addPerson(person).subscribe(() => {this.getPersons();})
  }

  //Displays the details of a person in another window.
  //By the clicked button we know exactly for which person we have to show the data
  showPersonDetails(person: Person) {
    const detailsWindow = window.open('', '_blank');
    if(detailsWindow){
      detailsWindow.document.write(`<h2>Details von ${person.firstName}</h2>`);
      detailsWindow.document.write(`<p>${person.id} | ${person.firstName} | ${person.lastName} | ${person.email}</p>`);
      detailsWindow.document.close();
    }
  }

  //Method to update one person, by using the Person Service
  updatePerson(id: number){

    //First the update input for the first name and the last name are checked, i.e. whether they contain valid data.
    if(this.personForms[id].controls['update-firstName'].invalid || this.personForms[id].controls['update-lastName'].invalid){
      alert("Es müssen mindestens 3 Zeichen enthalten sein.")
      return;
    }
    //Here the update input for the email address is checked
    if (this.personForms[id].controls['update-email'].invalid) {
      if (this.personForms[id].controls['update-email'].errors?.['required']) {
        alert('Email darf nicht leer sein.');
        return;
      } else {
        alert('Gültige Email-Adresse eingeben.');
        return;
      }
    }

    const person: Person = {
      id: 0,
      firstName: this.personForms[id].get('update-firstName')!.value,
      lastName: this.personForms[id].get('update-lastName')!.value,
      email: this.personForms[id].get('update-email')!.value,
    }
    //Call the Person service to update a person.
    //When the call is completed, the method getPersons is called again via the subscription,
    //Thereby updating the list of persons
    //Call the toggleUpdateForm method to toggle the update form for a person.
    this.personService.updatePerson(id, person).subscribe(() => {this.getPersons(); this.toggleUpdateForm(id)});
  }


  //Toggles the update form for a person.
  //If the form is already open for the given person, it closes the form.
  //If the form is closed for the given person, it opens the form.
  //param personId The ID of the person.
  toggleUpdateForm(personId: number): void {
    if (this.openFormId === personId) {
      this.openFormId = 0; // Closes the form when the same button is clicked again.
    } else {
      this.openFormId = personId; // Opens the form for the selected person
    }
    this.personForms[personId].reset({ 'update-firstName': '', 'update-lastName': '', 'update-email': ''});
  }
  
  //Checks whether the update form is open for a specific person or not.
  isOpen(personId: number): boolean {
    return this.openFormId === personId;
  }

  //Returns the FormGroup object for a specified person. 
  //If the form does not already exist for the specified personId, 
  //it will be created using the createPersonForm() method.
  getPersonForm(personId: number): FormGroup {
    if (!this.personForms[personId]) {
      this.personForms[personId] = this.createPersonForm();
    }
    return this.personForms[personId];
  }
  
  //Create form group with empty values
  createPersonForm(): FormGroup {
    return new FormGroup({
      'update-firstName': new FormControl('', this.customValidator),
      'update-lastName': new FormControl('', this.customValidator),
      'update-email': new FormControl('',this.emailValidator)
    });
  }
  
  cancelPersonUpdate(personId: number): void {
    this.openFormId = 0; // Closes the form
    delete this.personForms[personId]; // Deletes the FormGroup for the person
  }
  
  //Call the Person Service to delete a person
  deletePerson(id: number){
    this.personService.deletePerson(id).subscribe(() => {this.getPersons();});
  }
}
