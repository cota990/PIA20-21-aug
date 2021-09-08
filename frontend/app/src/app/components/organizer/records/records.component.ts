import { Component, OnInit } from '@angular/core';
import { Record } from 'src/app/models/Record';
import { RecordService } from 'src/app/services/record.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  constructor(private recordsService: RecordService) { }

  ngOnInit(): void {

    this.records = [];

    this.recordsService.getAllRecords().subscribe((records: Record[]) => {

      this.records = records;

    });

  }

  records: Record[];

}
