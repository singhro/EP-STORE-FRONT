import React, { Component } from 'react';
import{withRouter }from "react-router-dom";
import { connect } from "react-redux";
import fb from '../../../assests/fb.png';
import twitter from '../../../assests/twitter.png';
import pin from '../../../assests/pin.png';
import mail from '../../../assests/mail.png';

class HoagiesDetailPageComponent extends Component {
    
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
        const product_recommendations =  prdDetails['_recommendations'][0]['_accessory'][0]['_element'];
        const prdComponentElement = prdDetails['_definition'][0]['_components'][0]['_element'];
        const componentElement  = prdComponentElement.filter((item,i)=>{
            if(item['_components'] != undefined){
                return item;
            }  
        });
        const standloneEle = prdComponentElement.filter((item,i)=>{
            if(item['_components'] == undefined){
                return item;
            }  
        });

        //console.log("standloneEle",standloneEle);
       
        let basePrice = 0;
         for(let item of standloneEle){
            basePrice += parseFloat(item['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount']);
         }
            

        const productName = prdDetails['_definition'][0]['display-name'];
        
         let initialPrice = 0;
         let indexArr=[];
        componentElement.map((item,ind)=>{
            let elementArr = item['_components'][0]['_element'];
            elementArr.map((obj,i)=>{
                if(i==0){  
                    if(obj['_components'] != undefined){
                        let subIndexes = [];
                        obj['_components'][0]['_element'].map((obje,k) =>{
                            let leist_price = parseFloat(obje['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount']) || 0;
                            subIndexes[k] = {inde:ind+''+k+''+i,price:leist_price};
                            initialPrice += leist_price;    
                        });
                        indexArr.push(subIndexes);    
                    }
                    else {
                        let leist_price = parseFloat(obj['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount']);
                        indexArr.push({inde:ind+''+i,price:leist_price});    
                        // console.log(obj['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount']);
                        initialPrice += leist_price;
                    }
                }
                
            }); 
        });
        console.log(indexArr);
       let total = basePrice + initialPrice;


        this.state = {
           recom:product_recommendations,
           qty:1,
           price: basePrice,
           prdComponet:componentElement,
           prdname:productName,
           totalPrice:total,
           indexarr:indexArr,
           addOnPrice:0,
           isChecked:false 
      }
     }
    
}

handleChecked = (price,a) => {
    //this.refs[id].checked=!this.refs[id].checked;
    let checkedItem = this.refs[a].checked;
    let updateIndexArr = this.state.indexarr;
    
    let updated_AddOnPrice = 0;
    let total_price = 0;
    updateIndexArr.map((item,i)=>{
        if(item instanceof Array) {
            item.map(subitem=>{
                updated_AddOnPrice += parseFloat(subitem['price']);
            });
        }
        else
        updated_AddOnPrice += parseFloat(item['price']);
    });
    total_price = parseFloat(this.state.price) + updated_AddOnPrice;
    total_price  =  total_price * parseFloat(this.state.qty);
    if(checkedItem){
    let totaladdOnPrice = parseFloat(this.state.addOnPrice) + parseFloat(price);
    let afterTotal= total_price + parseFloat(totaladdOnPrice);
    this.setState({totalPrice:afterTotal,addOnPrice:totaladdOnPrice});
    }
    else{
    console.log(price);
    let totaladdOnPrice = parseFloat(this.state.addOnPrice) - parseFloat(price);
    let afterTotal=total_price + parseFloat(totaladdOnPrice);
    this.setState({totalPrice:afterTotal,addOnPrice:totaladdOnPrice});
    }
}

onPriceCalculation = (fristIndex,secondIndex,current_price,thirdIndex=-1) =>{
    console.log(fristIndex,secondIndex,thirdIndex)
    let updateIndexArr = this.state.indexarr;
    if(thirdIndex>=0) {
        updateIndexArr[fristIndex][secondIndex] = {inde:fristIndex+''+secondIndex+''+thirdIndex,price:current_price || 0};
    }
    else {
        updateIndexArr[fristIndex] = {inde:fristIndex+''+secondIndex,price:current_price}
    }
    console.log("updateIndexArr",updateIndexArr);
    let updated_AddOnPrice = 0;
    let total_price = 0;
    updateIndexArr.map((item,i)=>{
        if(item instanceof Array) {
            item.map(subitem=>{
                updated_AddOnPrice += parseFloat(subitem['price']);
            });
        }
        else
            updated_AddOnPrice += parseFloat(item['price']);
    });
    console.log("roopak",updateIndexArr);
    total_price = parseFloat(this.state.price) + updated_AddOnPrice;
    total_price = total_price * parseInt(this.state.qty);
    total_price = total_price + parseFloat(this.state.addOnPrice);
    this.setState({indexarr:updateIndexArr,totalPrice:total_price})

   
}

// onPriceCalculation1 = (fristIndex,secondIndex,current_price) =>{
    
//     let updateIndexArr = this.state.indexarr;
//     updateIndexArr[fristIndex] = {inde:fristIndex+''+secondIndex,price:current_price}
//     let updated_AddOnPrice = 0;
//     let total_price = 0;
//     updateIndexArr.map((item,i)=>{
//         updated_AddOnPrice += parseFloat(item['price']);
//     });
//     console.log("roopak",updateIndexArr);
//     total_price = parseFloat(this.state.price) + updated_AddOnPrice;
//     total_price = total_price * parseInt(this.state.qty);
//     total_price = total_price + parseFloat(this.state.addOnPrice);
//     this.setState({indexarr:updateIndexArr,totalPrice:total_price})

   
// }

