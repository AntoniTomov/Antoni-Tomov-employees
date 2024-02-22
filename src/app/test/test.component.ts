import {
  Component,
  Directive,
  Input,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Period } from '../models/period';

@Directive({ selector: 'pane' })
export class Pane {
  @Input() id!: string;
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  dataArr: Period[] = [];
  constructor() {}

  onFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files?.length) {
      const file = target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileContent = fileReader.result as string;
        const rows = fileContent.trim().replaceAll('\r', '').split('\n');
        const csvData: any[] = [];
        console.log('fileContent', fileContent);
        console.log('type: ', typeof fileContent);
        console.log('rows', rows);

        for (let i = 0; i < rows.length; i++) {
          const columns = rows[i]
            .trim()
            .split(',')
            .map((el) => el.trim());
          csvData.push(columns);
          const newPeriod = {
            empID: columns[0],
            projectID: columns[1],
            dateFrom: new Date(columns[2]).getTime(),
            dateTo: new Date(columns[3])?.getTime(),
          };
          this.dataArr.push(newPeriod);
        }
        console.log(csvData);
      };
      fileReader.readAsText(file);
    }
  }

  checkForEmplyeesPair() {
    const employeesArr = [];
    for (let i = 0; i <= this.dataArr.length - 2; i++) {
      for (let j = i + 1; j <= this.dataArr.length - 1; j++) {
        const currentPeriod = this.dataArr[j];
        if (
          this.dataArr[i].projectID === this.dataArr[j].projectID &&
          this.dataArr[i].empID !== this.dataArr[j].empID
        ) {
          employeesArr.push([this.dataArr[i], this.dataArr[j]]);
        }
      }
    }
    console.log('employeesArr: ', employeesArr);
  }
}
