import { Component } from '@angular/core';
import { Period } from '../models/period';
import { TransformedPair } from '../models/transformed-pair';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  employeesPairs: TransformedPair[] = [];
  dataArr: Period[] = [];
  loading = false;
  constructor() {}

  onFileUpload(event: Event) {
    this.employeesPairs = [];
    this.dataArr = [];
    this.loading = true;
    const target = event.target as HTMLInputElement;
    if (target && target.files?.length) {
      const file = target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileContent = fileReader.result as string;
        const rows = fileContent.trim().replaceAll('\r', '').split('\n');
        const csvData: any[] = [];

        for (let i = 0; i < rows.length; i++) {
          const columns = rows[i]
            .trim()
            .split(',')
            .map((el) => el.trim());
          csvData.push(columns);
          const newPeriod = {
            empId: columns[0],
            projectId: columns[1],
            dateFrom: new Date(columns[2]).getTime(),
            dateTo: new Date(columns[3])?.getTime() || new Date().getTime(),
          };
          this.dataArr.push(newPeriod);
        }
        this.employeesPairs = this.getEmplyeesPairs();
        this.loading = false;
      };
      fileReader.readAsText(file);
    }
  }

  getEmplyeesPairs() {
    const pairsArr = [];
    for (let i = 0; i <= this.dataArr.length - 2; i++) {
      for (let j = i + 1; j <= this.dataArr.length - 1; j++) {
        if (
          this.dataArr[i].projectId === this.dataArr[j].projectId &&
          this.dataArr[i].empId !== this.dataArr[j].empId &&
          this.dataArr[i].dateFrom < this.dataArr[j].dateTo &&
          this.dataArr[i].dateTo > this.dataArr[j].dateFrom
        ) {
          const transformedPair = this.transformPairInfo(
            this.dataArr[i],
            this.dataArr[j]
          );
          let exisitngPair = pairsArr.find(
            (pair) =>
              pair.empOneId === transformedPair.empOneId &&
              pair.empTwoId === transformedPair.empTwoId &&
              pair.projectId === transformedPair.projectId
          );
          exisitngPair
            ? (exisitngPair.duration += transformedPair.duration)
            : pairsArr.push(transformedPair);
        }
      }
    }
    return pairsArr;
  }

  transformPairInfo(pairOne: Period, pairTwo: Period) {
    let transformedPair = {
      empOneId: '',
      empTwoId: '',
      projectId: pairOne.projectId,
      duration: 0,
    };
    if (pairOne.dateFrom >= pairTwo.dateFrom) {
      transformedPair.empOneId = pairTwo.empId;
      transformedPair.empTwoId = pairOne.empId;
      if (pairOne.dateTo >= pairTwo.dateTo) {
        transformedPair.duration =
          (pairTwo.dateTo - pairOne.dateFrom) / 1000 / 60 / 60 / 24;
      } else {
        transformedPair.duration =
          (pairOne.dateTo - pairOne.dateFrom) / 1000 / 60 / 60 / 24;
      }
    } else {
      transformedPair.empOneId = pairOne.empId;
      transformedPair.empTwoId = pairTwo.empId;
      if (pairOne.dateTo >= pairTwo.dateTo) {
        transformedPair.duration =
          (pairTwo.dateTo - pairTwo.dateFrom) / 1000 / 60 / 60 / 24;
      } else {
        transformedPair.duration =
          (pairOne.dateTo - pairTwo.dateFrom) / 1000 / 60 / 60 / 24;
      }
    }
    return transformedPair;
  }
}
