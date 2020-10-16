import { Geolocation } from '@ionic-native/geolocation/ngx';
import { EnvService } from './env.service';
import { AuthService } from './auth.service';
import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';

const ACCURACY_FILTER = 0.001;

@Injectable({
  providedIn: 'root'
})
export class IsnService {
  userAuth: any;

  constructor(
    private env: EnvService,
    private http: HTTP,
    private auth: AuthService,
    private geolocation: Geolocation,
  ) {
    this.userAuth = this.http.getBasicAuthHeader(this.auth.user.key, this.auth.user.secret);
  }
  checkOK(responseCollection: any) {
    return responseCollection.status === 'ok';
  }
  dateTimeAfterURL(): string {
    const today = new Date();
    const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    return `/orders?datetimeafter=${dateString}`;
  }

  async getOrder(ordersItem: any): Promise<any> {
    const orderURL = `/order/${ordersItem.id}`;
    try {
      const orderResponse = await this.http.get(this.env.API_URL + orderURL, {}, this.userAuth);
      const orderCollection = JSON.parse(orderResponse.data);
      console.log('ORDER_COLLECTION: ');
      console.table(orderCollection.order);
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

  async getOrders(): Promise<any[]> {
    const resolvedOrders = [];
    try {
      const ordersResponse = await this.http.get(this.env.API_URL + this.dateTimeAfterURL(), {}, this.userAuth);
      const ordersCollection = JSON.parse(ordersResponse.data);
      console.log('ORDERS COLLECTION: ');
      console.table(ordersCollection);
      if (this.checkOK(ordersCollection)) {
        const orders = ordersCollection.orders;
        await new Promise((resolve) => { // lock until all orders resolve
          let count = 0;
          orders.forEach(async (order) => {
            try {
              const resolvedOrder = await this.getOrder(order);
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
      }
      console.table(resolvedOrders);
      return Promise.resolve(resolvedOrders);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNearestOrders(): Promise<any[]>{

    const PositionNow = await this.geolocation.getCurrentPosition();
    console.log('COORDS: ');
    console.table(PositionNow.coords);
    const orders = await this.getOrders();

    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < orders.length; i++) {
      const distance = Math.sqrt( // distance formula
        Math.pow( (PositionNow.coords.longitude - orders[i].longitude), 2 )
        + Math.pow( (PositionNow.coords.latitude - orders[i].latitude), 2 )
      );
      console.log(i + 'Distance ' + ': ' + distance);
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
      console.log('PROXIMATE ORDERS');
      for (const orderEntry of proximateOrders){
        console.table(orderEntry);
      }
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
