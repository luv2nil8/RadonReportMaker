import { HTTP } from '@ionic-native/http/ngx';
import { EnvService } from './env.service';
import { IsnService } from './isn.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private store: NativeStorage,
    private isn: IsnService,
    private env: EnvService,
    private http: HTTP
  ) { }

  async getOrders(): Promise<any[]>{
    const resolvedOrders = [];
    try {
      const orders = await this.syncOrders();
      await new Promise((resolve) => { // lock until all orders resolve
        let count = 0;
        orders.forEach(async (order) => {
          try {
            const resolvedOrder = await this.isn.getOrder(order);
            if (resolvedOrder) { resolvedOrders.push(resolvedOrder); }
            if (++count === orders.length) {
              resolve();
            }
          } catch ( error ){
            console.error(error);
            if (++count === orders.length) {
              resolve();
            }
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
    return Promise.resolve(resolvedOrders);
  }

  async deleteOldOrders(orders: string[]){
    for (const orderId of orders){
      try {
        const success = await this.store.remove(orderId);
        console.log(JSON.stringify(success));
      } catch (error) {
        console.log(error);
      }
    }
  }

  async storeNewOrders(orders: string[]){
    for (const orderID of orders){
      try {
        const orderItem =  await this.isn.getOrder(orderID);
        console.log('OID: ' + orderItem.order.oid);
        const success = await this.store.setItem(orderID, orderItem);
        console.log(JSON.stringify(success));
      } catch (error) {
        console.log(error);
      }
    }
  }

  async syncOrders(): Promise<any[]>{
    const orderList = [];
    const ordersResponse = await this.http.get(this.env.API_URL + this.isn.dateTimeAfterURL(), {}, this.isn.userAuth);
    const newOrderList = JSON.parse(ordersResponse.data.orders);
    if (this.isn.checkOK(newOrderList)) {
      const orders = newOrderList.orders;
      try{
        const oldOrderList = await this.store.getItem('orderList');
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < newOrderList.length; i++){
          for (let j = 0; i < oldOrderList.length; j++){
            if (newOrderList[i] === oldOrderList[j]){
              orderList.push(newOrderList[i]);
              newOrderList.slice(i, 1);
              oldOrderList.slice(j, 1);
            }
          }
        }
        await this.storeNewOrders(newOrderList);
        await this.deleteOldOrders(oldOrderList);
        await this.store.setItem('orderList', orderList);
        return Promise.resolve(orderList);
      } catch (error) {
        console.log(error);
        await this.storeNewOrders(newOrderList);
        await this.store.setItem('orderList', newOrderList);
      }
    }
    return Promise.resolve([]);
  }
}
