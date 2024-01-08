import React from "react";
import Hero from "../Components/Homepage/Hero";
import BuyersChoice from "../Components/Homepage/BuyersChoice";
import FactoryOrderPortfolio from "../Components/Homepage/FactoryOrderPortfolio";
import OurTeam from "../Components/Homepage/OurTeam";
import { useDispatch, useSelector } from "react-redux";
// import { fetchData } from "../Redux/Products/Action";
import PhotoGallery from "../Components/Homepage/PhotoGallery";
import ContactUs from "../Components/Homepage/ContactUs";
import ClientsReviews from "../Components/Common/ClientsReviews";
import { fetchCartData } from "../Redux/Products/action";
function Home() {
  const token = useSelector((store) => store.authReducer.token);
  const dispatch  = useDispatch();
  
  if(token){
    dispatch(fetchCartData(token))
  }
  console.log(token);
  return (
    <div>
      <Hero />
      <div className="px-5">
        <BuyersChoice title={"Buyers' choice"} />
        <FactoryOrderPortfolio />
        <PhotoGallery />
        <ClientsReviews />
        <OurTeam />
        <ContactUs />
      </div>
    </div>
  );
}

export default Home;
