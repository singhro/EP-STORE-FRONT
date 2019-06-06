import React, { Component } from 'react';
import{withRouter }from "react-router-dom";
import { connect } from "react-redux";
import fb from '../../../assests/fb.png';
import twitter from '../../../assests/twitter.png';
import pin from '../../../assests/pin.png';
import mail from '../../../assests/mail.png';
import hotBeverage from '../../../assests/HotBeverage.jpg';


class ProductDetailPageComponent extends Component {


    constructor(props)
    {
        super(props);
        if(!this.props.accessToken)
        {
            this.props.history.push("/beverage");
            window.location.reload();
        }
    
        if(this.props.productDetails){
            const prdDetails = this.props.productDetails;
            
            const prdComponentElement = prdDetails['_definition'][0]['_components'][0]['_element'];
            const productStandaloanitem = prdComponentElement[0]['_standaloneitem'];
            const product_definition = productStandaloanitem[0]['_definition'];
            const product_price = productStandaloanitem[0]['_price'][0]['purchase-price'][0];
            const product_recommendations =  productStandaloanitem[0]['_recommendations'][0]['_accessory'][0]['_element'];
    
            const prdtype =  prdComponentElement[1]['_components'] ? prdComponentElement[1]['_components'][0]['_element'] : false;
            const prdQty =  prdComponentElement[2]['_components'] ? prdComponentElement[2]['_components'][0]['_element'] : false;
    
            const price = parseFloat(prdDetails ? product_price['amount'] : "0.0");
            const productName = (product_definition[0]['display-name']);
    
            let milkPrice  = prdtype[0]['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount'];
            milkPrice = parseFloat(milkPrice);
    
            let qtyPrice  = prdQty[0]['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount'];
            qtyPrice = parseFloat(qtyPrice);
    
            let totalPrice = price + milkPrice + qtyPrice;
    
            this.state = {
                basePrice: price,
                milkprice:milkPrice,
                qtyPrice:qtyPrice,
                prdName :productName,
                productType:prdtype,
                productQty:prdQty,
                recom:product_recommendations,
                qty:1,
                totalPrice:totalPrice,
                currentIndex:0,
                currentIndex1:0,
                addOnPrice:0,
                isChecked:false 
            }
        }
        
    }
    
handleChecked = (price,a) => {
        //this.refs[id].checked=!this.refs[id].checked;
        let checkedItem = this.refs[a].checked;
        let basePrice = (parseFloat(this.state.basePrice) + parseFloat(this.state.milkprice) + parseFloat(this.state.qtyPrice)) * parseInt(this.state.qty);
        
        if(checkedItem){
            let totaladdOnPrice = parseFloat(this.state.addOnPrice) + parseFloat(price);
            let afterTotal = basePrice + parseFloat(totaladdOnPrice);
            this.setState({totalPrice:afterTotal,addOnPrice:totaladdOnPrice});
        }
        else{
            let totaladdOnPrice = parseFloat(this.state.addOnPrice) - parseFloat(price);
            let afterTotal = basePrice + parseFloat(totaladdOnPrice);
            this.setState({totalPrice:afterTotal,addOnPrice:totaladdOnPrice});
        }
}

    onTotalPrice = (prdPrice,type) => {
        if(type == 'milk'){
            let totalPrice = (parseFloat(this.state.basePrice) + parseFloat(prdPrice) + parseFloat(this.state.qtyPrice)) * parseInt(this.state.qty);
            totalPrice = totalPrice + parseFloat(this.state.addOnPrice);
            this.setState({totalPrice:totalPrice,milkprice:prdPrice});
    
        }else if(type == 'size'){
            let totalPrice = (parseFloat(this.state.basePrice) + parseFloat(prdPrice) + parseFloat(this.state.milkprice)) * parseInt(this.state.qty);
            totalPrice = totalPrice + parseFloat(this.state.addOnPrice);
            this.setState({totalPrice:totalPrice,qtyPrice:prdPrice});
    
        }
    }

    
        handleClick=(i)=>{
            this.setState({currentIndex:i});
         }

        handleClick1=(i)=>{
            this.setState({currentIndex1:i});
             }
    
    onMinusHandler = () =>{
        let totalPrice;
        if(!(this.state.qty<=1)){
            let qty = this.state.qty-1;
            totalPrice = parseFloat(this.state.basePrice + this.state.milkprice + this.state.qtyPrice) * parseInt(qty);
            totalPrice = totalPrice + parseFloat(this.state.addOnPrice);
            this.setState({qty:(this.state.qty<=1 ? this.state.qty : this.state.qty-1),totalPrice:totalPrice});
        }
           
    }
    
    onPlusHandler = () =>{
        let totalPrice;
        let qty = this.state.qty+1;
        totalPrice = parseFloat(this.state.basePrice + this.state.milkprice + this.state.qtyPrice) * parseInt(qty);
        totalPrice = totalPrice + parseFloat(this.state.addOnPrice);
        this.setState({qty:this.state.qty+1,totalPrice:totalPrice});
    }

