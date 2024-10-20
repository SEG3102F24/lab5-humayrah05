import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Employee} from "../model/employee";
import {addDoc, collection, Firestore, getDocs} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employees$: BehaviorSubject<readonly Employee[]> = new BehaviorSubject<readonly Employee[]>([]);

  constructor(private firestore: Firestore) {
    this.fetchEmployees();
  }

  get $(): Observable<readonly Employee[]> {
    return this.employees$;
  }

  async addEmployee(employee: Employee) {
    try {
      await addDoc(collection(this.firestore, 'employees'), {
        name: employee.name,
        dateOfBirth: employee.dateOfBirth,
        city: employee.city,
        salary: employee.salary,
        gender: employee.gender,
        email: employee.email
      });

      await this.fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      return false; 
    }

    return true; 
  }

  async fetchEmployees() {
    try {
      const docs = await getDocs(collection(this.firestore, 'employees'));

      const employeesList: Employee[] = docs.docs.map(doc => {
        const employee = doc.data();
        return {
          name: employee['name'],
          dateOfBirth: employee['dateOfBirth'].toDate(),
          city: employee['city'],
          salary: employee['salary'],
          gender: employee['gender'],
          email: employee['email'],
        } as Employee;
      });

      this.employees$.next(employeesList); 
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }
}
