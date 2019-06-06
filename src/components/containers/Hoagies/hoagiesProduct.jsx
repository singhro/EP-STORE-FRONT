import React, { Component } from 'react';
import{Link, withRouter, }from "react-router-dom";
import { connect } from "react-redux";
import {getProductsHoagies} from "../../../redux/action";

class HoagiesProductComponent extends Component {
    
    onClickProduct = (id,image) =>{
        this.props.getProductsHoagies(this.props.token,id);
        sessionStorage.setItem("imageUrlHoagies",image);
        setTimeout(()=>{
            this.props.history.push(`/hoagiesdetailpage/${id}`);
        },1000);
        
    }

    render() { 
        return (<div className="productWrapper" onClick={()=>this.onClickProduct(this.props.skuid,this.props.imgsrc)}>
            <div className="productImage">
            <img src={this.props.imgsrc} alt=""/>
            </div>
            <p className="product-name">{this.props.details}</p>
            <p className="instock-product"><i className="fas fa-check"></i> In Stock</p> 
        </div> );
    }
}
 
export default connect(null,{getProductsHoagies})(withRouter(HoagiesProductComponent));