import { RadonDataSlice } from './radon-data-slice';

export class Report {

    inputString: string;
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
        this.createReportData();
    }

    createReportData(){

        this.address = null;
        this.inspector = null;
        this.serial = null;
        this.data = this.extractData();
        this.average = this.extractAverage();
        this.EPAaverage = this.extractEPAaverage();
        this.result = this.extractResult();
        this.startTime = this.data[0].dateTime;
        console.log(this.startTime);
        this.endTime = this.data[this.data.length < 48  ? this.data.length - 1 : 47 ].dateTime;
        console.log(this.endTime);
    }

    extractData(): RadonDataSlice[]{
        const inputString = this.inputString;
        const dataStrings = inputString.match(/\d+.\d+.\d+\s\d*\:\d*:\d*,\s+\d.\d+,\s+\d+,\s+\d+/g);
        const radonData = [];
        dataStrings.forEach((dataString) => {
            const slice = dataString.split(/,\s+/);
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
        return this.average < max;
    }

}