onMinusHandler = () =>{
     
     if(!(this.state.qty<=1)){
        let qty = this.state.qty-1;
        let updateIndexArr = this.state.indexarr;
        let updated_AddOnPrice = 0;
        let total_price = 0;
        updateIndexArr.map((item,i)=>{
            if(item instanceof Array) {
                item.map(subitem=>{
                    updated_AddOnPrice += parseFloat(subitem['price']);
                });
            }
            else
            updated_AddOnPrice += parseFloat(item['price']);
        });
        total_price = parseFloat(this.state.price) + updated_AddOnPrice;
         total_price = total_price * parseInt(qty);
         total_price = total_price + parseFloat(this.state.addOnPrice);
        this.setState({qty:(this.state.qty<=1 ? this.state.qty : this.state.qty-1),totalPrice:total_price});
    }
}

onPlusHandler = () =>{
   
    let qty = this.state.qty+1;
    let updateIndexArr = this.state.indexarr;
    let updated_AddOnPrice = 0;
    let total_price = 0;
    updateIndexArr.map((item,i)=>{
        if(item instanceof Array) {
            item.map(subitem=>{
                updated_AddOnPrice += parseFloat(subitem['price']);
            });
        }
        else
    updated_AddOnPrice += parseFloat(item['price']);
    });
    total_price = parseFloat(this.state.price) + updated_AddOnPrice;
     total_price = total_price * parseInt(qty);
     total_price = total_price + parseFloat(this.state.addOnPrice);
    this.setState({qty:this.state.qty+1,totalPrice:total_price});

}
    render() { 
      
        let imageUrl=sessionStorage.getItem("imageUrlHoagies");
      let pathname=this.props.history.location.pathname;
      let skuId=pathname.split('/');
      skuId=skuId[2];
      let filterName = this.props.products.filter((item)=>{
            return item.skuId == skuId
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
        return <div className="item-list" key={i}><img height="100" src={imgUrl}/><div className= "price"><p><label className="labelFont">{item['_definition'][0]['display-name']}</label></p><p><label className="labelFont">{item['_price'][0]['purchase-price'][0]['display']}</label></p><div><p><input className="checkBox" type="checkbox" ref={i} onChange={this.handleChecked.bind(this,itemPrice,i)}/></p></div></div></div>
});

      if(!this.props.productDetails){
            return null
      }

      const addOnUI  = this.state.prdComponet.map((item,j)=>{
            let elementArr = item['_components'][0]['_element'];
            let prdName = item['display-name'];
            ;
           
            let listItem =  elementArr.map((obj,i)=>{
                let subItem; 
                let subcat = false;
                if(obj['_components'] != undefined){
                    subcat = true;
                    subItem = obj['_components'][0]['_element'].map((obje,k) =>{
                        let oiltype = obje['_standaloneitem'][0]['_definition'][0]['display-name'];
                        console.log("sfsfsfsfsfs",this.state.indexarr[k]['inde']);
                        return <li key={k} id={k}><a className={this.state.indexarr[j][i] && this.state.indexarr[j][i].inde == (j+''+i+''+k) ? 'active':''} onClick={this.onPriceCalculation.bind(this,j,i,prdPrice,k)}>{oiltype}</a></li>
                    });
                }
               
               let breadType = obj['_standaloneitem'][0]['_definition'][0]['display-name'];
               let prdPrice = obj['_standaloneitem'][0]['_price'][0]['purchase-price'][0]['amount'];

                if(subcat){
                    return <div key={i} className="sub">
                        <label>{breadType}</label>
                        <ul className="quantity-list">
                            {subItem}
                        </ul>
                    </div>
                     
                }else{
                    console.log("sdsdf",this.state.indexarr[j]['inde']);
                    return <li key={i} onClick={this.onPriceCalculation.bind(this,j,i,prdPrice)}><a className={this.state.indexarr[j]['inde']== (j+''+i) ? 'active':''}>{breadType}</a></li>
                }

            });


            return  <div key={j} className="quantity-of-product">
                        <label>{prdName}</label>
                        <ul className="quantity-list">
                            {listItem}
                        </ul>
                    </div>
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
                           <p  className="p-name">{this.state.prdname}</p>
                           <p  className="p-price">
                               <span  className="new-price">${(this.state.totalPrice).toFixed(2)}</span>
                           </p>
                          {addOnUI}
                           <div  className="quantity-of-product">
                               <label htmlFor="">Quantity</label>
                               <div  className="quantity-number">
                                   <a href="javascript: void(0)" onClick={() => this.onMinusHandler()}  className="quantity-minus">-</a>
                                   <span  className="product-valume">{this.state.qty}</span>
                                   <a href="javascript: void(0)" onClick={() => this.onPlusHandler()}  className="quantity-plus">+</a>
                               </div>
                           </div>
                           <a href="#"  className="add-to-bag">Add to Bag</a>
                           <a href="#"  className="add-to-wishlist">Add to Wish List</a>
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
        accessToken:state.accessToken,
        products: state.productsArrHoagies,
        productDetails:state.productDetailsHoagies
    }
  }
export default connect(mapStateToProps,null)(withRouter(HoagiesDetailPageComponent));