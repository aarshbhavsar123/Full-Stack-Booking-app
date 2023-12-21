import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Perks from "../Components/Perks";
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
const AccountPage = () => {
  const history = useNavigate();
  const [redirect, setRedirect] = useState(false);
  const { subpage } = useParams();
  const { action } = useParams();
  const { ready, user, setUser } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [price, setPrice] = useState();
  const [maxGuests, setMaxGuests] = useState(0);
  const [file, setFile] = useState();
  const [resFile, setResFile] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [red, setRed] = useState(false);
  const [places, setPlaces] = useState([]);
  const handlePlaceData = async () => {
    try {
      const { data } = await axios.get("/getPlaces");
      setPlaces(data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  useEffect(() => {
    handlePlaceData();
  }, []);
  useEffect(() => {
    if (action == "new" || !action) {
      setTitle("");
      setAddress("");
      setCheckIn("");
      setCheckOut("");
      setDescription("");
      setExtraInfo("");
      setUploadedImages([]);
      setMaxGuests();
      setPrice();
      setPerks([]);
    } else {
      axios.get("/places/" + action).then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setDescription(data.description);
        setExtraInfo(data.extraInfo);
        setUploadedImages(data.uploadedImages);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
        setPerks(data.perks);
      });
    }
  }, [action]);
  async function handleLogout() {
    await axios.post("/logout");
    setRedirect(true);
    setUser(null);
  }
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:4000/upload",
        formData
      );
      setResFile(response.data);
      alert("Photo Uploaded Successflly");
      // Fetch the updated list of uploaded images
      const imagesResponse = await axios.get(
        "http://localhost:4000/getUploads"
      );
      setUploadedImages(imagesResponse.data);
    } catch (error) {
      console.error(error);
    }
  };
  async function savePlace(ev) {
    ev.preventDefault(); // Prevent the default form submission behavior
    const placeData = {
      action,
      title,
      address,
      uploadedImages,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    try {
      if (action == "new") {
        await axios.post("/places", placeData);
        setResFile();
        setUploadedImages([]);
        alert("New place added successfully");
        history("/account/places");
      } else {
        await axios.put("/places/" + action, placeData);
        setResFile();
        setUploadedImages([]);
        history("/account/places");
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"}></Navigate>;
  }
  if (redirect) {
    return <Navigate to={"/"}></Navigate>;
  }
  if (!ready) {
    return "Loading...";
  }

  if (user) {
    if (!subpage) {
      return (
        <div>
          <nav className="w-full flex mt-8 gap-2 ml-1 justify-center mb-8">
            <Link
              className="inline-flex gap-2 py-2 px-6 bg-primary rounded-full text-white"
              to={"/account"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              My profile
            </Link>
            <Link
              className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
              to={"/account/bookings"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              My bookings
            </Link>
            <Link
              className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
              to={"/account/places"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                />
              </svg>
              My accomodations
            </Link>
          </nav>
          <div className="text-center text-xl max-w-lg mx-auto">
            Logged in as {user.name} <br />
            <br />
            Email ID - {user.email}
            <button className="primary max-w-sm mt-2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      );
    } else if (subpage === "bookings") {
      return (
        <div>
          <nav className="w-full flex mt-8 gap-2 ml-1 justify-center">
            <Link
              className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
              to={"/account"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              My profile
            </Link>
            <Link
              className="inline-flex gap-2 py-2 px-6 bg-primary rounded-full text-white"
              to={"/account/bookings"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              My bookings
            </Link>
            <Link
              className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
              to={"/account/places"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                />
              </svg>
              My accomodations
            </Link>
          </nav>
          <div>My Bookings</div>
        </div>
      );
    } else if (subpage === "places") {
      if (action == null) {
        if (places.length == 0) {
          return (
            <div>
              <nav className="w-full flex mt-8 gap-2 ml-1 justify-center">
                <Link
                  className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                  to={"/account"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  My profile
                </Link>
                <Link
                  className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                  to={"/account/bookings"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  My bookings
                </Link>
                <Link
                  className="inline-flex gap-2 py-2 px-6 bg-primary rounded-full text-white"
                  to={"/account/places"}
                  onClick={handlePlaceData}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                    />
                  </svg>
                  My accomodations
                </Link>
              </nav>
              <div className="text-center mt-5">
                <Link
                  className="inline-flex gap-1 bg-primary text-white rounded-full py-2 px-6"
                  to={"/account/places/new"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add New Place
                </Link>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <nav className="w-full flex mt-8 gap-2 ml-1 justify-center">
                <Link
                  className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                  to={"/account"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  My profile
                </Link>
                <Link
                  className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                  to={"/account/bookings"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  My bookings
                </Link>
                <Link
                  className="inline-flex gap-2 py-2 px-6 bg-primary rounded-full text-white"
                  to={"/account/places"}
                  onClick={handlePlaceData}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                    />
                  </svg>
                  My accomodations
                </Link>
              </nav>
              <div className="text-center mt-5">
                <Link
                  className="inline-flex gap-1 bg-primary text-white rounded-full py-2 px-6"
                  to={"/account/places/new"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Add New Place
                </Link>
              </div>
              <div className="gap-2">
                {places.map((place, index) => (
                  <Link to={`/account/places/${place._id}`}>
                    <div
                      key={index}
                      className="flex bg-gray-100 gap-2 mx-2 p-3 rounded-2xl cursor-pointer mt-4 mb-1"
                    >
                      <div className="w-32 h-32 overflow-hidden bg-gray-200 flex-shrink-0 rounded-2xl">
                        {place.photos.length > 0 && (
                          <img
                            src={`http://localhost:4000/uploads/${place.photos[index]}`}
                            alt=""
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        )}
                      </div>
                      <div className="flex-grow flex-shrink-0 ml-4 max-w-2xl">
                        <h2 className="text-lg font-semibold mb-2">
                          {place.title}
                        </h2>
                        <p className="text-sm mt-2 overflow-hidden max-h-16">
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        }
      } else if (action === "new") {
        return (
          <div>
            <nav className="w-full flex mt-8 gap-2 ml-1 justify-center">
              <Link
                className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                to={"/account"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                My profile
              </Link>
              <Link
                className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                to={"/account/bookings"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                My bookings
              </Link>
              <Link
                className="inline-flex gap-2 py-2 px-6 bg-primary rounded-full text-white"
                to={"/account/places"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                  />
                </svg>
                My accomodations
              </Link>
            </nav>
            <div className="ml-4 mr-4">
              <form onSubmit={savePlace}>
                <h2 className="text-2xl mt-4 font-semibold">Title:</h2>
                <p className="text-gray-500 text-sm">
                  Title for your place. Should attract customers.
                </p>
                <input
                  type="text"
                  required
                  placeholder="title, for example: My beautiful apartment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">Address:</h2>
                <p className="text-gray-500 text-sm">Address to your place.</p>
                <input
                  type="text"
                  placeholder="Address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">Photos:</h2>
                <p className="text-gray-500 text-sm">
                  Try to add good amount of photos of your place.
                </p>
                <div className="inline-flex gap-2">
                  <input
                    required
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <div className="relative">
                  <button
                    className="flex items-center gap-1 justify-center border border-gray-500 bg-gray-100 rounded-2xl p-8 mt-2 text-3xl text-gray-500"
                    onClick={handleUpload}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                      />
                    </svg>
                    Upload
                  </button>
                </div>

                <h2 className="text-2xl mt-4 font-semibold">Description:</h2>
                <p className="text-gray-500 text-sm">
                  Description of your place.
                </p>
                <textarea
                  placeholder="Add your description here"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">Perks:</h2>
                <p className="text-gray-500 text-sm">
                  Select all the perks of your place.
                </p>
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  <Perks selected={perks} onChange={setPerks} />
                </div>
                <h2 className="text-2xl mt-4 font-semibold">Extra Info:</h2>
                <p className="text-gray-500 text-sm">Rules, etc.</p>
                <textarea
                  placeholder="Rules, etc."
                  required
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">
                  Check in and out times, max guests:
                </h2>
                <p className="text-gray-500 text-sm">
                  Add check in and check out times, remember to have some time
                  window for cleaning the room between guests. Also do not
                  forget to add price per night.
                </p>
                <div className="grid sm:grid-cols-4 gap-2">
                  <div>
                    <h3 className="mt-2 -mb-1">Check In time:</h3>
                    <input
                      type="text"
                      placeholder="14"
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <h3 className="mt-2 -mb-1">Check Out time:</h3>
                    <input
                      type="text"
                      placeholder="11"
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                  <div>
                    <h3 className="mt-2 -mb-1">Max Guests:</h3>
                    <input
                      type="number"
                      required
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                    />
                  </div>
                  <div>
                    <h3 className="mt-2 -mb-1">Price:</h3>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price($/night)"
                    />
                  </div>
                </div>
                <div>
                  <button className="primary my-4">Save</button>
                </div>
              </form>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <nav className="w-full flex mt-8 gap-2 ml-1 justify-center">
              <Link
                className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                to={"/account"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                My profile
              </Link>
              <Link
                className="inline-flex gap-2 py-2 px-6 bg-gray-200 rounded-full"
                to={"/account/bookings"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                My bookings
              </Link>
              <Link
                className="inline-flex gap-2 py-2 px-6 bg-primary rounded-full text-white"
                to={"/account/places"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                  />
                </svg>
                My accomodations
              </Link>
            </nav>
            <div className="ml-4 mr-4">
              <form onSubmit={savePlace}>
                <h2 className="text-2xl mt-4 font-semibold">Title:</h2>
                <p className="text-gray-500 text-sm">
                  Title for your place. Should attract customers.
                </p>
                <input
                  type="text"
                  required
                  placeholder="title, for example: My beautiful apartment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">Address:</h2>
                <p className="text-gray-500 text-sm">Address to your place.</p>
                <input
                  type="text"
                  placeholder="Address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">Photos:</h2>
                <p className="text-gray-500 text-sm">
                  Try to add good amount of photos of your place.
                </p>
                <div className="inline-flex gap-2">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <div className="relative">
                  <button
                    className="flex items-center gap-1 justify-center border border-gray-500 bg-gray-100 rounded-2xl p-8 mt-2 text-3xl text-gray-500"
                    onClick={handleUpload}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                      />
                    </svg>
                    Upload
                  </button>
                </div>

                <h2 className="text-2xl mt-4 font-semibold">Description:</h2>
                <p className="text-gray-500 text-sm">
                  Description of your place.
                </p>
                <textarea
                  placeholder="Add your description here"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">Perks:</h2>
                <p className="text-gray-500 text-sm">
                  Select all the perks of your place.
                </p>
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  <Perks selected={perks} onChange={setPerks} />
                </div>
                <h2 className="text-2xl mt-4 font-semibold">Extra Info:</h2>
                <p className="text-gray-500 text-sm">Rules, etc.</p>
                <textarea
                  placeholder="Rules, etc."
                  required
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                />
                <h2 className="text-2xl mt-4 font-semibold">
                  Check in and out times, max guests:
                </h2>
                <p className="text-gray-500 text-sm">
                  Add check in and check out times, remember to have some time
                  window for cleaning the room between guests.
                </p>
                <div className="grid sm:grid-cols-4 gap-2">
                  <div>
                    <h3 className="mt-2 -mb-1">Check In time:</h3>
                    <input
                      type="text"
                      placeholder="14"
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <h3 className="mt-2 -mb-1">Check Out time:</h3>
                    <input
                      type="text"
                      placeholder="11"
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                  <div>
                    <h3 className="mt-2 -mb-1">Max Guests:</h3>
                    <input
                      type="number"
                      required
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                    />
                  </div>
                  <div>
                    <h3 className="mt-2 -mb-1">Price:</h3>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price($/night)"
                    />
                  </div>
                </div>
                <div>
                  <button className="primary my-4">Save</button>
                </div>
              </form>
            </div>
          </div>
        );
      }
    }
  }
};

export default AccountPage;