    render() { 
      let classNames = 'active';
      let imageUrl=sessionStorage.getItem("imageUrl");
      let pathname=this.props.history.location.pathname;
      let skuId=pathname.split('/');
      skuId=skuId[2];
      let filterName = this.props.products.filter((item)=>{
            return item.skuId == skuId
      });

    

      if(!this.props.productDetails){
            return null
      }

      const productItems = this.state.productType.map( (item,i)=> {
          let details = item['_standaloneitem'][0]['_definition'][0]['details'];
          let prdPrice = item['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount'];
          
          for(let obj  of  details){
            if(obj['display-name'] === 'Display Name'){
                return  <li key={i} onClick={this.onTotalPrice.bind(this,prdPrice,'milk')}><a className={this.state.currentIndex===i?classNames:""}  onClick={this.handleClick.bind(this,i)}>{obj['display-value']}</a></li>
            }
          }   
    });
    //console.log("productItem" , productItems);

      const productQty = this.state.productQty.map( (item,i) => {
        let qtyDetails = item['_standaloneitem'][0]['_definition'][0]['details'];
        let prdPrice = item['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount'];
        for(let obj  of  qtyDetails){
            if(obj['display-name'] === 'Display Name'){
                return  <li key={i} onClick={this.onTotalPrice.bind(this,prdPrice,'size')}><a className={this.state.currentIndex1===i?classNames:""}  onClick={this.handleClick1.bind(this,i)}>{obj['display-value']}</a></li>
            }
          }   
    });

    const reacommendUI = this.state.recom.map((item,i) => {
        let itemDetails = item['_definition'][0]['details'];
        let imgUrl  = '';
        let itemPrice = item['_price'][0]['purchase-price'][0]['amount']; 
        for(let obj of itemDetails){  
            if(obj['display-name'] === 'skuImage'){
                imgUrl = obj['display-value'];
            }
        }
        return <div className="item-list" key={i}><img height="100" src={imgUrl}/><div className= "price"><div className="price-detail"><p><label className="labelFont">{item['_definition'][0]['display-name']}</label></p><p><label className="labelPrice">{item['_price'][0]['purchase-price'][0]['display']}</label></p></div><div className="checkbox-con"><p><input className="checkBox" type="checkbox" ref={i} onChange={this.handleChecked.bind(this,itemPrice,i)}/></p></div></div></div>

});

    
        return (<React.Fragment>
         <section  className="page-detail-wrapper">
            <div  className="container">
                <div  className="row">
                    <div  className="col-lg-6">
                        <div  className="product-detail-image">
                            <img src={imageUrl} alt=""/>
                        </div>
                    </div>
                    <div  className="col-lg-6">
                        <div  className="product-detail-con">
                            <p  className="p-name">{this.state.prdName}</p>
                            <p  className="p-price">
                                <span  className="new-price">${(this.state.totalPrice).toFixed(2)}</span>
                            </p>
                            <div  className="quantity-of-product">
                                <label htmlFor="">{this.state.productType[0]['_standaloneitem'][0]['_definition'][0]['display-name']}</label>
                                <ul  className="quantity-list">
                                    {productItems}
                                </ul>
                            </div>
                            <div  className="quantity-of-product">
                                <label htmlFor="">{this.state.productQty[0]['_standaloneitem'][0]['_definition'][0]['display-name']}</label>
                                <ul  className="quantity-list">
                                    {productQty}
                                </ul>
                            </div>
                            <div  className="quantity-of-product">
                                <label htmlFor="">Quantity</label>
                                <div  className="quantity-number">
                                    <a href="javascript: void(0)" onClick={() => this.onMinusHandler()}  className="quantity-minus">-</a>
                                        <span  className="product-valume">{this.state.qty}</span>
                                    <a href="javascript: void(0)" onClick={() => this.onPlusHandler()}  className="quantity-plus">+</a>
                                </div>
                            </div>
                            <a   className="add-to-bag">Add to Bag</a>
                            <a   className="add-to-wishlist">Add to Wish List</a>
                            <ul  className="social-media-list">
                                <li>
                                    <a href=""><img src={fb} alt=""/></a>
                                </li>
                                <li>
                                    <a href=""><img src={twitter} alt=""/></a>
                                </li>
                                <li>
                                    <a href=""><img src={pin} alt=""/></a>
                                </li>
                                <li>
                                    <a href=""><img src={mail} alt=""/></a>
                                </li>
                            </ul>
                            <div  className="srq">
                                <ul>
                                    <li><a href="javascript: void(0)">Summary</a></li>
                                    <li><a href="javascript: void(0)">Reviews <span>(0)</span></a></li>
                                    <li><a href="javascript: void(0)">Questions <span>(0)</span></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottomSlider">
                <div className="container">
                <p className="fontBold">Would you Like to have Add On?</p>
                 <div className="item-list-con">
                    {reacommendUI}
                 </div>
                </div>
            </div>
        </section>
        </React.Fragment>);
    }
}

const mapStateToProps=(state)=>{
  //console.log("31May",state);
  return{
      products: state.productsArr,
      accessToken:state.accessToken,
      productDetails:state.productDetails
  }
}
 
export default connect(mapStateToProps,null)(withRouter(ProductDetailPageComponent));