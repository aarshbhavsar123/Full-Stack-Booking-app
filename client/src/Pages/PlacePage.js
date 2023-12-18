import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
const PlacePage = () => {
    const {id} = useParams();
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

  useEffect(() => {
    axios.get("/places/" + id).then((response) => {
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
  }, []);
  return <div>{title}</div>;
};

export default PlacePage;
