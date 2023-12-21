import React,{useContext} from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const handlePlaceData = async () => {
    try {
      const { data } = await axios.get("/getAllPlaces");
      setPlaces(data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  useEffect(() => {
    handlePlaceData();
  }, []);
  return (
    <div className="m-2 grid gap-x-2 gap-y-5 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
      {places.length > 0 && places.map((place,index) => (
        <Link to={'/place/'+place._id} className="m-4 transition duration:300 hover:saturate-50">
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <img className="rounded-2xl object-cover aspect-square" src={"http://localhost:4000/uploads/"+place.photos?.[index]} alt=""/>
            )}
          </div>
          <h2 className="text-sm font-bold">{place.address}</h2>
          <h3 className="text-gray-500 truncate">{place.title}</h3>
          <h2 className="text-sm text-gray-700"><span className="font-bold">${place.price}</span> per night</h2>
        </Link>
      ))}
    </div>

  )
}

export default IndexPage
