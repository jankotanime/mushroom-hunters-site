'use client';
import "./../globals.css";
import { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import OtherProfile from "./OtherProfile";
import FriendRequests from "./FreindRequests";

const Profile = (props) => {
  const myProfile = props.user === props.profile
  const result = (<div>{myProfile ? <MyProfile user = {props.user}/> : 
  <OtherProfile friends = {props.friends} friendsRequests = {props.friendsRequests} user = {props.user} profile = {props.profile}/>}
  </div>)
  return (result);
};

export default Profile;
