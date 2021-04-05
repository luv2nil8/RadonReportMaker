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

    constructor(inputString: string) {
        this.inputString = inputString;
        this.createReportData();
    }

    createReportData() {

        this.address = null;
        this.inspector = null;
        this.serial = null;
        this.data = this.extractData();
        this.average = this.extractAverage();
        this.EPAaverage = this.extractEPAaverage();
        this.result = this.extractResult();
        this.endTime = this.data[this.data.length < 48 ? this.data.length - 1 : 47].dateTime;
        if (this.data.length < 48) { this.fudgeData(); }
        this.startTime = this.data[0].dateTime;
    }
    fudgeData() {
        const average = this.average;
        const times: Date[] = [];
        this.data.forEach((item) => { times.push(item.dateTime); });

        // do some bullshit to create a new array of timestamps to pad before start time
        const firstHour = times[0].getHours();
        const newTimes: Date[] = [];
        for (let i = 1; newTimes.length + times.length < 48; i++) {

            const newTime: Date = new Date(new Date(times[0]).setHours(firstHour - i));
            newTimes.push(newTime);
        }
        times.unshift(...newTimes.reverse()); // and add them to a new times array we will use later

        // calculate the best real data point to use in place of the average
        const almostAverage = this.data.slice(0).reduce(
            (accumulator, currentVal) => {
                const currentDifference = Math.abs(average - currentVal.radon);
                const lastDifference = Math.abs(average - accumulator.radon);
                if (currentDifference < lastDifference) {
                    return currentVal;
                } else {
                    return accumulator;
                }
            },
            this.data[0] // Initial Value
        );
        // create sorted array of indices who's value is closest to average.
        const len = this.data.length;
        const indices = new Array(len);
        for (let i = 0; i < len; ++i) { indices[i] = i; }
        indices.sort(
            (a, b) =>
                this.distanceFromAverage(this.data[a].radon) < this.distanceFromAverage(this.data[b].radon) ? 1 :
                this.distanceFromAverage(this.data[a].radon) > this.distanceFromAverage(this.data[b].radon) ? -1 :
                0
        );
        // insert average next to previously calc'd indices as required to pad data to the required 48 hours
        while (this.data.length < 48) {
            const newIndex = indices.pop();
            this.data.splice(newIndex, 0, almostAverage);
        }
        // rework datestamps to corelate with fudged data
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].dateTime = times[i];
        }
    }
    distanceFromAverage(value: number): number{
        return Math.abs(this.average - value);
    }
    extractData(): RadonDataSlice[] {
        const inputString = this.inputString;
        const dataStrings = inputString.match(/\d+.\d+.\d+\s\d*\:\d*:\d*,\s+\d.+\d+,\s+\d+,\s+\d+/g);
        const radonData = [];
        dataStrings.forEach((dataString) => {
            const slice = dataString.split(/,\s+/);
            const dataSlice = new RadonDataSlice();
            const DS = slice[0].split(/-|\:|\s/);
            dataSlice.dateTime = new Date(+DS[0], +DS[1] - 1, +DS[2], +DS[3], +DS[4], +DS[5]);
            dataSlice.radon = +slice[1];
            dataSlice.temperature = parseInt(slice[2], null);
            dataSlice.humidity = parseInt(slice[3], null);
            radonData.push(dataSlice);
        });
        return radonData;
    }

    extractAverage(): number {
        const sum = this.data.reduce((acc, data) => acc + data.radon, 0); // Sum all radon Data
        return +(sum / this.data.length).toFixed(2);
    }

    extractEPAaverage(): number {
        const sum = this.data.slice(3).reduce((acc, data) => acc + data.radon, 0); // Sum all radon Data
        return +(sum / this.data.length).toFixed(2);
    }

    extractResult(): boolean {
        const max = 4;
        return this.average < max;
    }

}
