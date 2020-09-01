import { RadonDataSlice } from './radon-data-slice';
import { ReportDataService } from '../services/report-data.service';

export class Report {

    public inputString: string; // TODO Make Private When bugs are worked out

    address: string;
    startTime: Date;
    endTime: Date;
    inspector: string;
    serial: number;
    data: RadonDataSlice[];
    result: boolean;
    average: number;
    EPAaverage: number;

    constructor(inputString: string){
        this.inputString = inputString;
        this.createReportData(inputString);
    }

    createReportData(inputString: string){

        this.address = null;
        this.startTime = this.extractStartDateTime();
        this.inspector = null;
        this.serial = null;
        this.data = this.extractData();
        this.average = this.extractAverage();
        this.EPAaverage = this.extractEPAaverage();
        this.result = this.extractResult();
        this.endTime = this.data[this.data.length < 48  ? this.data.length - 1 : 47 ].dateTime;
        console.log(this.endTime);
    }

    extractStartDateTime(): Date {
        const month = 0;
        const day = 1;
        const year = 2;
        const hour = 3;
        const min = 4;

        const startDateStrings = /Date,(.+?\d*\:\d*)/.exec(this.inputString);
        const DT = startDateStrings[1].split(/\/|\:|\s/).map( dateChunk => parseInt(dateChunk, null) );
        return new Date(DT[year], DT[month], DT[day], DT[hour], DT[min]);
    }
    extractData(): RadonDataSlice[]{
        const inputString = this.inputString;
        const dataStrings = /(\d\).+)/.exec(inputString)[0].split(/\d*\), /).slice(1);
        const radonData = [];
        dataStrings.forEach((dataString) => {
            const slice = dataString.split(/,\s*/);
            const dataSlice = new RadonDataSlice();
            const DS = slice[0].split(/-|\:|\s/);
            dataSlice.dateTime = new Date(+DS[0], +DS[1], +DS[2], +DS[3], +DS[4], +DS[5]);
            dataSlice.radon = +slice[1];
            dataSlice.temperature = parseInt(slice[2], null);
            dataSlice.humidity = parseInt(slice[3], null);
            radonData.push(dataSlice);
        });
        return radonData;
    }

    extractAverage(): number{
        const sum = this.data.reduce((acc, data) => acc + data.radon, 0); // Sum all radon Data
        return +(sum / this.data.length).toFixed(2);
    }

    extractEPAaverage(): number{
        const sum = this.data.slice(3).reduce((acc, data) => acc + data.radon, 0); // Sum all radon Data
        return +(sum / this.data.length).toFixed(2);
    }

    extractResult(): boolean{
        const max = 4;
        return this.average >= max;
    }

}
