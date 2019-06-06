import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import ProductListPageComponent from "./components/containers/productList/productListPage";
import ProductDetailPageComponent from "./components/containers/productDetail/productDetailPage";
import HoagiesDetailPageComponent from "./components/containers/Hoagies/hoagiesDetailPage";
import ProductComponent from "./components/containers/product/product";
import BeverageDetailComponent from "./components/containers/beverageDetail";
import HoagiesComponent from "./components/containers/Hoagies/hoagies";

class Routing extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/listpage" component={ProductListPageComponent} />
          <Route path="/detailpage" component={ProductDetailPageComponent} />
          <Route path="/beverage" component={BeverageDetailComponent} />
          <Route path="/hoagies" component={HoagiesComponent} />
          <Route path="/detailpage/:id" component={ProductDetailPageComponent} />
          <Route path="/hoagiesdetailpage/:id" component={HoagiesDetailPageComponent} />
          <Redirect from="/" to="/beverage" exact />
          <Route path="/" render={() => <div>Not Found</div>} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default Routing;
