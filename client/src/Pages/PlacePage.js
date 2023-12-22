import React, { useContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { differenceInDays, parse } from "date-fns";
import { UserContext } from "../UserContext";
const PlacePage = () => {
  const history = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [price, setPrice] = useState();
  const [maxGuests, setMaxGuests] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState();
  const [daysDifference, setDaysDifference] = useState(null);
  const [name, setName] = useState(""); 
  const [phone, setPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState();
  const {user} = useContext(UserContext);
  useEffect(()=>{
      if(user)
      {
        setName(user.name);
      }
  },[user])
  useEffect(() => {
    if (!id || id == "new") {
      return;
    }

    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setDescription(data.description);
      setExtraInfo(data.extraInfo);
      setUploadedImages(data.photos);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
      setPerks(data.perks);
    });
  }, []);

  useEffect(() => {
    
    if (checkInDate && checkOutDate) {
      const parsedStartDate = parse(checkInDate, "yyyy-MM-dd", new Date());
      const parsedEndDate = parse(checkOutDate, "yyyy-MM-dd", new Date());

      const difference = differenceInDays(parsedEndDate, parsedStartDate);
      setDaysDifference(difference);
    }
  }, [checkInDate, checkOutDate]);

  async function handleBooking(e) {
    try{
      if(daysDifference>0 && guests<=maxGuests)
      {
          const response = await axios.post("/booking/" + id, {
          checkInDate,
          checkOutDate,
          guests,
          name,
          phone,
          price,
          daysDifference,
        });
        alert("Booking Successful");
        history("/account/bookings/");
      }
      else if(daysDifference<=0)
      {
        alert("Check In Date should be prior to Check Out Date")
      }
      else{
        alert("Number of Guests should be less than Maximum allowed guests")
      } 
    }
    catch (error) {
      alert("Booking Failed!!");
      console.error(error);
    }
  }
  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white text-center justify-center items-center">
        <div className="p-8 bg-black grid gap-4">
          <div>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex gap-1 py-2 px-4 rounded-2xl transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                dataSlot="icon"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            </button>
            <h2 className="text-3xl">
              Photos of <span className="font-semibold">{title}</span>
            </h2>
          </div>
          {uploadedImages?.length > 0 &&
            uploadedImages.map((image, index) => (
              <a
                href={"http://localhost:4000/uploads/" + uploadedImages[index]}
                target="_blank"
              >
                <div>
                  <img
                    src={
                      "http://localhost:4000/uploads/" + uploadedImages[index]
                    }
                    alt=""
                    className="rounded-xl cursor-pointer justify-center items-center"
                  />
                </div>
              </a>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 bg-gray-100 px-8 py-4 text-gray-700">
      <h1 className="text-3xl">{title}</h1>
      <a
        className="my-3 display-block font-semibold underline flex gap-1"
        target="_blank"
        href={"https://maps.google.com/?q=" + address}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          dataSlot="icon"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>

        {address}
      </a>
      <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {uploadedImages.length > 0 && (
            <div className="transition duration-300 hover:saturate-50">
              <img
                src={"http://localhost:4000/uploads/" + uploadedImages[0]}
                className="aspect-square object-cover cursor-pointer"
                alt=""
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
          )}
        </div>
        <div className="grid">
          {uploadedImages.length > 1 && (
            <div className="transition duration-300 hover:saturate-50">
              <img
                src={"http://localhost:4000/uploads/" + uploadedImages[1]}
                className="aspect-square object-cover cursor-pointer"
                alt=""
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
          )}
          <div className="overflow-hidden ">
            {uploadedImages.length > 2 && (
              <div className="transition duration-300 hover:saturate-50">
                <img
                  src={"http://localhost:4000/uploads/" + uploadedImages[2]}
                  className="aspect-square object-cover relative top-2 cursor-pointer"
                  alt=""
                  onClick={() => setShowAllPhotos(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowAllPhotos(true)}
        className="py-2 px-4 mt-4 bg-white rounded-2xl border shadow shadow-md shadow-gray-500 inline-flex gap-1 transition duration-300 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          dataSlot="icon"
          className="w-6 h-6 mx-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        Show more photos
      </button>
      <div>
        <div className="grid gap-8 sm:grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr] font-semibold">
          <div className="my-4 text-gray-700">
            <h2 className="mt-8 font-semibold text-2xl">Description</h2>
            {description}
            <br />
            <br />
            <div className="text-gray-700 lg:text-2xl">
              Check-In: {checkIn}:00 <br />
              <br />
              Check-Out: {checkOut}:00 <br />
              <br />
              Max Guests: {maxGuests}
            </div>
          </div>

          <div className="mt-8 shadow text-gray-700 rounded-2xl border border-gray-300">
            <div className="p-4 rounded-2xl bg-white">
              <div className="text-2xl text-center">
                Price: ${price} per night
              </div>

              <div className="border border-gray-500 rounded-2xl p-1 m-1">
                <div className=" rounded-2xl p-1 m-1">
                  <label className="p-1 m-1">Check In Date: </label>
                  <input
                    className="bg-white p-1 m-1 rounded-2xl w-full "
                    type="date"
                    value={checkInDate}
                    onChange={(ev) => setCheckInDate(ev.target.value)}
                  />
                  <br />
                </div>
                <div className=" border-t border-gray-500 p-1 m-1">
                  <label className="p-1 m-1">Check Out Date: </label>
                  <input
                    className="bg-white p-1 m-1 rounded-2xl w-full "
                    type="date"
                    value={checkOutDate}
                    onChange={(ev) => setCheckOutDate(ev.target.value)}
                  />
                  <br />
                </div>
                <div className="p-1 m-1 border-t border-gray-500">
                  <label className="p-1 m-1">Number of Guests: </label>
                  <input
                    className=" bg-white   p-1 m-1 rounded-2xl"
                    type="number"
                    value={guests}
                    onChange={(ev) => setGuests(ev.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className=" border-t border-gray-500 p-1 m-1">
                  <label className="p-1 m-1">Name: </label>
                  <input
                    className="bg-white p-1 m-1 rounded-2xl w-full "
                    type="text"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    placeholder="Aarsh Bhavsar"
                  />
                  <br />
                </div>
                <div className=" border-t border-gray-500 p-1 m-1">
                  <label className="p-1 m-1">Phone: </label>
                  <input
                    className="bg-white p-1 m-1 rounded-2xl w-full border "
                    type="tel"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                    placeholder="+91"
                  />
                  <br />
                </div>
              </div>

              <button className="primary shadow" onClick={handleBooking}>
                RESERVE FOR $<span>{daysDifference * price}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 pb-8 pt-2 mt-6 -my-4 border border-t shadow">
        <div>
          <h2 className="mt-8 font-semibold text-2xl">Extra Info</h2>
        </div>
        <div className="mt-2 text-sm text-gray-500 leading-5">{extraInfo}</div>
      </div>
    </div>
  );
};

export default PlacePage;
