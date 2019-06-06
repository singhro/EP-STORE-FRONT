import * as actions from "./actions";

const initState = {
    "accessToken":"",
    "productsArr":[{
        "name":"Caramel",
        "skuId": "caramel_macchiatos_sku",
        "src": "https://pcftestfileupload.s3-eu-west-1.amazonaws.com/wawa/caramel_sku.png"
    }, {
        "name":"Mocha",
        "skuId": "mocha_macchiatos_sku",
        "src": "https://pcftestfileupload.s3-eu-west-1.amazonaws.com/wawa/mocha_sku.png"
    }],
    "productDetails":[],
    "productsArrHoagies":[{
        "name":"Oven Roasted",
        "skuId": "oven_roasted_turkey_sku",
        "src": "https://pcftestfileupload.s3-eu-west-1.amazonaws.com/wawa/ovenRoasetdTurkey.jpg"
    }, {
        "name":"Honey Smoked",
        "skuId": "honey_smoked_turkey_sku",
        "src": "https://pcftestfileupload.s3-eu-west-1.amazonaws.com/wawa/honeyRoastedTurkey.jpg"
    }],
    "productDetailsHoagies":[] 
  };


  const productReducer = (state=initState,action)=>{
    switch(action.type)
        {
            case actions.GET_ACCESSTOKEN: return {
                    ...state,
                    accessToken: action.value.access_token
                  }
            case actions.GET_PRODUCTS: return {
                ...state,
                productDetails:action.value
            }
            case actions.GET_PRODUCTS_HOAGIES: return {
                ...state,
                productDetailsHoagies:action.value
            }
            default : return {
                ...state
            }

        }

  }

  export default productReducer;