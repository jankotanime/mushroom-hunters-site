'use client';
import "./../globals.css";
import { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import OtherProfile from "./OtherProfile";

const Profile = (props) => {
  const myProfile = props.user === props.profile
  const result = (<div>{myProfile ? <MyProfile user = {props.user}/> : 
  <OtherProfile user = {props.user} profile = {props.profile}/>}
  </div>)
  return (result);
};

export default Profile;
