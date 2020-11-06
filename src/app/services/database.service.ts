import { AuthService } from './auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { EnvService } from './env.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Injectable } from '@angular/core';

const ACCURACY_FILTER = 0.001;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  headers: { Authorization: string; };

  constructor(
    private store: NativeStorage,
    private env: EnvService,
    private http: HTTP,
    private auth: AuthService,
    private geolocation: Geolocation,
  ) { }
  intersect(a, b) {
    const setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
  }
  checkOK(responseCollection: any) {
    return responseCollection.status === 'ok';
  }
  dateTimeAfterURL(): string {
    const today = new Date();
    const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    return `/orders?datetimeafter=${dateString}`;
  }

  async deleteOldOrders(orderList: string[]){
    let count = 0;
    const orders = await this.store.getItem('orders');
    const oldOrderList = await this.store.getItem('orderList');
    await new Promise((resolve) => {
      orderList.forEach(async (orderID) => {
        orders.splice(orders.findIndex(orderItem =>  orderItem.id === orderID ), 1);
      });
      if (++count >= orderList.length ){
        this.store.setItem('orders', orders);
        this.store.setItem('orderList', oldOrderList.filter(i => !orderList.includes(i.id)));
        resolve();
      }
    });
  }

  async getOrder(ordersItem: string): Promise<any> {
    const orderURL = `/order/${ordersItem}`;
    try {
      const orderResponse = await this.http.get(this.env.API_URL + orderURL, {}, this.headers);
      const orderCollection = JSON.parse(orderResponse.data);
      // console.table(orderCollection.order);
      if (this.checkOK(orderCollection)) {
        return Promise.resolve(orderCollection.order);
      } else {
        return Promise.resolve(false);
      }
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  }

  async storeNewOrders(orderList: string[]){
    let count = 0;
    const orders = [];
    await new Promise((resolve) => {
      orderList.forEach(async (orderID) => {
        const orderItem =  await this.getOrder(orderID);
        if (orderItem){
          orders.push(orderItem);
        }
        if (++count >= orderList.length ){
          await this.store.setItem('orders', orders);
          console.log('Stored: ' );
          console.table(orderItem);
          resolve();
        }
      });
    });
  }

  async syncOrders(): Promise<any[]>{
    let orderList = [];
    const ordersResponse = await this.http.get(this.env.API_URL + this.dateTimeAfterURL(), {}, this.headers);
    const newOrderCollection = JSON.parse(ordersResponse.data);
    if (this.checkOK(newOrderCollection)) {
      let newOrderList = await newOrderCollection.orders.map(order => order.id);
      try{
        let oldOrderList = await this.store.getItem('orderList');
        // tslint:disable-next-line: prefer-for-of
        /*         for (let i = 0; i < newOrderList.length; i++){
          for (let j = 0; i < oldOrderList.length; j++){
            console.log('NewList' + newOrderList[i]);
            console.log('Old List' + oldOrderList[j]);
            if (newOrderList[i] === oldOrderList[j]){
              orderList.push(newOrderList[i]);
              console.log('orderList' + orderList[i]);
              newOrderList.slice(i, 1);
              oldOrderList.slice(j, 1);
            }
          }
        } */
        orderList = this.intersect(newOrderList, oldOrderList);
        newOrderList = newOrderList.filter(i => !orderList.includes(i.id));
        oldOrderList = oldOrderList.filter(i => !orderList.includes(i.id));
        await this.store.setItem('orderList', orderList);
        await this.storeNewOrders(newOrderList);
        this.deleteOldOrders(oldOrderList);
        return Promise.resolve(orderList);
      } catch (error) {
        console.log(error);
        await this.storeNewOrders(newOrderList);
        await this.store.setItem('orderList', newOrderList);
      }
    }
    console.error('HTTP return not OK status: ' + newOrderCollection);
    return Promise.resolve([]);
  }

  async getOrders(): Promise<any[]>{
    let resolvedOrders = [];
    try {
      resolvedOrders = await this.store.getItem('orders');
    } catch (error) {
      try{
         await this.syncOrders();
         resolvedOrders =  await this.store.getItem('orders');
      } catch (error) {
        console.error(error);
      }

      console.log(error);
      Promise.reject();
    }
    this.syncOrders();

    return Promise.resolve(resolvedOrders);
  }

  async getNearestOrders(): Promise<any[]>{
    const credentials = (await this.auth.getCredentials());
    this.headers = this.http.getBasicAuthHeader(credentials.key, credentials.secret);
    console.log('Headers: ' + this.headers);
    const PositionNow = await this.geolocation.getCurrentPosition();
    const orders = await this.getOrders();

    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < orders.length; i++) {
      const distance = Math.sqrt( // distance formula
        Math.pow( (PositionNow.coords.longitude - orders[i].longitude), 2 )
        + Math.pow( (PositionNow.coords.latitude - orders[i].latitude), 2 )
        );
        // tslint:disable-next-line: object-literal-shorthand
      Object.assign(orders[i], { distance: distance });
      }

    orders.sort((a, b) => {
        const x = a.distance;
        const y = b.distance;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });

    const proximateOrders = orders.filter(order => order.distance < ACCURACY_FILTER);

    if (proximateOrders.length > 0) {
      return Promise.resolve(proximateOrders.slice(0, proximateOrders.length < 10 ? proximateOrders.length : 9));

    } else {
      console.error('Nothing Within 100 Meters, Defaulting to closest Orders');
      for (const orderEntry of orders){
        console.table(orderEntry);
      }
      return Promise.resolve(orders.slice(0, orders.length < 10 ? orders.length : 10));
    }
  }

}
