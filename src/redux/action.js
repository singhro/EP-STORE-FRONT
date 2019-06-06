import * as actions from "./actions";
import Axios from 'axios';
import './mock';


export const fetchAccesstoken=()=>(dispatch)=>{
        Axios({
            method: 'post',
            url: 'http://ffz-sandbox-2.epdemos.com/cortex/oauth2/tokens?scope=wawastore&role=PUBLIC&grant_type=password',
            data: {
            },
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(res=>{
            //console.log("dfgfbgdbdd11111",res.data.access_token)
            dispatch({type:actions.GET_ACCESSTOKEN,value:res.data})
        });
    }


export const getProducts=(accessToken,skuid)=>(dispatch)=>{
    console.log("check token",accessToken)
    Axios({
        method: 'post',
        url: 'http://ffz-sandbox-2.epdemos.com/cortex/items/wawastore/lookups/form?zoom=definition:components:element:components:element:standaloneitem:definition,definition:components:element:components:element:standaloneitem:price,definition:components:element:standaloneitem:recommendations:accessory:element:definition,definition:components:element:standaloneitem:price,definition:components:element:standaloneitem:definition,definition:components:element:standaloneitem:recommendations:accessory:element:price&followlocation',
        data: {
            "code" : skuid
        },
        headers:{'Content-Type': 'application/json','Authorization':'Bearer ' + accessToken }
    }).then(response => {
       // response = JSON.parse(response);
       
        dispatch({type:actions.GET_PRODUCTS,value:response.data})
    });

}

export const getProductsHoagies=(accessToken,skuid)=>(dispatch)=>{
    console.log("check token",accessToken)
    Axios({
        method: 'post',
        url: 'http://ffz-sandbox-2.epdemos.com/cortex/items/wawastore/lookups/form?zoom=definition,definition:components:element:components:element:standaloneitem:definition,definition:components:element:standaloneitem:code,definition:components:element:standaloneitem:price,definition:components:element:components:element:standaloneitem:price,definition:components:element:components:element:components:element:standaloneitem:definition,definition:components:element:components:element:components:element:standaloneitem:price,recommendations:accessory:element:definition,recommendations:accessory:element:price,definition:components:element&followlocation',
        data: {
            "code" : skuid
        },
        headers:{'Content-Type': 'application/json','Authorization':'Bearer ' + accessToken }
    }).then(response => {
       // response = JSON.parse(response);
       
        dispatch({type:actions.GET_PRODUCTS_HOAGIES,value:response.data})
    });

}